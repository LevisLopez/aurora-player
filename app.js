/* ═══════════════════════════════════════
   app.js — UI controller v10 (Definitive Fixed)
═══════════════════════════════════════ */
const $ = id => document.getElementById(id);

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
const searchOverlay  = $('search-overlay');
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

let activeTab   = 'all';
let renamingId  = null;
let toastTimer  = null;
let selectMode  = false;
let selectedIds = new Set();
let activeListId = null; 
let addToListTrackId = null; 

/* ── Toast ───────────────────────────── */
function showToast(msg, ms = 2500) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

/* ── Screens ─────────────────────────── */
function showScreen(name) {
  screenPlayer.classList.toggle('active', name === 'player');
  screenAdmin.classList.toggle('active',  name === 'admin');
}
btnOpenAdmin.addEventListener('click', () => { renderAdminList(); showScreen('admin'); });
btnBack.addEventListener('click',      () => showScreen('player'));

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

/* ── Search overlay ───────────────────── */
btnSearch.addEventListener('click', () => {
  searchOverlay.hidden = false;
  searchInput.value = '';
  searchResults.innerHTML = '<div class="search-empty">Type to search...</div>';
  setTimeout(() => searchInput.focus(), 100);
});
searchBack.addEventListener('click', () => {
  searchOverlay.hidden = true;
  searchInput.value = '';
});
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) { searchResults.innerHTML = '<div class="search-empty">Type to search...</div>'; return; }
  const current = Player.currentTrack();
  const list = Player.tracks.filter(t =>
    (t.title  || '').toLowerCase().includes(q) ||
    (t.artist || '').toLowerCase().includes(q)
  );
  if (!list.length) { searchResults.innerHTML = '<div class="search-empty">No results found</div>'; return; }
  searchResults.innerHTML = list.map((t, i) => {
    const isActive = t.id === current?.id;
    const isFav    = t.favorite === true;
    return `<div class="playlist-item ${isActive ? 'active' : ''}" data-id="${t.id}" role="button" tabindex="0">
      <span class="pl-num">${i + 1}</span>
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
      searchOverlay.hidden = true;
    });
  });
  searchResults.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id  = parseInt(btn.dataset.id, 10);
      const val = !(btn.classList.contains('on'));
      await dbToggleFavorite(id);
      const t = Player.tracks.find(t => t.id === id);
      if (t) t.favorite = val;
      renderPlaylist();
      searchInput.dispatchEvent(new Event('input'));
      showToast(val ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });
});

/* ── Tabs ─────────────────────────────── */
const tabLists = $('tab-lists');

tabAll.addEventListener('click', () => {
  if (activeTab === 'all') return;
  activeTab = 'all'; activeListId = null;
  tabAll.classList.add('active');
  tabFav.classList.remove('active');
  tabLists.classList.remove('active');
  hideListsPanel(); hideListDetail();
  Player.setFavoritesOnly(false);
  renderPlaylist();
});
tabFav.addEventListener('click', () => {
  if (activeTab === 'favorites') return;
  activeTab = 'favorites'; activeListId = null;
  tabFav.classList.add('active');
  tabAll.classList.remove('active');
  tabLists.classList.remove('active');
  hideListsPanel(); hideListDetail();
  Player.setFavoritesOnly(true);
  renderPlaylist();
});
tabLists.addEventListener('click', () => {
  if (activeTab === 'lists') return;
  activeTab = 'lists'; activeListId = null;
  tabLists.classList.add('active');
  tabAll.classList.remove('active');
  tabFav.classList.remove('active');
  Player.setFavoritesOnly(false);
  showListsPanel();
});

/* ── Playlist ─────────────────────────── */
function renderPlaylist() {
  if (activeTab === 'lists') { renderListsPanel(); return; }
  const current = Player.currentTrack();
  let display   = [...Player.tracks];
  if (activeTab === 'favorites') display = display.filter(t => t.favorite === true);

  playlistCount.textContent = activeTab === 'favorites'
    ? `${display.length} favorite${display.length !== 1 ? 's' : ''}`
    : `${display.length} song${display.length !== 1 ? 's' : ''}`;

  const noFavs = activeTab === 'favorites' && display.length === 0;
  emptyFavorites.hidden    = !noFavs;
  playlistEl.style.display = noFavs ? 'none' : '';
  if (!display.length) { playlistEl.innerHTML = ''; return; }

  playlistEl.innerHTML = display.map((t, idx) => {
    const isActive = t.id === current?.id;
    const isFav    = t.favorite === true;
    const num = isActive
      ? `<div class="playing-bars"><span></span><span></span><span></span></div>`
      : `<span class="pl-num">${idx + 1}</span>`;
    return `<div class="playlist-item ${isActive ? 'active' : ''}" data-id="${t.id}" role="button" tabindex="0">
      ${num}
      <div class="pl-info">
        <div class="pl-title">${escHtml(t.title  || 'Unknown')}</div>
        <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
      </div>
      <button class="fav-btn ${isFav ? 'on' : ''}" data-id="${t.id}" aria-label="${isFav ? 'Unfavorite' : 'Favorite'}">
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
      const id  = parseInt(btn.dataset.id, 10);
      const val = !(btn.classList.contains('on'));
      await dbToggleFavorite(id);
      const t = Player.tracks.find(t => t.id === id);
      if (t) t.favorite = val;
      if (activeTab === 'favorites') Player.setFavoritesOnly(true);
      renderPlaylist();
      showToast(val ? '♥ Added to Favorites' : 'Removed from Favorites');
    });
  });

  const activeEl = playlistEl.querySelector('.playlist-item.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Admin ────────────────────────────── */
async function renderAdminList() {
  const tracks = Player.tracks;
  const size   = await dbGetTotalSize();
  adminCount.textContent = `${tracks.length} song${tracks.length !== 1 ? 's' : ''}`;
  adminSize.textContent  = `${(size / 1024 / 1024).toFixed(1)} MB used`;
  
  if (emptyState) {
    emptyState.classList.toggle('visible', tracks.length === 0);
  }
  
  if (!tracks.length) { adminList.innerHTML = ''; return; }
  adminList.innerHTML = tracks.map(t => {
    const checked = selectedIds.has(t.id);
    return `<div class="admin-item ${selectMode ? 'selectable' : ''} ${checked ? 'selected' : ''}" data-id="${t.id}">
      ${selectMode ? `<div class="select-checkbox ${checked ? 'checked' : ''}"><i class="ti ti-check"></i></div>` : ''}
      <div class="admin-thumb"><i class="ti ti-music"></i></div>
      <div class="admin-info-col">
        <div class="admin-title">${escHtml(t.title  || 'Unknown')}</div>
        <div class="admin-artist">${escHtml(t.artist || 'Unknown')}</div>
      </div>
      <div class="admin-actions" ${selectMode ? 'style="display:none"' : ''}>
        <button class="admin-btn add-list-btn" data-track-id="${t.id}" title="Add to playlist"><i class="ti ti-list-plus"></i></button>
        <button class="admin-btn edit-btn"     data-id="${t.id}"><i class="ti ti-pencil"></i></button>
        <button class="admin-btn delete-action-btn" data-id="${t.id}"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
  }).join('');

  adminList.querySelectorAll('.admin-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.edit-btn') || e.target.closest('.delete-action-btn') || e.target.closest('.add-list-btn')) return;
      if (selectMode) toggleSelectItem(parseInt(item.dataset.id, 10));
    });
  });
  adminList.querySelectorAll('.edit-btn').forEach(b =>
    b.addEventListener('click', () => openRenameModal(parseInt(b.dataset.id, 10))));
  adminList.querySelectorAll('.delete-action-btn').forEach(b =>
    b.addEventListener('click', () => deleteSong(parseInt(b.dataset.id, 10))));
    
  // EVENTO CORREGIDO: Extrae de forma segura el atributo de la canción
  adminList.querySelectorAll('.add-list-btn').forEach(b =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = parseInt(b.getAttribute('data-track-id') || b.dataset.id, 10);
      openAddToListModal(trackId);
    })
  );
}

/* ── File import ──────────────────────── */
btnAddSong.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  if (!files.length) return;
  const EXTS = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  let added = 0, skipped = 0, dups = [];
  for (const file of files) {
    const ok = file.type.startsWith('audio/') || file.type.startsWith('video/mp4') || EXTS.test(file.name);
    if (!ok) { skipped++; continue; }
    const name = file.name.replace(/\.[^/.]+$/, '');
    let title = name, artist = 'Unknown';
    const dash = name.indexOf(' - ');
    if (dash !== -1) { artist = name.slice(0, dash).trim(); title = name.slice(dash + 3).trim(); }
    const dup = await dbCheckDuplicate(title, artist);
    if (dup) { dups.push(title); continue; }
    const duration = await getAudioDuration(file);
    await dbSaveTrack({ title, artist, blob: file, duration, size: file.size, favorite: false });
    added++;
  }
  fileInput.value = '';
  if (dups.length) showToast(`Already exists: ${dups.join(', ')}`, 4000);
  if (added > 0) {
    await Player.refreshLibrary();
    renderAdminList();
    renderPlaylist();
    showToast(`${added} song${added > 1 ? 's' : ''} added`);
  } else if (!dups.length) {
    showToast('No supported files found');
  }
});

function getAudioDuration(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const a = new Audio();
    a.src = url;
    a.addEventListener('loadedmetadata', () => { URL.revokeObjectURL(url); resolve(isFinite(a.duration) ? a.duration : 0); });
    a.addEventListener('error',          () => { URL.revokeObjectURL(url); resolve(0); });
  });
}

/* ── Delete ───────────────────────────── */
async function deleteSong(id) {
  if (!confirm('Remove this song?')) return;
  await dbDeleteTrack(id);
  await Player.refreshLibrary();
  renderAdminList();
  renderPlaylist();
  showToast('Song removed');
}

/* ── Rename ───────────────────────────── */
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
modalRename.addEventListener('click', e => { if (e.target === modalRename) { modalRename.hidden = true; renamingId = null; } });
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
const btnSleepOpen      = $('btn-sleep');
const modalSleep        = $('modal-sleep');
const modalSleepCancel = $('modal-sleep-cancel');
const sleepCustomInput = $('sleep-custom-input');
const sleepCustomSet   = $('sleep-custom-set');

if (btnSleepOpen) {
  btnSleepOpen.addEventListener('click', () => {
    if (window.SleepTimer && SleepTimer.active) { SleepTimer.cancel(); showToast('Sleep timer cancelled'); return; }
    modalSleep.hidden = false;
  });
}
modalSleepCancel.addEventListener('click', () => { modalSleep.hidden = true; });
modalSleep.addEventListener('click', e => { if (e.target === modalSleep) modalSleep.hidden = true; });
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

/* ── Multi-select ─────────────────────── */
const btnSelect      = $('btn-select');
const selectBar      = $('select-bar');
const selectCount    = $('select-count');
const selectAllBtn   = $('select-all-btn');
const selectDeleteBtn= $('select-delete-btn');
const selectCancelBtn= $('select-cancel-btn');

btnSelect.addEventListener('click', () => {
  selectMode = !selectMode;
  selectedIds.clear();
  btnSelect.classList.toggle('on', selectMode);
  selectBar.hidden = !selectMode;
  renderAdminList();
});

function toggleSelectItem(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  selectCount.textContent = `${selectedIds.size} selected`;
  renderAdminList();
}

selectAllBtn.addEventListener('click', () => {
  if (selectedIds.size === Player.tracks.length) {
    selectedIds.clear();
  } else {
    Player.tracks.forEach(t => selectedIds.add(t.id));
  }
  selectCount.textContent = `${selectedIds.size} selected`;
  renderAdminList();
});

selectDeleteBtn.addEventListener('click', async () => {
  if (!selectedIds.size) return;
  if (!confirm(`Delete ${selectedIds.size} song${selectedIds.size > 1 ? 's' : ''}?`)) return;
  for (const id of selectedIds) {
    await dbDeleteTrack(id);
    await dbDeleteLyrics(id);
  }
  selectedIds.clear();
  selectMode = false;
  selectBar.hidden = true;
  btnSelect.classList.remove('on');
  await Player.refreshLibrary();
  renderAdminList();
  renderPlaylist();
  showToast('Songs removed');
});

selectCancelBtn.addEventListener('click', () => {
  selectMode = false;
  selectedIds.clear();
  selectBar.hidden = true;
  btnSelect.classList.remove('on');
  renderAdminList();
});

/* ── Export / Import ──────────────────── */
const btnExport      = $('btn-export');
const btnImport      = $('btn-import');
const importFileInput= $('import-file-input');

btnExport.addEventListener('click', async () => {
  if (!Player.tracks.length) { showToast('No songs to export'); return; }
  showToast('Exporting… this may take a moment', 8000);
  try {
    const json = await dbExportLibrary();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `aurora-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Library exported!');
  } catch (e) {
    showToast('Export failed: ' + e.message);
  }
});

btnImport.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', async () => {
  const file = importFileInput.files[0];
  if (!file) return;
  importFileInput.value = '';
  showToast('Importing… please wait', 10000);
  try {
    const text = await file.text();
    const { imported, skipped } = await dbImportLibrary(text);
    await Player.refreshLibrary();
    renderAdminList();
    renderPlaylist();
    showToast(`Imported ${imported} songs${skipped ? `, ${skipped} already existed` : ''}`);
  } catch (e) {
    showToast('Import failed: ' + e.message);
  }
});

