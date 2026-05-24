/* ═══════════════════════════════════════
   app.js — UI controller
   Handles: screen nav, player UI,
   admin panel, file import, modals
═══════════════════════════════════════ */

/* ── DOM refs ─────────────────────────── */
const $ = id => document.getElementById(id);

// Player screen
const screenPlayer   = $('screen-player');
const screenAdmin    = $('screen-admin');
const trackTitle     = $('track-title');
const trackArtist    = $('track-artist');
const progressFill   = $('progress-fill');
const progressThumb  = $('progress-thumb');
const progressWrap   = $('progress-wrap');
const timeCurrent    = $('time-current');
const timeTotal      = $('time-total');
const playIcon       = $('play-icon');
const btnPlay        = $('btn-play');
const btnPrev        = $('btn-prev');
const btnNext        = $('btn-next');
const btnShuffle     = $('btn-shuffle');
const btnRepeat      = $('btn-repeat');
const btnOpenAdmin   = $('btn-open-admin');
const playlistEl     = $('playlist');
const playlistCount  = $('playlist-count');
const tabAll         = $('tab-all');
const tabFav         = $('tab-fav');
const emptyFavorites = $('empty-favorites');

// Admin screen
const btnBack       = $('btn-back');
const btnAddSong    = $('btn-add-song');
const fileInput     = $('file-input');
const adminList     = $('admin-list');
const adminCount    = $('admin-count');
const adminSize     = $('admin-size');
const emptyState    = $('empty-state');

// Modal
const modalRename   = $('modal-rename');
const renameTitle   = $('rename-title');
const renameArtist  = $('rename-artist');
const modalCancel   = $('modal-cancel');
const modalSave     = $('modal-save');

// Toast
const toastEl       = $('toast');

let renamingId = null;
let toastTimer = null;

/* ── Toast ───────────────────────────── */
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

/* ── Screen navigation ───────────────── */
function showScreen(name) {
  screenPlayer.classList.toggle('active', name === 'player');
  screenAdmin.classList.toggle('active', name === 'admin');
}

btnOpenAdmin.addEventListener('click', () => {
  renderAdminList();
  showScreen('admin');
});

btnBack.addEventListener('click', () => {
  showScreen('player');
});

/* ── Player callbacks ─────────────────── */
Player.onTrackChange = (track) => {
  if (!track) {
    trackTitle.textContent  = 'No track loaded';
    trackArtist.textContent = 'Add songs to get started';
    return;
  }
  trackTitle.textContent  = track.title  || 'Unknown';
  trackArtist.textContent = track.artist || 'Unknown';
  renderPlaylist();
};

Player.onPlayState = (playing) => {
  playIcon.className = playing
    ? 'ti ti-player-pause'
    : 'ti ti-player-play';
};

Player.onProgress = (ratio, current, total) => {
  const pct = (ratio * 100).toFixed(2) + '%';
  progressFill.style.width = pct;
  progressThumb.style.left = pct;
  timeCurrent.textContent  = Player.formatTime(current);
  timeTotal.textContent    = Player.formatTime(total);
  progressWrap.setAttribute('aria-valuenow', Math.round(ratio * 100));
};

Player.onQueueChange = () => {
  renderPlaylist();
};

/* ── Transport buttons ────────────────── */
btnPlay.addEventListener('click', () => Player.togglePlay());
btnPrev.addEventListener('click', () => Player.prev());
btnNext.addEventListener('click', () => Player.next(true));

btnShuffle.addEventListener('click', () => {
  const on = Player.toggleShuffle();
  btnShuffle.classList.toggle('on', on);
  showToast(on ? 'Shuffle on' : 'Shuffle off');
});

btnRepeat.addEventListener('click', () => {
  const mode = Player.cycleRepeat();
  btnRepeat.classList.remove('on');
  const icon = btnRepeat.querySelector('i');
  if (mode === 'none') {
    icon.className = 'ti ti-repeat';
  } else if (mode === 'all') {
    btnRepeat.classList.add('on');
    icon.className = 'ti ti-repeat';
    showToast('Repeat all');
  } else {
    btnRepeat.classList.add('on');
    icon.className = 'ti ti-repeat-once';
    showToast('Repeat one');
  }
});

/* ── Tabs: ALL | FAVORITES ────────────── */
tabAll.addEventListener('click', async () => {
  tabAll.classList.add('active');
  tabFav.classList.remove('active');
  Player.setFavoritesOnly(false);
  await Player.refreshLibrary();
  renderPlaylist();
});

