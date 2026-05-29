/* ═══════════════════════════════════════
   app.js — UI controller v5
   Favorites fix + Search + Last track + Duplicate check
═══════════════════════════════════════ */
const $ = id => document.getElementById(id);

/* ── DOM ──────────────────────────────── */
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
const btnSearch      = $('btn-search');
const searchWrap     = $('search-wrap');
const searchInput    = $('search-input');
const searchResults  = $('search-results');
const searchBack     = $('search-back');
const playlistEl     = $('playlist');
const playlistCount  = $('playlist-count');
const tabAll         = $('tab-all');
const tabFav         = $('tab-fav');
const emptyFavorites = $('empty-favorites');
const btnBack        = $('btn-back');
const btnAddSong     = $('btn-add-song');
const fileInput      = $('file-input');
const adminList      = $('admin-list');
const adminCount     = $('admin-count');
const adminSize      = $('admin-size');
const emptyState     = $('empty-state');
const modalRename    = $('modal-rename');
const renameTitle    = $('rename-title');
const renameArtist   = $('rename-artist');
const modalCancel    = $('modal-cancel');
const modalSave      = $('modal-save');
const toastEl        = $('toast');

/* ── State ────────────────────────────── */
let activeTab   = 'all';
let searchQuery = '';
let renamingId  = null;
let toastTimer  = null;

/* ── Toast ───────────────────────────── */
function showToast(msg, duration = 2500) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}

/* ── Screens ──────────────────────────── */
function showScreen(name) {
  screenPlayer.classList.toggle('active', name === 'player');
  screenAdmin.classList.toggle('active',  name === 'admin');
}
btnOpenAdmin.addEventListener('click', () => { renderAdminList(); showScreen('admin'); });
btnBack.addEventListener('click',      () => showScreen('player'));

/* ── Player callbacks ─────────────────── */
Player.onTrackChange = (track) => {
  trackTitle.textContent  = track?.title  || 'No track loaded';
  trackArtist.textContent = track?.artist || 'Add songs to get started';
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
};
Player.onQueueChange = () => renderPlaylist();

/* ── Transport ────────────────────────── */
btnPlay.addEventListener('click',    () => Player.togglePlay());
btnPrev.addEventListener('click',    () => Player.prev());
btnNext.addEventListener('click',    () => Player.next(true));
btnShuffle.addEventListener('click', () => {
  btnShuffle.classList.toggle('on', Player.toggleShuffle());
  showToast(Player.shuffleOn ? 'Shuffle on' : 'Shuffle off');
});
btnRepeat.addEventListener('click', () => {
  const mode = Player.cycleRepeat();
  const icon = btnRepeat.querySelector('i');
  btnRepeat.classList.toggle('on', mode !== 'none');
  icon.className = mode === 'one' ? 'ti ti-repeat-once' : 'ti ti-repeat';
  if (mode !== 'none') showToast(mode === 'all' ? 'Repeat all' : 'Repeat one');
});

/* ── Seek ─────────────────────────────── */
function seekFromEvent(e) {
  const rect = progressWrap.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  Player.seek(Math.min(Math.max(x / rect.width, 0), 1));
}
progressWrap.addEventListener('click',      seekFromEvent);
progressWrap.addEventListener('touchstart', seekFromEvent, { passive: true });

/* ── Search overlay ──────────────────── */
function openSearch() {
  searchWrap.classList.add('open');
  setTimeout(() => searchInput.focus(), 300);
}
function closeSearch() {
  searchWrap.classList.remove('open');
  searchInput.value = '';
  searchQuery = '';
  searchResults.innerHTML = '';
}

btnSearch.addEventListener('click', openSearch);
searchBack.addEventListener('click', closeSearch);

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.toLowerCase().trim();
  renderSearchResults();
});