/* ── Playlists ─────────────────────────── */
const listsPanel      = $('lists-panel');
const listsGrid       = $('lists-grid');
const btnNewList      = $('btn-new-list');
const listDetail      = $('list-detail');
const listBack       = $('list-back');
const listDetailName = $('list-detail-name');
const listDeleteBtn  = $('list-delete');
const listDetailTracks = $('list-detail-tracks');
const listEmpty      = $('list-empty');
const modalNewList   = $('modal-new-list');
const newListName    = $('new-list-name');
const newListCancel  = $('new-list-cancel');
const newListSave    = $('new-list-save');
const modalAddToList = $('modal-add-to-list');
const addToListOpts  = $('add-to-list-options');
const addToListCancel= $('add-to-list-cancel');

function showListsPanel() {
  playlistEl.style.display = 'none';
  emptyFavorites.hidden = true;
  listDetail.hidden = true;
  listsPanel.hidden = false;
  renderListsPanel();
}
function hideListsPanel() {
  listsPanel.hidden = true;
  playlistEl.style.display = '';
}
function hideListDetail() {
  listDetail.hidden = true;
}

async function renderListsPanel() {
  const lists = await dbGetAllPlaylists();
  playlistCount.textContent = `${lists.length} list${lists.length !== 1 ? 's' : ''}`;
  if (!lists.length) {
    listsGrid.innerHTML = `<div class="lists-empty"><i class="ti ti-list" style="font-size:36px;opacity:0.25;margin-bottom:8px;"></i><p style="font-size:13px;color:var(--text3);">No playlists yet</p></div>`;
    return;
  }
  listsGrid.innerHTML = lists.map(pl => `
    <div class="list-card" data-id="${pl.id}">
      <div class="list-card-icon"><i class="ti ti-playlist"></i></div>
      <div class="list-card-name">${escHtml(pl.name)}</div>
      <div class="list-card-count">${pl.trackIds.length} song${pl.trackIds.length !== 1 ? 's' : ''}</div>
    </div>`).join('');
  listsGrid.querySelectorAll('.list-card').forEach(card => {
    card.addEventListener('click', () => openListDetail(parseInt(card.dataset.id, 10)));
  });
}

