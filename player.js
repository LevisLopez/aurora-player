/* ═══════════════════════════════════════
   player.js — Audio engine
   Handles: playback, shuffle, repeat,
   progress, Media Session API (lock screen)
═══════════════════════════════════════ */

const Player = (() => {

  // ── State ──────────────────────────────
  let tracks        = [];   // array of track objects from DB
  let queue         = [];   // playback order (indexes into tracks[])
  let queuePos      = 0;    // current position in queue
  let isPlaying     = false;
  let shuffleOn     = false;
  let repeatMode    = 'none'; // 'none' | 'all' | 'one'
  let currentObjectURL = null;

  const audio = document.getElementById('audio');

  // ── Callbacks (set by app.js) ───────────
  let onTrackChange = null;
  let onPlayState   = null;
  let onProgress    = null;
  let onQueueChange = null;

  // ── Helpers ────────────────────────────
  function buildQueue() {
    if (shuffleOn) {
      const arr = tracks.map((_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      queue = arr;
    } else {
      queue = tracks.map((_, i) => i);
    }
  }

  function currentTrack() {
    if (!tracks.length) return null;
    return tracks[queue[queuePos]] || null;
  }

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Load & play a track ─────────────────
  async function loadTrack(trackIndex, autoPlay = false) {
    // find position in queue
    const pos = queue.indexOf(trackIndex);
    if (pos !== -1) queuePos = pos;

    const track = tracks[trackIndex];
    if (!track) return;

    // revoke previous object URL
    if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);

    // fetch blob from IndexedDB
    const full = await dbGetTrack(track.id);
    if (!full || !full.blob) return;

    currentObjectURL = URL.createObjectURL(full.blob);
    audio.src = currentObjectURL;
    audio.load();

    if (onTrackChange) onTrackChange(track);
    updateMediaSession(track);

    if (autoPlay) {
      const p = audio.play();
      if (p) p.catch(() => {});
    }
  }

  // ── Transport controls ──────────────────
  function play() {
    if (!tracks.length) return;
    const p = audio.play();
    if (p) p.catch(() => {});
  }

  function pause() {
    audio.pause();
  }

  function togglePlay() {
    if (audio.paused) play();
    else pause();
  }

  function next(autoPlay = true) {
    if (!tracks.length) return;
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      if (autoPlay) play();
      return;
    }
    queuePos = (queuePos + 1) % queue.length;
    loadTrack(queue[queuePos], autoPlay);
    if (onQueueChange) onQueueChange();
  }

  function prev() {
    if (!tracks.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    queuePos = (queuePos - 1 + queue.length) % queue.length;
    loadTrack(queue[queuePos], true);
    if (onQueueChange) onQueueChange();
  }

  function seek(ratio) {
    if (!audio.duration) return;
    audio.currentTime = ratio * audio.duration;
  }

  // ── Shuffle ─────────────────────────────
  function toggleShuffle() {
    shuffleOn = !shuffleOn;
    const cur = queue[queuePos];
    buildQueue();
    // keep current track at current position
    const newPos = queue.indexOf(cur);
    if (newPos !== -1) queuePos = newPos;
    if (onQueueChange) onQueueChange();
    return shuffleOn;
  }

  // ── Repeat ──────────────────────────────
  function cycleRepeat() {
    if (repeatMode === 'none') repeatMode = 'all';
    else if (repeatMode === 'all') repeatMode = 'one';
    else repeatMode = 'none';
    return repeatMode;
  }

  // ── Load tracks list from DB ─────────────
  async function loadLibrary() {
    tracks = await dbGetAllTracks();
    buildQueue();
    queuePos = 0;
    if (tracks.length > 0) {
      await loadTrack(queue[0], false);
    }
    if (onQueueChange) onQueueChange();
  }

  // ── Play by track id ─────────────────────
  async function playById(trackId) {
    const idx = tracks.findIndex(t => t.id === trackId);
    if (idx === -1) return;
    await loadTrack(idx, true);
    if (onQueueChange) onQueueChange();
  }

  // ── Reload library and keep current ──────
  async function refreshLibrary() {
    const currentId = currentTrack()?.id ?? null;
    tracks = await dbGetAllTracks();
    buildQueue();

    if (tracks.length === 0) {
      audio.src = '';
      if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
      queuePos = 0;
      if (onTrackChange) onTrackChange(null);
      if (onQueueChange) onQueueChange();
      return;
    }

    // try to stay on same track
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

  // ── Media Session API (lock screen) ──────
  function updateMediaSession(track) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title:  track?.title  || 'Unknown',
      artist: track?.artist || 'Unknown',
      album:  'Aurora Player',
      artwork: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ]
    });
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play',         () => play());
    navigator.mediaSession.setActionHandler('pause',        () => pause());
    navigator.mediaSession.setActionHandler('nexttrack',    () => next(true));
    navigator.mediaSession.setActionHandler('previoustrack',() => prev());
    navigator.mediaSession.setActionHandler('seekto', (d)  => {
      if (d.seekTime !== undefined) audio.currentTime = d.seekTime;
    });
  }

  // ── Audio events ─────────────────────────
  audio.addEventListener('play', () => {
    isPlaying = true;
    document.body.classList.add('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    if (onPlayState) onPlayState(true);
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    document.body.classList.remove('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    if (onPlayState) onPlayState(false);
  });

  audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      play();
    } else if (repeatMode === 'all') {
      next(true);
    } else {
      // 'none': stop at last track
      if (queuePos < queue.length - 1) next(true);
      else { isPlaying = false; if (onPlayState) onPlayState(false); }
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const ratio = audio.currentTime / audio.duration;
    if (onProgress) onProgress(ratio, audio.currentTime, audio.duration);
    // update Media Session position
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({
          duration:     audio.duration,
          playbackRate: audio.playbackRate,
          position:     audio.currentTime,
        });
      } catch (_) {}
    }
  });

  // ── Public API ───────────────────────────
  return {
    loadLibrary,
    refreshLibrary,
    playById,
    togglePlay,
    next,
    prev,
    seek,
    toggleShuffle,
    cycleRepeat,
    setupMediaSession,
    currentTrack,
    get tracks()     { return tracks; },
    get queue()      { return queue; },
    get queuePos()   { return queuePos; },
    get isPlaying()  { return isPlaying; },
    get shuffleOn()  { return shuffleOn; },
    get repeatMode() { return repeatMode; },
    formatTime,
    set onTrackChange(fn) { onTrackChange = fn; },
    set onPlayState(fn)   { onPlayState   = fn; },
    set onProgress(fn)    { onProgress    = fn; },
    set onQueueChange(fn) { onQueueChange = fn; },
  };

})();