tabFav.addEventListener('click', async () => {
  tabFav.classList.add('active');
  tabAll.classList.remove('active');
  Player.setFavoritesOnly(true);
  await Player.refreshLibrary();
  renderPlaylist();
});
function seekFromEvent(e) {
  const rect  = progressWrap.getBoundingClientRect();
  const x     = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const ratio = Math.min(Math.max(x / rect.width, 0), 1);
  Player.seek(ratio);
}
progressWrap.addEventListener('click',      seekFromEvent);
progressWrap.addEventListener('touchstart', seekFromEvent, { passive: true });

/* ── Playlist render ──────────────────── */
function renderPlaylist() {
  const tracks  = Player.tracks;
  const queue   = Player.queue;
  const current = Player.currentTrack();
  const favOnly = Player.favoritesOnly;

  // Which tracks to show in the list (visual, not playback queue)
  const displayTracks = favOnly
    ? tracks.filter(t => t.favorite)
    : tracks;

  playlistCount.textContent = `${displayTracks.length} song${displayTracks.length !== 1 ? 's' : ''}`;

  // Show empty favorites message if needed
  const noFavs = favOnly && displayTracks.length === 0;
  emptyFavorites.hidden = !noFavs;
  playlistEl.style.display = noFavs ? 'none' : '';

  if (!displayTracks.length) {
    playlistEl.innerHTML = '';
    return;
  }

  // Build display: show position number from queue if in queue, else just index
  playlistEl.innerHTML = displayTracks.map((t, displayIdx) => {
    const isActive  = t.id === current?.id;
    const isFav     = !!t.favorite;

    const numLabel = isActive
      ? `<div class="playing-bars" aria-label="Playing"><span></span><span></span><span></span></div>`
      : `<span class="pl-num">${displayIdx + 1}</span>`;

    return `
      <div class="playlist-item ${isActive ? 'active' : ''}" data-track-id="${t.id}" role="button" tabindex="0">
        ${numLabel}
        <div class="pl-info">
          <div class="pl-title">${escHtml(t.title || 'Unknown')}</div>
          <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
        </div>
        <button class="fav-btn ${isFav ? 'on' : ''}" data-id="${t.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
        </button>
        <span class="pl-dur">${t.duration ? Player.formatTime(t.duration) : '—'}</span>
      </div>`;
  }).join('');

  // Click row → play
  playlistEl.querySelectorAll('.playlist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return; // don't trigger play on heart tap
      const id = parseInt(el.dataset.trackId, 10);
      Player.playById(id);
    });
  });

  // Heart button → toggle favorite
  playlistEl.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id  = parseInt(btn.dataset.id, 10);

      // Optimistic UI: flip the icon immediately
      const isFavNow = !btn.classList.contains('on');
      btn.classList.toggle('on', isFavNow);
      btn.querySelector('i').className = `ti ti-heart${isFavNow ? '-filled' : ''}`;
      btn.setAttribute('aria-label', isFavNow ? 'Remove from favorites' : 'Add to favorites');

      // Persist to IndexedDB
      await dbToggleFavorite(id);

      // Refresh library so Player.tracks has updated favorite flags
      await Player.refreshLibrary();

      // If in favorites tab and this song was unfavorited, remove it from view
      if (Player.favoritesOnly && !isFavNow) {
        renderPlaylist();
      }

      showToast(isFavNow ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });

  // Scroll active into view
  const activeEl = playlistEl.querySelector('.playlist-item.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Admin list render ────────────────── */
async function renderAdminList() {
  const tracks = Player.tracks;

  // update stats
  const totalSize = await dbGetTotalSize();
  adminCount.textContent = `${tracks.length} song${tracks.length !== 1 ? 's' : ''}`;
  adminSize.textContent  = `${(totalSize / 1024 / 1024).toFixed(1)} MB used`;

  emptyState.classList.toggle('visible', tracks.length === 0);

  if (!tracks.length) { adminList.innerHTML = ''; return; }

  adminList.innerHTML = tracks.map(t => `
    <div class="admin-item" data-id="${t.id}">
      <div class="admin-thumb"><i class="ti ti-music"></i></div>
      <div class="admin-info-col">
        <div class="admin-title">${escHtml(t.title || 'Unknown')}</div>
        <div class="admin-artist">${escHtml(t.artist || 'Unknown')}</div>
      </div>
      <div class="admin-actions">
        <button class="admin-btn edit-btn" aria-label="Edit" data-id="${t.id}">
          <i class="ti ti-pencil"></i>
        </button>
        <button class="admin-btn delete delete-btn" aria-label="Delete" data-id="${t.id}">
          <i class="ti ti-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  adminList.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openRenameModal(parseInt(btn.dataset.id, 10)));
  });

  adminList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteSong(parseInt(btn.dataset.id, 10)));
  });
}

/* ── File import ──────────────────────── */
btnAddSong.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  if (!files.length) return;

  // Audio extensions accepted — covers files with wrong/empty MIME type (common on Android)
  const AUDIO_EXTS = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;

  let added = 0;
  let skipped = 0;
  for (const file of files) {
    const validMime = file.type.startsWith('audio/') || file.type.startsWith('video/mp4');
    const validExt  = AUDIO_EXTS.test(file.name);
    if (!validMime && !validExt) { skipped++; continue; }

    // parse title/artist from filename  e.g. "Artist - Title.mp3"
    const nameNoExt = file.name.replace(/\.[^/.]+$/, '');
    let title  = nameNoExt;
    let artist = 'Unknown';

    const dashIdx = nameNoExt.indexOf(' - ');
    if (dashIdx !== -1) {
      artist = nameNoExt.slice(0, dashIdx).trim();
      title  = nameNoExt.slice(dashIdx + 3).trim();
    }

    // get duration
    const duration = await getAudioDuration(file);

    await dbSaveTrack({
      title,
      artist,
      blob:     file,
      duration,
      size:     file.size,
    });
    added++;
  }

  fileInput.value = '';

  if (added > 0) {
    await Player.refreshLibrary();
    renderAdminList();
    const msg = skipped > 0
      ? `${added} added, ${skipped} format not supported`
      : `${added} song${added > 1 ? 's' : ''} added`;
    showToast(msg);
  } else if (skipped > 0) {
    showToast('No supported audio files found');
  }
});

function getAudioDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const a   = new Audio();
    a.src     = url;
    a.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(isFinite(a.duration) ? a.duration : 0);
    });
    a.addEventListener('error', () => { URL.revokeObjectURL(url); resolve(0); });
  });
}

/* ── Delete song ──────────────────────── */
async function deleteSong(id) {
  if (!confirm('Remove this song from your library?')) return;
  await dbDeleteTrack(id);
  await Player.refreshLibrary();
  renderAdminList();
  showToast('Song removed');
}

/* ── Rename modal ─────────────────────── */
function openRenameModal(id) {
  const track = Player.tracks.find(t => t.id === id);
  if (!track) return;
  renamingId             = id;
  renameTitle.value      = track.title  || '';
  renameArtist.value     = track.artist || '';
  modalRename.hidden     = false;
  renameTitle.focus();
}

modalCancel.addEventListener('click', () => {
  modalRename.hidden = true;
  renamingId = null;
});

modalSave.addEventListener('click', async () => {
  if (!renamingId) return;
  const newTitle  = renameTitle.value.trim()  || 'Unknown';
  const newArtist = renameArtist.value.trim() || 'Unknown';
  await dbUpdateTrack(renamingId, { title: newTitle, artist: newArtist });
  await Player.refreshLibrary();
  renderAdminList();
  modalRename.hidden = true;
  renamingId = null;
  showToast('Track updated');
});

modalRename.addEventListener('click', (e) => {
  if (e.target === modalRename) { modalRename.hidden = true; renamingId = null; }
});

/* ── Util ─────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Init ─────────────────────────────── */
(async () => {
  Player.setupMediaSession();
  await Player.loadLibrary();
  renderPlaylist();
})();

/* ── Service Worker ───────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* ── Sleep Timer UI ───────────────────── */
const btnSleepOpen      = $('btn-sleep');
const modalSleep        = $('modal-sleep');
const modalSleepCancel  = $('modal-sleep-cancel');
const sleepCustomInput  = $('sleep-custom-input');
const sleepCustomSet    = $('sleep-custom-set');

btnSleepOpen.addEventListener('click', () => {
  if (SleepTimer.active) {
    SleepTimer.cancel();
    showToast('Sleep timer cancelled');
    return;
  }
  modalSleep.hidden = false;
});

modalSleepCancel.addEventListener('click', () => {
  modalSleep.hidden = true;
});

modalSleep.addEventListener('click', (e) => {
  if (e.target === modalSleep) modalSleep.hidden = true;
});

// Quick option buttons
document.querySelectorAll('.sleep-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const minutes = parseInt(btn.dataset.minutes, 10);
    SleepTimer.start(minutes);
    modalSleep.hidden = true;
    showToast(`Sleep timer set for ${btn.textContent}`);
  });
});

// Custom minutes
sleepCustomSet.addEventListener('click', () => {
  const val = parseInt(sleepCustomInput.value, 10);
  if (!val || val < 1 || val > 480) {
    showToast('Enter a value between 1 and 480 minutes');
    return;
  }
  SleepTimer.start(val);
  modalSleep.hidden = true;
  sleepCustomInput.value = '';
  showToast(`Sleep timer set for ${val} min`);
});