async function openListDetail(id) {
  activeListId = id;
  const pl = await dbGetPlaylist(id);
  if (!pl) return;
  listDetailName.textContent = pl.name;
  listsPanel.hidden = true;
  listDetail.hidden = false;
  renderListDetail(pl);
}

function renderListDetail(pl) {
  const tracks = pl.trackIds.map(tid => Player.tracks.find(t => t.id === tid)).filter(Boolean);
  listEmpty.hidden = tracks.length > 0;
  listDetailTracks.style.display = tracks.length ? '' : 'none';
  const current = Player.currentTrack();
  listDetailTracks.innerHTML = tracks.map((t, idx) => {
    const isActive = t.id === current?.id;
    return `<div class="playlist-item ${isActive ? 'active' : ''}" data-id="${t.id}" role="button" tabindex="0">
      ${isActive ? `<div class="playing-bars"><span></span><span></span><span></span></div>` : `<span class="pl-num">${idx + 1}</span>`}
      <div class="pl-info">
        <div class="pl-title">${escHtml(t.title || 'Unknown')}</div>
        <div class="pl-artist">${escHtml(t.artist || 'Unknown')}</div>
      </div>
      <button class="admin-btn delete-item-list-btn" data-id="${t.id}" title="Remove from list"><i class="ti ti-x"></i></button>
      <span class="pl-dur">${t.duration ? Player.formatTime(t.duration) : '—'}</span>
    </div>`;
  }).join('');
  listDetailTracks.querySelectorAll('.playlist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.delete-item-list-btn')) return;
      Player.playById(parseInt(el.dataset.id, 10));
    });
  });
  listDetailTracks.querySelectorAll('.delete-item-list-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await dbRemoveTrackFromPlaylist(activeListId, parseInt(btn.dataset.id, 10));
      const updated = await dbGetPlaylist(activeListId);
      if (updated) renderListDetail(updated);
    });
  });
}

