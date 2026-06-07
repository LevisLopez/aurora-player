/* ═══════════════════════════════════════
   player.js — Audio engine with persistent session and play stats.
═══════════════════════════════════════ */
const Player = (() => {
  const STATE_KEY = 'aurora_player_state_v2';
  const audio = document.getElementById('audio');

  let tracks = [];
  let queueIds = [];
  let queuePos = 0;
  let isPlaying = false;
  let shuffleOn = false;
  let repeatMode = 'none';
  let currentObjectURL = null;
  let countedTrackId = null;
  let lastSavedAt = 0;
  let wakeLock = null;

  let onTrackChange = null;
  let onPlayState = null;
  let onProgress = null;
  let onQueueChange = null;
  let onStatsChange = null;

  function readState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function writeState(extra = {}) {
    const current = currentTrack();
    const state = {
      currentId: current?.id || null,
      currentTime: Number(audio.currentTime || 0),
      queueIds,
      queuePos,
      shuffleOn,
      repeatMode,
      updatedAt: Date.now(),
      ...extra,
    };
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function validIds(ids) {
    const known = new Set(tracks.map(track => Number(track.id)));
    const unique = [];
    (ids || []).map(Number).forEach(id => {
      if (known.has(id) && !unique.includes(id)) unique.push(id);
    });
    return unique;
  }

  function setQueue(ids, keepCurrent = true, notify = true) {
    const currentId = keepCurrent ? currentTrack()?.id : null;
    let base = validIds(ids);
    if (!base.length) base = tracks.map(track => track.id);
    const shuffled = shuffleOn ? shuffleArray(base) : [...base];
    queueIds = shuffled;
    if (currentId && queueIds.includes(currentId)) queuePos = queueIds.indexOf(currentId);
    else queuePos = Math.min(queuePos, Math.max(0, queueIds.length - 1));
    writeState();
    if (notify && onQueueChange) onQueueChange();
  }

  function currentTrack() {
    if (!tracks.length || !queueIds.length) return null;
    const id = queueIds[queuePos];
    return tracks.find(track => Number(track.id) === Number(id)) || null;
  }

  function updateTrackInMemory(updated) {
    if (!updated) return;
    const index = tracks.findIndex(track => Number(track.id) === Number(updated.id));
    if (index !== -1) tracks[index] = { ...tracks[index], ...updated };
  }

  async function loadTrackById(id, autoPlay = false, seekTo = 0) {
    id = Number(id);
    const track = tracks.find(item => Number(item.id) === id);
    if (!track) return;

    if (!queueIds.includes(id)) setQueue([id], false, false);
    queuePos = queueIds.indexOf(id);

    if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
    currentObjectURL = null;
    countedTrackId = null;

    const full = await dbGetTrack(id);
    if (!full || !full.blob) return;

    currentObjectURL = URL.createObjectURL(full.blob);
    audio.src = currentObjectURL;
    audio.load();

    const safeSeek = Number(seekTo || 0);
    if (safeSeek > 0) {
      const applySeek = () => {
        try {
          const max = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.5) : safeSeek;
          audio.currentTime = Math.min(safeSeek, max);
        } catch (_) {}
      };
      if (audio.readyState >= 1) applySeek();
      else audio.addEventListener('loadedmetadata', applySeek, { once: true });
    }

    updateMediaSession(track);
    if (onTrackChange) onTrackChange(track);
    writeState({ currentId: id, currentTime: safeSeek });

    if (autoPlay) {
      const promise = audio.play();
      if (promise) promise.catch(() => {});
    }
  }

  async function loadLibrary() {
    tracks = await dbGetAllTracks();
    const state = readState();
    shuffleOn = state.shuffleOn === true;
    repeatMode = ['none', 'all', 'one'].includes(state.repeatMode) ? state.repeatMode : 'none';

    if (!tracks.length) {
      queueIds = [];
      queuePos = 0;
      if (onTrackChange) onTrackChange(null);
      if (onQueueChange) onQueueChange();
      return;
    }

    const restoredQueue = validIds(state.queueIds);
    queueIds = restoredQueue.length ? restoredQueue : tracks.map(track => track.id);
    queuePos = Number.isInteger(state.queuePos) ? Math.min(Math.max(0, state.queuePos), queueIds.length - 1) : 0;

    const restoredId = Number(state.currentId || 0);
    if (restoredId && queueIds.includes(restoredId)) queuePos = queueIds.indexOf(restoredId);

    const idToLoad = queueIds[queuePos] || tracks[0].id;
    await loadTrackById(idToLoad, false, Number(state.currentTime || 0));
    if (onQueueChange) onQueueChange();
  }

  async function refreshLibrary() {
    const currentId = currentTrack()?.id || null;
    tracks = await dbGetAllTracks();

    if (!tracks.length) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
      queueIds = [];
      queuePos = 0;
      if (onTrackChange) onTrackChange(null);
      if (onQueueChange) onQueueChange();
      writeState({ currentId: null, currentTime: 0 });
      return;
    }

    const existingQueue = validIds(queueIds);
    queueIds = existingQueue.length ? existingQueue : tracks.map(track => track.id);

    if (currentId && tracks.some(track => Number(track.id) === Number(currentId))) {
      if (!queueIds.includes(currentId)) queueIds.unshift(currentId);
      queuePos = queueIds.indexOf(currentId);
      updateMediaSession(currentTrack());
    } else {
      queuePos = 0;
      await loadTrackById(queueIds[0], false, 0);
    }

    if (onQueueChange) onQueueChange();
    writeState();
  }

  function play() {
    if (!audio.src && queueIds.length) loadTrackById(queueIds[queuePos], true);
    else {
      const promise = audio.play();
      if (promise) promise.catch(() => {});
    }
  }

  function pause() { audio.pause(); }
  function togglePlay() { audio.paused ? play() : pause(); }

  async function playById(id, idsForQueue = null) {
    id = Number(id);
    if (Array.isArray(idsForQueue) && idsForQueue.length) {
      const listIds = validIds(idsForQueue);
      queueIds = shuffleOn ? shuffleArray(listIds) : listIds;
      if (!queueIds.includes(id)) queueIds.unshift(id);
      queuePos = queueIds.indexOf(id);
    } else if (!queueIds.includes(id)) {
      setQueue(tracks.map(track => track.id), false, false);
      queuePos = queueIds.indexOf(id);
    } else {
      queuePos = queueIds.indexOf(id);
    }
    await loadTrackById(id, true, 0);
    if (onQueueChange) onQueueChange();
  }

  function next(autoPlay = true) {
    if (!queueIds.length) return;
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      if (autoPlay) play();
      return;
    }
    if (queuePos >= queueIds.length - 1 && repeatMode !== 'all') return;
    queuePos = (queuePos + 1) % queueIds.length;
    loadTrackById(queueIds[queuePos], autoPlay, 0);
    if (onQueueChange) onQueueChange();
  }

  function prev() {
    if (!queueIds.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      writeState();
      return;
    }
    queuePos = (queuePos - 1 + queueIds.length) % queueIds.length;
    loadTrackById(queueIds[queuePos], true, 0);
    if (onQueueChange) onQueueChange();
  }

  function seek(ratioOrSeconds) {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    let seconds = ratioOrSeconds;
    if (ratioOrSeconds >= 0 && ratioOrSeconds <= 1) seconds = ratioOrSeconds * audio.duration;
    audio.currentTime = Math.min(Math.max(0, seconds), audio.duration);
    writeState();
  }

  function toggleShuffle() {
    shuffleOn = !shuffleOn;
    const currentId = currentTrack()?.id || null;
    const base = validIds(queueIds.length ? queueIds : tracks.map(track => track.id));
    queueIds = shuffleOn ? shuffleArray(base) : base;
    if (currentId && queueIds.includes(currentId)) queuePos = queueIds.indexOf(currentId);
    writeState();
    if (onQueueChange) onQueueChange();
    return shuffleOn;
  }

  function cycleRepeat() {
    repeatMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
    writeState();
    return repeatMode;
  }

  async function maybeCountPlayback() {
    const track = currentTrack();
    if (!track || countedTrackId === track.id) return;
    const duration = Number(audio.duration || track.duration || 0);
    const threshold = duration ? Math.min(30, Math.max(8, duration * 0.35)) : 20;
    if (audio.currentTime >= threshold || (duration && audio.currentTime >= duration - 2)) {
      countedTrackId = track.id;
      const updated = await dbIncrementPlayCount(track.id);
      updateTrackInMemory(updated);
      if (onStatsChange) onStatsChange(updated);
    }
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      if (wakeLock) return;
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) {}
  }

  async function releaseWakeLock() {
    if (!wakeLock) return;
    try { await wakeLock.release(); } catch (_) {}
    wakeLock = null;
  }

  function updateMediaSession(track) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track?.title || 'Unknown',
        artist: track?.artist || 'Unknown',
        album: 'Aurora Player',
        artwork: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });
    } catch (_) {}
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler('play', () => play());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => next(true));
      navigator.mediaSession.setActionHandler('previoustrack', () => prev());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) audio.currentTime = details.seekTime;
      });
    } catch (_) {}
  }

  audio.addEventListener('play', () => {
    isPlaying = true;
    document.body.classList.add('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    if (onPlayState) onPlayState(true);
    requestWakeLock();
    writeState();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    document.body.classList.remove('playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    if (onPlayState) onPlayState(false);
    releaseWakeLock();
    writeState();
  });

  audio.addEventListener('timeupdate', () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    if (onProgress) onProgress(ratio, audio.currentTime || 0, audio.duration || 0);
    maybeCountPlayback();
    if (Date.now() - lastSavedAt > 2500) {
      lastSavedAt = Date.now();
      writeState();
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    if (onProgress) onProgress(ratio, audio.currentTime || 0, audio.duration || 0);
  });

  audio.addEventListener('ended', () => {
    maybeCountPlayback();
    writeState({ currentTime: 0 });
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      play();
    } else if (queuePos < queueIds.length - 1 || repeatMode === 'all') {
      next(true);
    } else {
      isPlaying = false;
      if (onPlayState) onPlayState(false);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') writeState();
    if (document.visibilityState === 'visible' && isPlaying) requestWakeLock();
  });
  window.addEventListener('pagehide', () => writeState());
  window.addEventListener('beforeunload', () => writeState());

  return {
    loadLibrary,
    refreshLibrary,
    play,
    pause,
    togglePlay,
    playById,
    next,
    prev,
    seek,
    toggleShuffle,
    cycleRepeat,
    setQueue,
    formatTime,
    setupMediaSession,
    get currentTime() { return audio.currentTime || 0; },
    get duration() { return audio.duration || 0; },
    get audio() { return audio; },
    get tracks() { return tracks; },
    get queueIds() { return queueIds; },
    get isPlaying() { return isPlaying; },
    get shuffleOn() { return shuffleOn; },
    get repeatMode() { return repeatMode; },
    get currentId() { return currentTrack()?.id || null; },
    currentTrack,
    set onTrackChange(fn) { onTrackChange = fn; },
    set onPlayState(fn) { onPlayState = fn; },
    set onProgress(fn) { onProgress = fn; },
    set onQueueChange(fn) { onQueueChange = fn; },
    set onStatsChange(fn) { onStatsChange = fn; },
  };
})();
