/* ═══════════════════════════════════════
   app.js — UI controller v4
   Favorites fix + Search
═══════════════════════════════════════ */

const $ = id => document.getElementById(id);

/* ── DOM refs ─────────────────────────── */
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
const searchInput    = $('search-input');
const searchWrap     = $('search-wrap');
const btnSearch      = $('btn-search');

// Admin
const btnBack     = $('btn-back');
const btnAddSong  = $('btn-add-song');
const fileInput   = $('file-input');
const adminList   = $('admin-list');
const adminCount  = $('admin-count');
const adminSize   = $('admin-size');
const emptyState  = $('empty-state');

// Modals
const modalRename  = $('modal-rename');
const renameTitle  = $('rename-title');
const renameArtist = $('rename-artist');
const modalCancel  = $('modal-cancel');
const modalSave    = $('modal-save');
const toastEl      = $('toast');

/* ── App state ────────────────────────── */
let activeTab    = 'all';   // 'all' | 'favorites'
let searchQuery  = '';
let renamingId   = null;
let toastTimer   = null;

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

btnOpenAdmin.addEventListener('click', () => { renderAdminList(); showScreen('admin'); });
btnBack.addEventListener('click',      () => showScreen('player'));

/* ── Player callbacks ─────────────────── */
Player.onTrackChange = (track) => {
  if (!track) {
    trackTitle.textContent  = 'No track loaded';
    trackArtist.textContent = 'Add songs to get started';
  } else {
    trackTitle.textContent  = track.title  || 'Unknown';
    trackArtist.textContent = track.artist || 'Unknown';
  }
  renderPlaylist();
};

Player.onPlayState = (playing) => {
  playIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
};

Player.onProgress = (ratio, current, total) => {
  const pct = (ratio * 100).toFixed(2) + '%';
  progressFill.style.width = pct;
  progressThumb.style.left = pct;
  timeCurrent.textContent  = Player.formatTime(current);
  timeTotal.textContent    = Player.formatTime(total);
  progressWrap.setAttribute('aria-valuenow', Math.round(ratio * 100));
};

Player.onQueueChange = () => renderPlaylist();

/* ── Transport ────────────────────────── */
btnPlay.addEventListener('click',    () => Player.togglePlay());
btnPrev.addEventListener('click',    () => Player.prev());
btnNext.addEventListener('click',    () => Player.next(true));

btnShuffle.addEventListener('click', () => {
  const on = Player.toggleShuffle();
  btnShuffle.classList.toggle('on', on);
  showToast(on ? 'Shuffle on' : 'Shuffle off');
});