listBack.addEventListener('click', () => {
  listDetail.hidden = true;
  activeListId = null;
  showListsPanel();
});

listDeleteBtn.addEventListener('click', async () => {
  if (!activeListId) return;
  if (!confirm('Delete this playlist?')) return;
  await dbDeletePlaylist(activeListId);
  activeListId = null;
  listDetail.hidden = true;
  showListsPanel();
  showToast('Playlist deleted');
});

// New playlist modal
btnNewList.addEventListener('click', () => {
  newListName.value = '';
  modalNewList.hidden = false;
  newListName.focus();
});
newListCancel.addEventListener('click', () => { modalNewList.hidden = true; });
modalNewList.addEventListener('click', e => { if (e.target === modalNewList) modalNewList.hidden = true; });
newListSave.addEventListener('click', async () => {
  const name = newListName.value.trim();
  if (!name) { showToast('Enter a playlist name'); return; }
  await dbCreatePlaylist(name);
  modalNewList.hidden = true;
  renderListsPanel();
  showToast(`Playlist "${name}" created`);
});
newListName.addEventListener('keydown', e => { if (e.key === 'Enter') newListSave.click(); });

// FUNCIÓN CORREGIDA: Sincroniza perfectamente el Id de la canción y de la playlist elegida
async function openAddToListModal(trackId) {
  if (!trackId) {
    showToast('Error: Invalid song selected');
    return;
  }
  addToListTrackId = trackId;
  const lists = await dbGetAllPlaylists();
  if (!lists.length) {
    showToast('No playlists yet — create one in LISTS tab');
    return;
  }
  addToListOpts.innerHTML = lists.map(pl => `
    <button class="add-to-list-opt" data-playlist-id="${pl.id}">
      <i class="ti ti-playlist"></i>
      <span>${escHtml(pl.name)}</span>
      <span style="font-size:11px;color:var(--text3);margin-left:auto;">${pl.trackIds.length} songs</span>
    </button>`).join('');
    
  addToListOpts.querySelectorAll('.add-to-list-opt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const plId = parseInt(btn.getAttribute('data-playlist-id'), 10);
      if (plId && addToListTrackId) {
        await dbAddTrackToPlaylist(plId, addToListTrackId);
        modalAddToList.hidden = true;
        showToast('Added to playlist!');
        if (activeTab === 'lists') renderListsPanel();
      } else {
        showToast('Error adding track');
      }
    });
  });
  modalAddToList.hidden = false;
}
addToListCancel.addEventListener('click', () => { modalAddToList.hidden = true; });
modalAddToList.addEventListener('click', e => { if (e.target === modalAddToList) modalAddToList.hidden = true; });

