/* ═══════════════════════════════════════
   player.js — Audio engine v5
═══════════════════════════════════════ */
const Player = (() => {

  let tracks        = [];
  let queue         = [];
  let queuePos      = 0;
  let isPlaying     = false;
  let shuffleOn     = false;
  let repeatMode    = 'none';
  let favoritesOnly = false;
  let currentObjectURL = null;

  const audio = document.getElementById('audio');
  let onTrackChange = null, onPlayState = null, onProgress = null, onQueueChange = null;

  // ── Save/restore last track ──────────────
  function saveSession() {
    const t = currentTrack();
    if (t) {
      localStorage.setItem('aurora_last_id',   t.id);
      localStorage.setItem('aurora_last_time', audio.currentTime || 0);
    }
  }

  // ── Queue ────────────────────────────────
  function buildQueue() {
    const source = favoritesOnly
      ? tracks.map((_, i) => i).filter(i => tracks[i].favorite === true)
      : tracks.map((_, i) => i);
    if (shuffleOn) {
      const arr = [...source];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      queue = arr;
    } else {
      queue = source;
    }
  }

  function currentTrack() {
    if (!tracks.length || queue.length === 0) return null;
    return tracks[queue[queuePos]] || null;
  }

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Load track ───────────────────────────
  async function loadTrack(trackIndex, autoPlay = false, seekTo = 0) {
    const pos = queue.indexOf(trackIndex);
    if (pos !== -1) queuePos = pos;
    const track = tracks[trackIndex];
    if (!track) return;
    if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
    const full = await dbGetTrack(track.id);
    if (!full || !full.blob) return;
    currentObjectURL = URL.createObjectURL(full.blob);
    audio.src = currentObjectURL;
    audio.load();
    if (seekTo > 0) audio.currentTime = seekTo;
    if (onTrackChange) onTrackChange(track);
    updateMediaSession(track);
    if (autoPlay) { const p = audio.play(); if (p) p.catch(() => {}); }
  }

  // ── Transport ────────────────────────────
  function play()       { if (!tracks.length) return; const p = audio.play(); if (p) p.catch(() => {}); }
  function pause()      { audio.pause(); }
  function togglePlay() { if (audio.paused) play(); else pause(); }

  function next(autoPlay = true) {
    if (!tracks.length || !queue.length) return;
    if (repeatMode === 'one') { audio.currentTime = 0; if (autoPlay) play(); return; }
    queuePos = (queuePos + 1) % queue.length;
    loadTrack(queue[queuePos], autoPlay);
    if (onQueueChange) onQueueChange();
  }

  function prev() {
    if (!tracks.length || !queue.length) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    queuePos = (queuePos - 1 + queue.length) % queue.length;
    loadTrack(queue[queuePos], true);
    if (onQueueChange) onQueueChange();
  }

  function seek(ratio) { if (audio.duration) audio.currentTime = ratio * audio.duration; }

  function toggleShuffle() {
    shuffleOn = !shuffleOn;
    const cur = queue[queuePos];
    buildQueue();
    const newPos = queue.indexOf(cur);
    if (newPos !== -1) queuePos = newPos;
    if (onQueueChange) onQueueChange();
    return shuffleOn;
  }

  function cycleRepeat() {
    if (repeatMode === 'none') repeatMode = 'all';
    else if (repeatMode === 'all') repeatMode = 'one';
    else repeatMode = 'none';
    return repeatMode;
  }

  // ── Load library ─────────────────────────
  async function loadLibrary() {
    tracks = await dbGetAllTracks();
    buildQueue();

    if (!tracks.length) { if (onQueueChange) onQueueChange(); return; }

    // Restore last session
    const lastId   = parseInt(localStorage.getItem('aurora_last_id')  || '0', 10);
    const lastTime = parseFloat(localStorage.getItem('aurora_last_time') || '0');
    const lastIdx  = tracks.findIndex(t => t.id === lastId);

    if (lastIdx !== -1) {
      const posInQueue = queue.indexOf(lastIdx);
      if (posInQueue !== -1) queuePos = posInQueue;
      await loadTrack(queue[queuePos], false, lastTime);
    } else {
      queuePos = 0;
      await loadTrack(queue[0], false);
    }
    if (onQueueChange) onQueueChange();
  }

  // ── Play by id ───────────────────────────
  async function playById(trackId) {
    const idx = tracks.findIndex(t => t.id === trackId);
    if (idx === -1) return;
    await loadTrack(idx, true);
    if (onQueueChange) onQueueChange();
  }

  // ── Refresh library ──────────────────────
  async function refreshLibrary() {
    const currentId = currentTrack()?.id ?? null;
    tracks = await dbGetAllTracks();
    buildQueue();
    if (!tracks.length) {
      audio.src = '';
      if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
      queuePos = 0;
      if (onTrackChange) onTrackChange(null);
      if (onQueueChange) onQueueChange();
      return;
    }
    if (currentId) {
      const newIdx = tracks.findIndex(t => t.id === currentId);
      if (newIdx !== -1) {
        const posInQueue = queue.indexOf(newIdx);
        if (posInQueue !== -1) queuePos = posInQueue;
      } else {
        queuePos = 0;
        await loadTrack(queue[0], false);
      }
    } else {
      queuePos = 0;
      await loadTrack(queue[0], false);
    }
    if (onQueueChange) onQueueChange();
  }

  // ── setFavoritesOnly ─────────────────────
  function setFavoritesOnly(val) {
    favoritesOnly = val;
    const cur = currentTrack()?.id ?? null;
    buildQueue();
    if (queue.length === 0) { queuePos = 0; }
    else {
      const newPos = queue.findIndex(i => tracks[i]?.id === cur);
      queuePos = newPos !== -1 ? newPos : 0;
    }
    if (onQueueChange) onQueueChange();
  }

  // ── Wake Lock — keeps screen/CPU alive ──
  let wakeLock = null;

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      if (wakeLock) return; // already active
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) {}
  }

  async function releaseWakeLock() {
    if (!wakeLock) return;
    try { await wakeLock.release(); } catch (_) {}
    wakeLock = null;
  }

  // Re-acquire wake lock when page becomes visible again
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isPlaying) {
      await requestWakeLock();
    }
  });

  // ── Media Session ────────────────────────
  function updateMediaSession(track) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track?.title || 'Unknown', artist: track?.artist || 'Unknown', album: 'Aurora Player',
      artwork: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ]
    });
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play',          () => play());
    navigator.mediaSession.setActionHandler('pause',         () => pause());
    navigator.mediaSession.setActionHandler('nexttrack',     () => next(true));
    navigator.mediaSession.setActionHandler('previoustrack', () => prev());
    navigator.mediaSession.setActionHandler('seekto', (d)   => { if (d.seekTime !== undefined) audio.currentTime = d.seekTime; });
  }

  // ── Audio events ─────────────────────────
  audio.addEventListener('play', () => {
    isPlaying = true;
    document.body.classList.add('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    if (onPlayState) onPlayState(true);
    requestWakeLock();
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    document.body.classList.remove('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    if (onPlayState) onPlayState(false);
    saveSession();
    releaseWakeLock();
  });
  audio.addEventListener('ended', () => {
    saveSession();
    if (repeatMode === 'one') { audio.currentTime = 0; play(); }
    else if (repeatMode === 'all') { next(true); }
    else { if (queuePos < queue.length - 1) next(true); else { isPlaying = false; if (onPlayState) onPlayState(false); } }
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const ratio = audio.currentTime / audio.duration;
    if (onProgress) onProgress(ratio, audio.currentTime, audio.duration);
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try { navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate, position: audio.currentTime }); } catch (_) {}
    }
  });

  // Save on page hide (tab switch, app close)
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveSession(); });
  window.addEventListener('pagehide', saveSession);

  return {
    loadLibrary, refreshLibrary, playById, togglePlay, next, prev, seek,
    toggleShuffle, cycleRepeat, setupMediaSession, setFavoritesOnly, currentTrack, formatTime,
    get tracks()        { return tracks; },
    get queue()         { return queue; },
    get queuePos()      { return queuePos; },
    get isPlaying()     { return isPlaying; },
    get shuffleOn()     { return shuffleOn; },
    get repeatMode()    { return repeatMode; },
    get favoritesOnly() { return favoritesOnly; },
    set onTrackChange(fn) { onTrackChange = fn; },
    set onPlayState(fn)   { onPlayState   = fn; },
    set onProgress(fn)    { onProgress    = fn; },
    set onQueueChange(fn) { onQueueChange = fn; },
  };
})();