function renderSearchResults() {
  const current = Player.currentTrack();
  let list = Player.tracks;
  if (searchQuery) {
    list = list.filter(t =>
      (t.title  || '').toLowerCase().includes(searchQuery) ||
      (t.artist || '').toLowerCase().includes(searchQuery)
    );
  }

  if (!searchQuery) { searchResults.innerHTML = '<div style="padding:20px;color:var(--text3);text-align:center;font-size:14px;">Type to search...</div>'; return; }
  if (!list.length)  { searchResults.innerHTML = '<div style="padding:20px;color:var(--text3);text-align:center;font-size:14px;">No results found</div>'; return; }

  searchResults.innerHTML = list.map((t, idx) => {
    const isActive = t.id === current?.id;
    const isFav    = t.favorite === true;
    return `
      <div class="playlist-item ${isActive ? 'active' : ''}" data-id="${t.id}" role="button" tabindex="0">
        <span class="pl-num">${idx + 1}</span>
        <div class="pl-info">
          <div class="pl-title">${escHtml(t.title  || 'Unknown')}</div>
          <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
        </div>
        <button class="fav-btn ${isFav ? 'on' : ''}" data-id="${t.id}" aria-label="Favorite">
          <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
        </button>
        <span class="pl-dur">${t.duration ? Player.formatTime(t.duration) : '—'}</span>
      </div>`;
  }).join('');

  searchResults.querySelectorAll('.playlist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      Player.playById(parseInt(el.dataset.id, 10));
      closeSearch();
    });
  });

  searchResults.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id     = parseInt(btn.dataset.id, 10);
      const newFav = !(btn.classList.contains('on'));
      await dbToggleFavorite(id);
      const t = Player.tracks.find(t => t.id === id);
      if (t) t.favorite = newFav;
      if (activeTab === 'favorites') Player.setFavoritesOnly(true);
      renderPlaylist();
      renderSearchResults();
      showToast(newFav ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });
}

/* ── Tabs ─────────────────────────────── */
tabAll.addEventListener('click', () => {
  if (activeTab === 'all') return;
  activeTab = 'all';
  tabAll.classList.add('active');
  tabFav.classList.remove('active');
  Player.setFavoritesOnly(false);
});
tabFav.addEventListener('click', () => {
  if (activeTab === 'favorites') return;
  activeTab = 'favorites';
  tabFav.classList.add('active');
  tabAll.classList.remove('active');
  Player.setFavoritesOnly(true);
});

/* ── Playlist ─────────────────────────── */
function getDisplayTracks() {
  let list = [...Player.tracks];
  if (activeTab === 'favorites') list = list.filter(t => t.favorite === true);
  if (searchQuery) list = list.filter(t =>
    (t.title  || '').toLowerCase().includes(searchQuery) ||
    (t.artist || '').toLowerCase().includes(searchQuery)
  );
  return list;
}