/* ── Persistent Storage ───────────────── */
(async () => {
  if (navigator.storage && navigator.storage.persist) {
    const already = await navigator.storage.persisted();
    if (!already) {
      const granted = await navigator.storage.persist();
      if (granted) console.log('[Aurora] Persistent storage granted');
    }
  }
})();
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Player Callbacks ─────────────────── */
Player.onPlayState = (playing) => {
  const iconClass = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
  playIcon.className = iconClass;
  if ($('lyrics-play-icon')) $('lyrics-play-icon').className = iconClass;
};

Player.onProgress = (ratio, current, total) => {
  const pct = (ratio * 100).toFixed(2) + '%';
  if (progressFill) progressFill.style.width = pct;
  if (progressThumb) progressThumb.style.left = pct;
  if (timeCurrent) timeCurrent.textContent = Player.formatTime(current);
  if (timeTotal) timeTotal.textContent = Player.formatTime(total);
  
  if ($('lyrics-progress-fill')) $('lyrics-progress-fill').style.width = pct;
  if ($('lyrics-time-current')) $('lyrics-time-current').textContent = Player.formatTime(current);
  if ($('lyrics-time-total')) $('lyrics-time-total').textContent = Player.formatTime(total);
  
  if (window.Lyrics) Lyrics.sync(current);
};