btnRepeat.addEventListener('click', () => {
  const mode = Player.cycleRepeat();
  const icon = btnRepeat.querySelector('i');
  btnRepeat.classList.remove('on');
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

/* ── Seek ─────────────────────────────── */
function seekFromEvent(e) {
  const rect  = progressWrap.getBoundingClientRect();
  const x     = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  Player.seek(Math.min(Math.max(x / rect.width, 0), 1));
}
progressWrap.addEventListener('click',      seekFromEvent);
progressWrap.addEventListener('touchstart', seekFromEvent, { passive: true });

/* ── Search ───────────────────────────── */
btnSearch.addEventListener('click', () => {
  const open = searchWrap.classList.toggle('open');
  if (open) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    searchQuery = '';
    renderPlaylist();
  }
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.toLowerCase().trim();
  renderPlaylist();
});

/* ── Tabs ─────────────────────────────── */
tabAll.addEventListener('click', () => {
  if (activeTab === 'all') return;
  activeTab = 'all';
  tabAll.classList.add('active');
  tabFav.classList.remove('active');
  Player.setFavoritesOnly(false);
  renderPlaylist();
});

tabFav.addEventListener('click', () => {
  if (activeTab === 'favorites') return;
  activeTab = 'favorites';
  tabFav.classList.add('active');
  tabAll.classList.remove('active');
  Player.setFavoritesOnly(true);
  renderPlaylist();
});

/* ── Playlist render ──────────────────── */
function getDisplayTracks() {
  let list = Player.tracks;

  // Filter by tab
  if (activeTab === 'favorites') {
    list = list.filter(t => t.favorite === true);
  }

  // Filter by search
  if (searchQuery) {
    list = list.filter(t =>
      (t.title  || '').toLowerCase().includes(searchQuery) ||
      (t.artist || '').toLowerCase().includes(searchQuery)
    );
  }

  return list;
}

function renderPlaylist() {
  const current       = Player.currentTrack();
  const displayTracks = getDisplayTracks();

  // Count label
  const total = Player.tracks.length;
  playlistCount.textContent = activeTab === 'favorites'
    ? `${displayTracks.length} of ${total}`
    : `${displayTracks.length} song${displayTracks.length !== 1 ? 's' : ''}`;

  // Empty favorites
  const noFavs = activeTab === 'favorites' && displayTracks.length === 0 && !searchQuery;
  emptyFavorites.hidden    = !noFavs;
  playlistEl.style.display = noFavs ? 'none' : '';

  if (!displayTracks.length) { playlistEl.innerHTML = ''; return; }

  playlistEl.innerHTML = displayTracks.map((t, idx) => {
    const isActive = t.id === current?.id;
    const isFav    = t.favorite === true;

    const numLabel = isActive
      ? `<div class="playing-bars" aria-label="Playing"><span></span><span></span><span></span></div>`
      : `<span class="pl-num">${idx + 1}</span>`;

    return `
      <div class="playlist-item ${isActive ? 'active' : ''}" data-track-id="${t.id}" role="button" tabindex="0">
        ${numLabel}
        <div class="pl-info">
          <div class="pl-title">${escHtml(t.title || 'Unknown')}</div>
          <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
        </div>
        <button class="fav-btn ${isFav ? 'on' : ''}" data-id="${t.id}"
          aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
        </button>
        <span class="pl-dur">${t.duration ? Player.formatTime(t.duration) : '—'}</span>
      </div>`;
  }).join('');

  // Click row → play
  playlistEl.querySelectorAll('.playlist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      Player.playById(parseInt(el.dataset.trackId, 10));
    });
  });

  // Heart → toggle favorite
  playlistEl.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id     = parseInt(btn.dataset.id, 10);
      const isFav  = btn.classList.contains('on');
      const newFav = !isFav;

      // 1. Write to DB
      await dbToggleFavorite(id);

      // 2. Update in-memory track directly (no full reload needed)
      const track = Player.tracks.find(t => t.id === id);
      if (track) track.favorite = newFav;

      // 3. If favoritesOnly mode changed, rebuild queue
      if (activeTab === 'favorites') {
        Player.setFavoritesOnly(true);
      }

      // 4. Re-render
      renderPlaylist();
      showToast(newFav ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });

  // Scroll active into view
  const activeEl = playlistEl.querySelector('.playlist-item.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Admin render ─────────────────────── */
async function renderAdminList() {
  const tracks    = Player.tracks;
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
        <button class="admin-btn edit-btn"   aria-label="Edit"   data-id="${t.id}"><i class="ti ti-pencil"></i></button>
        <button class="admin-btn delete delete-btn" aria-label="Delete" data-id="${t.id}"><i class="ti ti-trash"></i></button>
      </div>
    </div>`).join('');

  adminList.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => openRenameModal(parseInt(btn.dataset.id, 10))));
  adminList.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteSong(parseInt(btn.dataset.id, 10))));
}

/* ── File import ──────────────────────── */
btnAddSong.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  if (!files.length) return;

  const AUDIO_EXTS = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  let added = 0, skipped = 0;

  for (const file of files) {
    const validMime = file.type.startsWith('audio/') || file.type.startsWith('video/mp4');
    const validExt  = AUDIO_EXTS.test(file.name);
    if (!validMime && !validExt) { skipped++; continue; }

    const nameNoExt = file.name.replace(/\.[^/.]+$/, '');
    let title = nameNoExt, artist = 'Unknown';
    const dash = nameNoExt.indexOf(' - ');
    if (dash !== -1) { artist = nameNoExt.slice(0, dash).trim(); title = nameNoExt.slice(dash + 3).trim(); }

    const duration = await getAudioDuration(file);
    await dbSaveTrack({ title, artist, blob: file, duration, size: file.size, favorite: false });
    added++;
  }

  fileInput.value = '';
  if (added > 0) {
    await Player.refreshLibrary();
    renderAdminList();
    renderPlaylist();
    const msg = skipped > 0 ? `${added} added, ${skipped} skipped` : `${added} song${added > 1 ? 's' : ''} added`;
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
    a.addEventListener('loadedmetadata', () => { URL.revokeObjectURL(url); resolve(isFinite(a.duration) ? a.duration : 0); });
    a.addEventListener('error',          () => { URL.revokeObjectURL(url); resolve(0); });
  });
}

/* ── Delete ───────────────────────────── */
async function deleteSong(id) {
  if (!confirm('Remove this song from your library?')) return;
  await dbDeleteTrack(id);
  await Player.refreshLibrary();
  renderAdminList();
  renderPlaylist();
  showToast('Song removed');
}

/* ── Rename modal ─────────────────────── */
function openRenameModal(id) {
  const track = Player.tracks.find(t => t.id === id);
  if (!track) return;
  renamingId         = id;
  renameTitle.value  = track.title  || '';
  renameArtist.value = track.artist || '';
  modalRename.hidden = false;
  renameTitle.focus();
}

modalCancel.addEventListener('click', () => { modalRename.hidden = true; renamingId = null; });
modalRename.addEventListener('click', (e) => { if (e.target === modalRename) { modalRename.hidden = true; renamingId = null; } });

modalSave.addEventListener('click', async () => {
  if (!renamingId) return;
  await dbUpdateTrack(renamingId, {
    title:  renameTitle.value.trim()  || 'Unknown',
    artist: renameArtist.value.trim() || 'Unknown',
  });
  await Player.refreshLibrary();
  renderAdminList();
  renderPlaylist();
  modalRename.hidden = true;
  renamingId = null;
  showToast('Track updated');
});

/* ── Util ─────────────────────────────── */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Sleep Timer UI ───────────────────── */
const btnSleepOpen     = $('btn-sleep');
const modalSleep       = $('modal-sleep');
const modalSleepCancel = $('modal-sleep-cancel');
const sleepCustomInput = $('sleep-custom-input');
const sleepCustomSet   = $('sleep-custom-set');

btnSleepOpen.addEventListener('click', () => {
  if (SleepTimer.active) { SleepTimer.cancel(); showToast('Sleep timer cancelled'); return; }
  modalSleep.hidden = false;
});
modalSleepCancel.addEventListener('click', () => { modalSleep.hidden = true; });
modalSleep.addEventListener('click', (e) => { if (e.target === modalSleep) modalSleep.hidden = true; });

document.querySelectorAll('.sleep-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    SleepTimer.start(parseInt(btn.dataset.minutes, 10));
    modalSleep.hidden = true;
    showToast(`Sleep timer: ${btn.textContent}`);
  });
});

sleepCustomSet.addEventListener('click', () => {
  const val = parseInt(sleepCustomInput.value, 10);
  if (!val || val < 1 || val > 480) { showToast('Enter 1–480 minutes'); return; }
  SleepTimer.start(val);
  modalSleep.hidden = true;
  sleepCustomInput.value = '';
  showToast(`Sleep timer: ${val} min`);
});

/* ── Init ─────────────────────────────── */
(async () => {
  Player.setupMediaSession();
  await Player.loadLibrary();
  renderPlaylist();
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