function renderPlaylist() {
  const current = Player.currentTrack();
  const display = getDisplayTracks();

  playlistCount.textContent = activeTab === 'favorites'
    ? `${display.length} favorite${display.length !== 1 ? 's' : ''}`
    : `${display.length} song${display.length !== 1 ? 's' : ''}`;

  const noFavs = activeTab === 'favorites' && display.length === 0 && !searchQuery;
  emptyFavorites.hidden    = !noFavs;
  playlistEl.style.display = noFavs ? 'none' : '';

  if (!display.length) { playlistEl.innerHTML = ''; return; }

  playlistEl.innerHTML = display.map((t, idx) => {
    const isActive = t.id === current?.id;
    const isFav    = t.favorite === true;
    const numLabel = isActive
      ? `<div class="playing-bars" aria-label="Playing"><span></span><span></span><span></span></div>`
      : `<span class="pl-num">${idx + 1}</span>`;
    return `
      <div class="playlist-item ${isActive ? 'active' : ''}" data-id="${t.id}" role="button" tabindex="0">
        ${numLabel}
        <div class="pl-info">
          <div class="pl-title">${escHtml(t.title  || 'Unknown')}</div>
          <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
        </div>
        <button class="fav-btn ${isFav ? 'on' : ''}" data-id="${t.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
        </button>
        <span class="pl-dur">${t.duration ? Player.formatTime(t.duration) : '—'}</span>
      </div>`;
  }).join('');

  playlistEl.querySelectorAll('.playlist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      Player.playById(parseInt(el.dataset.id, 10));
    });
  });

  playlistEl.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id     = parseInt(btn.dataset.id, 10);
      const newFav = !(btn.classList.contains('on'));

      // Update DB
      await dbToggleFavorite(id);

      // Update in-memory track so no reload needed
      const t = Player.tracks.find(t => t.id === id);
      if (t) t.favorite = newFav;

      // Rebuild queue if in favorites mode
      if (activeTab === 'favorites') Player.setFavoritesOnly(true);

      renderPlaylist();
      showToast(newFav ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });

  const activeEl = playlistEl.querySelector('.playlist-item.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Admin ────────────────────────────── */
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
        <div class="admin-title">${escHtml(t.title  || 'Unknown')}</div>
        <div class="admin-artist">${escHtml(t.artist || 'Unknown')}</div>
      </div>
      <div class="admin-actions">
        <button class="admin-btn edit-btn"   data-id="${t.id}" aria-label="Edit"><i class="ti ti-pencil"></i></button>
        <button class="admin-btn delete delete-btn" data-id="${t.id}" aria-label="Delete"><i class="ti ti-trash"></i></button>
      </div>
    </div>`).join('');
  adminList.querySelectorAll('.edit-btn').forEach(b =>
    b.addEventListener('click', () => openRenameModal(parseInt(b.dataset.id, 10))));
  adminList.querySelectorAll('.delete-btn').forEach(b =>
    b.addEventListener('click', () => deleteSong(parseInt(b.dataset.id, 10))));
}

/* ── File import ──────────────────────── */
btnAddSong.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  if (!files.length) return;
  const AUDIO_EXTS = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  let added = 0, skipped = 0, duplicates = [];

  for (const file of files) {
    const validMime = file.type.startsWith('audio/') || file.type.startsWith('video/mp4');
    const validExt  = AUDIO_EXTS.test(file.name);
    if (!validMime && !validExt) { skipped++; continue; }

    const nameNoExt = file.name.replace(/\.[^/.]+$/, '');
    let title = nameNoExt, artist = 'Unknown';
    const dash = nameNoExt.indexOf(' - ');
    if (dash !== -1) { artist = nameNoExt.slice(0, dash).trim(); title = nameNoExt.slice(dash + 3).trim(); }

    // Check duplicate
    const dup = await dbCheckDuplicate(title, artist);
    if (dup) { duplicates.push(title); continue; }

    const duration = await getAudioDuration(file);
    await dbSaveTrack({ title, artist, blob: file, duration, size: file.size, favorite: false });
    added++;
  }

  fileInput.value = '';

  if (duplicates.length > 0) {
    showToast(`⚠️ Already exists: ${duplicates.join(', ')}`, 4000);
  }
  if (added > 0) {
    await Player.refreshLibrary();
    renderAdminList();
    renderPlaylist();
    showToast(`${added} song${added > 1 ? 's' : ''} added${skipped > 0 ? `, ${skipped} skipped` : ''}`);
  } else if (!duplicates.length) {
    showToast('No supported audio files found');
  }
});

function getAudioDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const a = new Audio();
    a.src = url;
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
  const t = Player.tracks.find(t => t.id === id);
  if (!t) return;
  renamingId = id;
  renameTitle.value  = t.title  || '';
  renameArtist.value = t.artist || '';
  modalRename.hidden = false;
  renameTitle.focus();
}
modalCancel.addEventListener('click', () => { modalRename.hidden = true; renamingId = null; });
modalRename.addEventListener('click', (e) => { if (e.target === modalRename) { modalRename.hidden = true; renamingId = null; } });
modalSave.addEventListener('click', async () => {
  if (!renamingId) return;
  await dbUpdateTrack(renamingId, { title: renameTitle.value.trim() || 'Unknown', artist: renameArtist.value.trim() || 'Unknown' });
  await Player.refreshLibrary();
  renderAdminList();
  renderPlaylist();
  modalRename.hidden = true;
  renamingId = null;
  showToast('Track updated');
});

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

/* ── Util ─────────────────────────────── */
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Init ─────────────────────────────── */
(async () => {
  Player.setupMediaSession();
  await Player.loadLibrary();
  renderPlaylist();
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