Player.onQueueChange = () => renderPlaylist();

Player.onTrackChange = (track) => {
  trackTitle.textContent  = track ? (track.title  || 'Unknown') : 'No track loaded';
  trackArtist.textContent = track ? (track.artist || 'Unknown') : 'Add songs to get started';
  
  renderPlaylist();
  
  if (window.Lyrics) {
    Lyrics.clear();
    resetInlineLyrics();
    if (lyricsVisible && track) loadLyricsForTrack(track);
    else if (lyricsVisible) showLyricsState('no-track');
    if (track) loadLyricsBackground(track);
  }
};

/* ── Init ────────────────────────────── */
(async () => {
  Player.setupMediaSession();
  await Player.loadLibrary();
  renderPlaylist();
  await renderAdminList();
  
  const t = Player.currentTrack();
  if (t) loadLyricsBackground(t);
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* ── Lyrics Screen System ─────────────── */
const screenLyrics      = $('screen-lyrics');
const btnLyrics         = $('btn-lyrics');
const lyricsClose       = $('lyrics-close');
const lyricsLines       = $('lyrics-lines');
const lyricsLoading      = $('lyrics-loading');
const lyricsNotFound    = $('lyrics-not-found');
const lyricsNoTrack     = $('lyrics-no-track');
const lyricsTrackTitle  = $('lyrics-track-title');
const lyricsTrackArtist = $('lyrics-track-artist');
const lyricsPFill        = $('lyrics-progress-fill');
const lyricsCurrent      = $('lyrics-time-current');
const lyricsTotal        = $('lyrics-time-total');
const lyricsPlayIcon    = $('lyrics-play-icon');
const lyricsProgressWrap= $('lyrics-progress-wrap');
const lyricsUploadBtn   = $('lyrics-upload-btn');
const lyricsUploadBtn2  = $('lyrics-upload-btn2');
const lyricsDeleteBtn   = $('lyrics-delete-btn');
const lrcFileInput      = $('lrc-file-input');
const lyricsControlsBar = $('screen-lyrics')?.querySelector('.lyrics-controls');

let lyricsVisible = false;
let controlsTimeout = null;

function showLyricsScreen() {
  screenLyrics.classList.add('active');
  lyricsVisible = true;
  btnLyrics.classList.add('lyrics-on');
  showLyricsControls();
  const t = Player.currentTrack();
  if (t) loadLyricsForTrack(t);
}

function hideLyricsScreen() {
  screenLyrics.classList.remove('active');
  lyricsVisible = false;
  btnLyrics.classList.remove('lyrics-on');
  resetControlsAutohide();
}

btnLyrics.addEventListener('click', () => {
  if (lyricsVisible) hideLyricsScreen();
  else showLyricsScreen();
});
lyricsClose.addEventListener('click', hideLyricsScreen);

function showLyricsControls() {
  if (lyricsControlsBar) lyricsControlsBar.classList.remove('hidden-fullscreen');
  resetControlsAutohide();
  if (Player.playing) {
    controlsTimeout = setTimeout(() => {
      if (lyricsControlsBar) lyricsControlsBar.classList.add('hidden-fullscreen');
    }, 5000);
  }
}

function resetControlsAutohide() {
  if (controlsTimeout) clearTimeout(controlsTimeout);
}

if (screenLyrics) {
  screenLyrics.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.lyrics-progress-wrap') || e.target.closest('.lyric-line')) return;
    showLyricsControls();
  });
}

$('lyrics-prev').addEventListener('click', (e) => { e.stopPropagation(); Player.prev(); showLyricsControls(); });
$('lyrics-next').addEventListener('click', (e) => { e.stopPropagation(); Player.next(true); showLyricsControls(); });
$('lyrics-play').addEventListener('click', (e) => { e.stopPropagation(); Player.togglePlay(); showLyricsControls(); });

lyricsProgressWrap.addEventListener('click', (e) => {
  e.stopPropagation();
  const rect = lyricsProgressWrap.getBoundingClientRect();
  Player.seek(Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1));
  showLyricsControls();
});

function resetInlineLyrics() {
  const prevEl   = $('inline-prev-line');
  const activeEl = $('inline-active-line');
  const nextEl   = $('inline-next-line');
  const noLyrics = $('inline-no-lyrics');
  
  if (prevEl) prevEl.textContent = '';
  if (activeEl) activeEl.textContent = '';
  if (nextEl) nextEl.textContent = '';
  if (noLyrics) noLyrics.classList.remove('hidden');
}

async function loadLyricsBackground(track) {
  const result = await Lyrics.load(track.id, track.title, track.artist);
  const noLyrics = $('inline-no-lyrics');
  if (noLyrics) {
    if (result === 'found' || result === 'cached') noLyrics.classList.add('hidden');
    else noLyrics.classList.remove('hidden');
  }
}

async function loadLyricsForTrack(track) {
  lyricsTrackTitle.textContent  = track.title  || 'Unknown';
  lyricsTrackArtist.textContent = track.artist || 'Unknown';
  showLyricsState('loading');
  const result = await Lyrics.load(track.id, track.title, track.artist);
  if (result === 'found' || result === 'cached') {
    renderLyricsLines();
    lyricsDeleteBtn.style.display = '';
  } else {
    showLyricsState('not-found');
    lyricsDeleteBtn.style.display = 'none';
  }
}

function showLyricsState(state) {
  lyricsLoading.hidden  = state !== 'loading';
  lyricsNotFound.hidden = state !== 'not-found';
  lyricsNoTrack.hidden  = state !== 'no-track';
  lyricsLines.hidden    = state !== 'lines';
}

function renderLyricsLines() {
  showLyricsState('lines');
  lyricsLines.innerHTML = Lyrics.lines.map((line, i) =>
    `<div class="lyric-line" data-idx="${i}">${escHtml(line.text)}</div>`
  ).join('');

  lyricsLines.querySelectorAll('.lyric-line').forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const audioEl = document.getElementById('audio');
      if (audioEl && audioEl.duration) {
        Player.seek(Lyrics.lines[i].time / audioEl.duration);
      }
      showLyricsControls();
    });
  });
}

Lyrics.onLine = (idx, lines) => {
  const prevEl   = $('inline-prev-line');
  const activeEl = $('inline-active-line');
  const nextEl   = $('inline-next-line');
  const noLyrics = $('inline-no-lyrics');

  if (idx >= 0 && lines.length) {
    if (noLyrics) noLyrics.classList.add('hidden');
    if (prevEl) prevEl.textContent = idx > 0 ? lines[idx - 1].text : '';
    if (activeEl) activeEl.textContent = lines[idx].text;
    if (nextEl) nextEl.textContent = idx < lines.length - 1 ? lines[idx + 1].text : '';
  }

  if (lyricsVisible && lyricsLines) {
    lyricsLines.querySelectorAll('.lyric-line').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    const activeLineEl = lyricsLines.querySelector('.lyric-line.active');
    if (activeLineEl) {
      activeLineEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
};
