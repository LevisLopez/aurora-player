/* ═══════════════════════════════════════
   app.js — Aurora English clean karaoke controller
═══════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const screenPlayer = $('screen-player');
const screenAdmin = $('screen-admin');
const trackTitle = $('track-title');
const trackArtist = $('track-artist');
const progressFill = $('progress-fill');
const progressThumb = $('progress-thumb');
const progressWrap = $('progress-wrap');
const timeCurrent = $('time-current');
const timeTotal = $('time-total');
const playIcon = $('play-icon');
const btnPlay = $('btn-play');
const btnPrev = $('btn-prev');
const btnNext = $('btn-next');
const btnShuffle = $('btn-shuffle');
const btnRepeat = $('btn-repeat');
const btnSettings = $('btn-settings');
const btnBack = $('btn-back');
const btnAddSong = $('btn-add-song');
const btnAddSongMain = $('btn-add-song-main');
const btnOnlineSearch = $('btn-online-search');
const fileInput = $('file-input');
const btnImport = $('btn-import');
const btnExport = $('btn-export');
const importFileInput = $('import-file-input');
const lrcFileInput = $('lrc-file-input');
const toastEl = $('toast');

const karaokeMain = $('karaoke-main');
const inlineLines = $('inline-lines');
const inlineNoLyrics = $('inline-no-lyrics');
const fullscreenKaraoke = $('fullscreen-karaoke');
const fullscreenLines = $('fullscreen-lines');
const fullscreenEmpty = $('fullscreen-empty');
const fullscreenControls = $('fullscreen-controls');
const fullscreenBack = $('fullscreen-back');
const fullscreenTitle = $('fullscreen-title');
const fullscreenArtist = $('fullscreen-artist');
const fullscreenProgressWrap = $('fullscreen-progress-wrap');
const fullscreenProgressFill = $('fullscreen-progress-fill');
const fullscreenTimeCurrent = $('fullscreen-time-current');
const fullscreenTimeTotal = $('fullscreen-time-total');
const fullscreenPlay = $('fullscreen-play');
const fullscreenPlayIcon = $('fullscreen-play-icon');
const fullscreenPrev = $('fullscreen-prev');
const fullscreenNext = $('fullscreen-next');

const playlistEl = $('playlist');
const playlistCount = $('playlist-count');
const libraryTitle = $('library-title');
const sortSelect = $('sort-select');
const emptyFavorites = $('empty-favorites');
const emptyTop = $('empty-top');
const listsPanel = $('lists-panel');
const listsGrid = $('lists-grid');
const btnNewList = $('btn-new-list');
const listDetail = $('list-detail');
const listBack = $('list-back');
const listDeleteBtn = $('list-delete');
const listDetailName = $('list-detail-name');
const listDetailCount = $('list-detail-count');
const listDetailTracks = $('list-detail-tracks');
const listEmpty = $('list-empty');

const settingsPanel = $('settings-panel');
const settingsBackdrop = $('settings-backdrop');
const settingsClose = $('settings-close');
const settingsTheme = $('settings-theme');
const settingsNight = $('settings-night');
const btnSleepOpen = $('btn-sleep');
const settingsAll = $('settings-all');
const settingsFavorites = $('settings-favorites');
const settingsPlaylists = $('settings-playlists');
const settingsTop = $('settings-top');
const settingsSearchLibrary = $('settings-search-library');
const settingsUploadLyrics = $('settings-upload-lyrics');
const settingsDeleteLyrics = $('settings-delete-lyrics');
const settingsManage = $('settings-manage');
const settingsImport = $('settings-import');
const settingsExport = $('settings-export');

const searchOverlay = $('search-overlay');
const searchInput = $('search-input');
const searchResults = $('search-results');
const searchBack = $('search-back');

const onlineOverlay = $('online-overlay');
const onlineBack = $('online-back');
const onlineInput = $('online-input');
const onlineSearchBtn = $('online-search-btn');
const onlineResults = $('online-results');
const directUrlInput = $('direct-url-input');
const directTitleInput = $('direct-title-input');
const directArtistInput = $('direct-artist-input');
const directAddBtn = $('direct-add-btn');

const adminList = $('admin-list');
const adminCount = $('admin-count');
const adminSize = $('admin-size');
const emptyState = $('empty-state');
const btnSelect = $('btn-select');
const selectBar = $('select-bar');
const selectCount = $('select-count');
const selectAllBtn = $('select-all-btn');
const selectDeleteBtn = $('select-delete-btn');
const selectCancelBtn = $('select-cancel-btn');

const modalSongOptions = $('modal-song-options');
const songOptionsTitle = $('song-options-title');
const songOptPlay = $('song-opt-play');
const songOptFavorite = $('song-opt-favorite');
const songOptAddList = $('song-opt-add-list');
const songOptRemoveList = $('song-opt-remove-list');
const songOptEdit = $('song-opt-edit');
const songOptDelete = $('song-opt-delete');
const songOptCancel = $('song-opt-cancel');

const modalRename = $('modal-rename');
const renameTitle = $('rename-title');
const renameArtist = $('rename-artist');
const modalCancel = $('modal-cancel');
const modalSave = $('modal-save');
const modalNewList = $('modal-new-list');
const newListName = $('new-list-name');
const newListCancel = $('new-list-cancel');
const newListSave = $('new-list-save');
const modalAddToList = $('modal-add-to-list');
const addToListOpts = $('add-to-list-options');
const addToListCancel = $('add-to-list-cancel');
const modalTheme = $('modal-theme');
const themeOptions = $('theme-options');
const themeClose = $('theme-close');

const modalSleep = $('modal-sleep');
const modalSleepCancel = $('modal-sleep-cancel');
const sleepCustomInput = $('sleep-custom-input');
const sleepCustomSet = $('sleep-custom-set');

const LS_TAB = 'aurora_active_tab_clean';
const LS_SORT = 'aurora_sort_mode';
const LS_THEME = 'aurora_theme';
const LS_NIGHT = 'aurora_manual_night';

const THEMES = [
  { id: 'midnight', name: 'Midnight Blue', swatch: '#38bdf8' },
  { id: 'ocean', name: 'Deep Ocean', swatch: '#00b4d8' },
  { id: 'cyan', name: 'Electric Cyan', swatch: '#22d3ee' },
  { id: 'royal', name: 'Royal Violet', swatch: '#a78bfa' },
  { id: 'emerald', name: 'Neon Emerald', swatch: '#34d399' },
  { id: 'crimson', name: 'Crimson Pulse', swatch: '#fb7185' },
  { id: 'gold', name: 'Solar Gold', swatch: '#fbbf24' },
  { id: 'slate', name: 'Soft Slate', swatch: '#94a3b8' },
  { id: 'glacier', name: 'Glacier', swatch: '#7dd3fc' },
  { id: 'forest', name: 'Forest', swatch: '#84cc16' },
  { id: 'lava', name: 'Lava', swatch: '#fb923c' },
  { id: 'sunrise', name: 'Sunrise Pop', swatch: '#f472b6' },
  { id: 'lavender', name: 'Lavender', swatch: '#c4b5fd' },
  { id: 'matrix', name: 'Matrix Green', swatch: '#22c55e' },
  { id: 'coffee', name: 'Coffee', swatch: '#d6a55d' },
  { id: 'berry', name: 'Berry Neon', swatch: '#e879f9' },
  { id: 'mono', name: 'Mono White', swatch: '#ffffff' },
  { id: 'polar', name: 'Polar Blue', swatch: '#93c5fd' },
  { id: 'neon', name: 'Neon Mix', swatch: '#22d3ee' },
  { id: 'night', name: 'Total Night', swatch: '#1e3a8a' },
];

let activeTab = ['all', 'favorites', 'lists', 'top'].includes(localStorage.getItem(LS_TAB)) ? localStorage.getItem(LS_TAB) : 'all';
let sortMode = ['recent', 'az'].includes(localStorage.getItem(LS_SORT)) ? localStorage.getItem(LS_SORT) : 'recent';
let activeListId = null;
let toastTimer = null;
let renamingId = null;
let selectMode = false;
let selectedIds = new Set();
let addToListTrackId = null;
let songOptionsTrackId = null;
let songOptionsListId = null;
let lyricsRequestToken = 0;
let lyricsRenderedSignature = '';
let lastMainLyricScrollIdx = -1;
let lastFullscreenLyricScrollIdx = -1;
let lastKaraokeTap = 0;
let fullscreenActive = false;
let fullscreenClosing = false;
let onlineAbortController = null;

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, ms = 2600) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}
window.showToast = showToast;

function formatSongCount(count) {
  return `${count} song${count === 1 ? '' : 's'}`;
}

function formatPlayCount(count) {
  return `${count || 0} play${Number(count) === 1 ? '' : 's'}`;
}

function compareAZ(a, b) {
  return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' }) ||
    String(a.artist || '').localeCompare(String(b.artist || ''), undefined, { sensitivity: 'base' });
}

function applySort(tracks, forceMode = sortMode) {
  const result = [...tracks];
  if (forceMode === 'az') return result.sort(compareAZ);
  return result.sort((a, b) => (Number(b.addedAt || b.id || 0) - Number(a.addedAt || a.id || 0)) || compareAZ(a, b));
}

function getVisibleTracks() {
  if (activeTab === 'favorites') return applySort(Player.tracks.filter(track => track.favorite === true));
  if (activeTab === 'top') {
    return [...Player.tracks]
      .filter(track => Number(track.playCount || 0) > 0)
      .sort((a, b) => (Number(b.playCount || 0) - Number(a.playCount || 0)) || (Number(b.lastPlayedAt || 0) - Number(a.lastPlayedAt || 0)) || compareAZ(a, b))
      .slice(0, 10);
  }
  return applySort(Player.tracks);
}

function applyTheme(themeId) {
  const theme = THEMES.some(item => item.id === themeId) ? themeId : 'midnight';
  document.body.dataset.theme = theme;
  localStorage.setItem(LS_THEME, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#020817';
    meta.setAttribute('content', bg);
  }
  renderThemeOptions();
}

function renderThemeOptions() {
  const current = document.body.dataset.theme || 'midnight';
  themeOptions.innerHTML = THEMES.map(theme => `
    <button class="theme-option ${theme.id === current ? 'active' : ''}" data-theme="${theme.id}" style="--swatch:${theme.swatch}" role="option" aria-selected="${theme.id === current}">
      <span class="theme-swatch"></span>
      <span>${escHtml(theme.name)}</span>
    </button>
  `).join('');
  themeOptions.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      showToast(`${btn.textContent.trim()} theme applied`);
    });
  });
}

function setNightMode(enabled) {
  document.body.classList.toggle('manual-night', enabled);
  localStorage.setItem(LS_NIGHT, enabled ? '1' : '0');
  settingsNight.textContent = `Night mode: ${enabled ? 'On' : 'Off'}`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', enabled ? '#000000' : (getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#020817'));
}

function updateTransportButtons() {
  btnShuffle.classList.toggle('on', Player.shuffleOn);
  btnRepeat.classList.toggle('on', Player.repeatMode !== 'none');
  const repeatIcon = btnRepeat.querySelector('i');
  repeatIcon.className = Player.repeatMode === 'one' ? 'ti ti-repeat-once' : 'ti ti-repeat';
}

function updateLibraryTitle() {
  const titles = {
    all: 'Songs',
    favorites: 'Favorites',
    top: 'Top 10',
    lists: activeListId ? 'Playlist' : 'Playlists',
  };
  libraryTitle.textContent = titles[activeTab] || 'Songs';
  sortSelect.disabled = activeTab === 'top';
  sortSelect.value = sortMode;
}

// ── lightweight app history: Android back returns to previous screen/overlay ──
function setupHistory() {
  try {
    if (!history.state || history.state.auroraRoot !== true) {
      history.replaceState({ auroraRoot: true, view: 'home' }, '');
    }
  } catch (_) {}
}

function pushView(view) {
  try { history.pushState({ auroraView: view }, ''); } catch (_) {}
}

function replaceView(view) {
  try { history.replaceState({ auroraView: view }, ''); } catch (_) {}
}

function closeViaHistoryOr(directClose) {
  if (history.state && history.state.auroraView) history.back();
  else directClose();
}

function closeTopUi() {
  if (!modalTheme.hidden) { modalTheme.hidden = true; return true; }
  if (!modalSleep.hidden) { modalSleep.hidden = true; return true; }
  if (!modalAddToList.hidden) { modalAddToList.hidden = true; addToListTrackId = null; return true; }
  if (!modalRename.hidden) { modalRename.hidden = true; renamingId = null; return true; }
  if (!modalNewList.hidden) { modalNewList.hidden = true; return true; }
  if (!modalSongOptions.hidden) { closeSongOptionsDirect(); return true; }
  if (!onlineOverlay.hidden) { closeOnlineDirect(); return true; }
  if (!searchOverlay.hidden) { closeSearchDirect(); return true; }
  if (fullscreenActive) { closeFullscreenDirect(true); return true; }
  if (!settingsPanel.hidden) { closeSettingsDirect(); return true; }
  if (screenAdmin.classList.contains('active')) { showMainScreen('player'); return true; }
  if (activeTab === 'lists' && activeListId) { activeListId = null; renderPlaylist(); return true; }
  return false;
}

window.addEventListener('popstate', () => {
  closeTopUi();
});

function showMainScreen(name, manageHistory = false) {
  screenPlayer.classList.toggle('active', name === 'player');
  screenAdmin.classList.toggle('active', name === 'admin');
  if (name === 'admin') renderAdminList();
  if (manageHistory) pushView(name);
}

// ── rows ─────────────────────────────────
function playingLabel() {
  return '<span class="play-badge">Playing</span>';
}

function renderTrackRows(tracks, options = {}) {
  const currentId = Player.currentId;
  const showRank = options.showRank === true;
  const showStats = options.showStats === true;
  const listId = options.listId || null;

  return tracks.map((track, index) => {
    const isActive = Number(track.id) === Number(currentId);
    const marker = isActive ? playingLabel() : `<span class="pl-num">${showRank ? index + 1 : index + 1}</span>`;
    const subParts = [escHtml(track.artist || 'Unknown')];
    if (showStats || showRank) subParts.push(formatPlayCount(track.playCount || 0));
    return `
      <article class="playlist-item ${isActive ? 'active' : ''}" data-id="${track.id}" data-list-id="${listId || ''}" role="button" tabindex="0">
        <div class="pl-marker">${marker}</div>
        <div class="pl-info">
          <div class="pl-title">${escHtml(track.title || 'Unknown')}</div>
          <div class="pl-artist">${subParts.join(' • ')}</div>
        </div>
        <button class="row-menu-btn" data-action="menu" data-id="${track.id}" aria-label="Song options">⋯</button>
      </article>
    `;
  }).join('');
}

function bindTrackRows(container, queueIds, options = {}) {
  container.querySelectorAll('.playlist-item').forEach(row => {
    row.addEventListener('click', async (event) => {
      if (event.target.closest('button')) return;
      const id = Number(row.dataset.id);
      await Player.playById(id, queueIds);
    });
    row.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const id = Number(row.dataset.id);
      await Player.playById(id, queueIds);
    });
  });

  container.querySelectorAll('[data-action="menu"]').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      openSongOptions(Number(btn.dataset.id), { listId: options.listId || null });
    });
  });
}

async function renderPlaylist() {
  updateLibraryTitle();
  emptyFavorites.hidden = true;
  emptyTop.hidden = true;
  playlistEl.style.display = '';
  playlistEl.innerHTML = '';
  listsPanel.hidden = true;
  listDetail.hidden = true;

  if (activeTab === 'lists') {
    playlistEl.style.display = 'none';
    if (activeListId) await renderListDetailById(activeListId);
    else await renderListsPanel();
    return;
  }

  const tracks = getVisibleTracks();
  const queueIds = tracks.map(track => track.id);
  playlistCount.textContent = activeTab === 'top' ? `${tracks.length}/10 songs` : formatSongCount(tracks.length);

  if (!tracks.length) {
    if (activeTab === 'favorites') {
      playlistEl.style.display = 'none';
      emptyFavorites.hidden = false;
    } else if (activeTab === 'top') {
      playlistEl.style.display = 'none';
      emptyTop.hidden = false;
    } else {
      playlistEl.style.display = '';
      playlistEl.innerHTML = '<div class="empty-state-soft"><p>No songs yet</p><span>Add audio files from the main screen.</span></div>';
    }
    return;
  }

  if (!Player.currentId || queueIds.includes(Player.currentId)) Player.setQueue(queueIds, true, false);
  playlistEl.innerHTML = renderTrackRows(tracks, { showRank: activeTab === 'top', showStats: activeTab === 'top' });
  bindTrackRows(playlistEl, queueIds);
}

async function renderListsPanel() {
  activeListId = null;
  updateLibraryTitle();
  listsPanel.hidden = false;
  listDetail.hidden = true;
  playlistCount.textContent = 'Custom playlists';
  const lists = await dbGetAllPlaylists();

  if (!lists.length) {
    listsGrid.innerHTML = `
      <div class="lists-empty">
        <p>No playlists yet</p>
        <span>Create a playlist and add songs from the three-dot menu.</span>
      </div>
    `;
    return;
  }

  listsGrid.innerHTML = lists.map(list => `
    <article class="list-card" data-id="${list.id}" role="button" tabindex="0">
      <div>
        <div class="list-card-title">${escHtml(list.name)}</div>
        <div class="list-card-sub">${formatSongCount(list.trackIds.length)}</div>
      </div>
      <span class="list-card-arrow">›</span>
    </article>
  `).join('');

  listsGrid.querySelectorAll('.list-card').forEach(card => {
    const open = () => openListDetail(Number(card.dataset.id));
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
}

async function openListDetail(id, shouldPush = true) {
  activeListId = Number(id);
  await renderListDetailById(activeListId);
  if (shouldPush) pushView('list-detail');
}

async function renderListDetailById(id) {
  const playlist = await dbGetPlaylist(id);
  if (!playlist) {
    activeListId = null;
    await renderListsPanel();
    return;
  }

  updateLibraryTitle();
  listsPanel.hidden = true;
  listDetail.hidden = false;
  playlistEl.style.display = 'none';
  listDetailName.textContent = playlist.name;

  const tracksById = new Map(Player.tracks.map(track => [Number(track.id), track]));
  let tracks = playlist.trackIds.map(trackId => tracksById.get(Number(trackId))).filter(Boolean);
  tracks = applySort(tracks);
  listDetailCount.textContent = formatSongCount(tracks.length);
  playlistCount.textContent = playlist.name;
  listEmpty.hidden = tracks.length > 0;
  listDetailTracks.style.display = tracks.length ? '' : 'none';

  if (!tracks.length) {
    listDetailTracks.innerHTML = '';
    return;
  }

  const queueIds = tracks.map(track => track.id);
  if (!Player.currentId || queueIds.includes(Player.currentId)) Player.setQueue(queueIds, true, false);
  listDetailTracks.innerHTML = renderTrackRows(tracks, { listId: activeListId });
  bindTrackRows(listDetailTracks, queueIds, { listId: activeListId });
}

function setActiveTab(tab) {
  activeTab = tab;
  if (tab !== 'lists') activeListId = null;
  localStorage.setItem(LS_TAB, activeTab);
  renderPlaylist();
}

// ── Song options ─────────────────────────
function getTrackById(id) {
  return Player.tracks.find(track => Number(track.id) === Number(id));
}

function openSongOptions(trackId, context = {}) {
  const track = getTrackById(trackId);
  if (!track) return;
  songOptionsTrackId = Number(trackId);
  songOptionsListId = context.listId ? Number(context.listId) : null;
  songOptionsTitle.textContent = track.title || 'Song options';
  songOptFavorite.textContent = track.favorite ? 'Remove from Favorites' : 'Add to Favorites';
  songOptRemoveList.hidden = !songOptionsListId;
  modalSongOptions.hidden = false;
  pushView('song-options');
}

function closeSongOptionsDirect() {
  modalSongOptions.hidden = true;
  songOptionsTrackId = null;
  songOptionsListId = null;
}

async function toggleFavoriteForTrack(trackId) {
  const next = await dbToggleFavorite(trackId);
  const track = getTrackById(trackId);
  if (track) track.favorite = next;
  await renderPlaylist();
  if (screenAdmin.classList.contains('active')) await renderAdminList();
  showToast(next ? 'Added to Favorites' : 'Removed from Favorites');
}

async function removeTrackFromCurrentList(trackId) {
  if (!songOptionsListId) return;
  await dbRemoveTrackFromPlaylist(songOptionsListId, trackId);
  showToast('Removed from playlist');
  closeViaHistoryOr(closeSongOptionsDirect);
  await renderListDetailById(songOptionsListId);
}

// ── Admin library ────────────────────────
async function renderAdminList() {
  const tracks = applySort(Player.tracks);
  const size = await dbGetTotalSize();
  adminCount.textContent = formatSongCount(tracks.length);
  adminSize.textContent = `${(size / 1024 / 1024).toFixed(1)} MB used`;
  emptyState.classList.toggle('visible', tracks.length === 0);
  adminList.innerHTML = '';
  if (!tracks.length) return;

  adminList.innerHTML = tracks.map(track => {
    const checked = selectedIds.has(Number(track.id));
    return `
      <article class="admin-item ${selectMode ? 'selectable' : ''} ${checked ? 'selected' : ''}" data-id="${track.id}">
        ${selectMode ? `<div class="select-checkbox ${checked ? 'checked' : ''}"></div>` : ''}
        <div class="admin-info-col">
          <div class="admin-title">${escHtml(track.title || 'Unknown')}</div>
          <div class="admin-artist">${escHtml(track.artist || 'Unknown')} • ${formatPlayCount(track.playCount || 0)}</div>
        </div>
        <div class="admin-actions" ${selectMode ? 'hidden' : ''}>
          <button class="admin-btn menu-btn" data-id="${track.id}">Options</button>
          <button class="admin-btn edit-btn" data-id="${track.id}">Edit</button>
          <button class="admin-btn delete-btn danger" data-id="${track.id}">Delete</button>
        </div>
      </article>
    `;
  }).join('');

  adminList.querySelectorAll('.admin-item').forEach(item => {
    item.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (selectMode) toggleSelected(Number(item.dataset.id));
    });
  });

  adminList.querySelectorAll('.menu-btn').forEach(btn => btn.addEventListener('click', () => openSongOptions(Number(btn.dataset.id))));
  adminList.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openRenameModal(Number(btn.dataset.id), true)));
  adminList.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteSong(Number(btn.dataset.id))));
}

function setSelectMode(enabled) {
  selectMode = enabled;
  if (!enabled) selectedIds.clear();
  selectBar.hidden = !enabled;
  updateSelectCount();
  renderAdminList();
}

function toggleSelected(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  updateSelectCount();
  renderAdminList();
}

function updateSelectCount() {
  selectCount.textContent = `${selectedIds.size} selected`;
}

async function deleteSong(id) {
  const track = getTrackById(id);
  if (!track) return;
  if (!confirm(`Remove "${track.title}" from this device?`)) return;
  await dbDeleteTrack(id);
  await Player.refreshLibrary();
  await renderPlaylist();
  await renderAdminList();
  showToast('Song removed');
}

function openRenameModal(id, withHistory = false) {
  const track = getTrackById(id);
  if (!track) return;
  renamingId = Number(id);
  renameTitle.value = track.title || '';
  renameArtist.value = track.artist || '';
  modalRename.hidden = false;
  if (withHistory) pushView('rename');
  setTimeout(() => renameTitle.focus(), 50);
}

async function saveRename() {
  if (!renamingId) return;
  const updated = await dbUpdateTrack(renamingId, {
    title: renameTitle.value.trim() || 'Unknown',
    artist: renameArtist.value.trim() || 'Unknown',
  });
  const track = getTrackById(renamingId);
  if (track && updated) Object.assign(track, updated);
  modalRename.hidden = true;
  renamingId = null;
  await renderPlaylist();
  await renderAdminList();
  showToast('Track updated');
}

// ── Local file import/export ─────────────
async function getAudioDuration(blob) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;
    const done = (duration) => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(duration) ? duration : 0);
    };
    audio.addEventListener('loadedmetadata', () => done(audio.duration), { once: true });
    audio.addEventListener('error', () => done(0), { once: true });
  });
}

function parseFileName(name) {
  const baseName = String(name || '').replace(/\.[^/.]+$/, '').trim();
  let title = baseName || 'Unknown';
  let artist = 'Unknown';
  const dash = baseName.indexOf(' - ');
  if (dash !== -1) {
    artist = baseName.slice(0, dash).trim() || 'Unknown';
    title = baseName.slice(dash + 3).trim() || 'Unknown';
  }
  return { title, artist };
}

async function saveBlobAsTrack(blob, title, artist, filename = '') {
  const safeTitle = String(title || '').trim() || parseFileName(filename).title || 'Unknown';
  const safeArtist = String(artist || '').trim() || parseFileName(filename).artist || 'Unknown';
  const duplicate = await dbCheckDuplicate(safeTitle, safeArtist);
  if (duplicate) {
    showToast('This song is already in the library');
    return null;
  }
  const duration = await getAudioDuration(blob);
  const id = await dbSaveTrack({
    title: safeTitle,
    artist: safeArtist,
    blob,
    duration,
    size: Number(blob.size || 0),
    favorite: false,
  });
  await Player.refreshLibrary();
  await renderPlaylist();
  if (screenAdmin.classList.contains('active')) await renderAdminList();
  showToast('Song added');
  return id;
}

async function addAudioFiles(files) {
  const fileList = Array.from(files || []);
  if (!fileList.length) return;

  const supported = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  let added = 0;
  let skipped = 0;
  const duplicates = [];

  showToast('Adding songs...', 1200);

  for (const file of fileList) {
    const ok = (file.type && file.type.startsWith('audio/')) || file.type === 'video/mp4' || supported.test(file.name);
    if (!ok) { skipped++; continue; }

    const { title, artist } = parseFileName(file.name);
    const duplicate = await dbCheckDuplicate(title, artist);
    if (duplicate) { duplicates.push(title); continue; }

    const duration = await getAudioDuration(file);
    await dbSaveTrack({ title, artist, blob: file, duration, size: file.size, favorite: false });
    added++;
  }

  fileInput.value = '';
  await Player.refreshLibrary();
  await renderPlaylist();
  if (screenAdmin.classList.contains('active')) await renderAdminList();

  if (added) showToast(`${added} song${added === 1 ? '' : 's'} added`);
  else if (duplicates.length) showToast(`Already in library: ${duplicates.slice(0, 3).join(', ')}${duplicates.length > 3 ? '...' : ''}`, 3800);
  else showToast(skipped ? 'No supported audio files found' : 'No songs added');
}

async function exportLibrary() {
  try {
    showToast('Preparing backup...', 1200);
    const json = await dbExportLibrary();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-english-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Backup exported');
  } catch (error) {
    console.error(error);
    showToast('Could not export backup');
  }
}

async function importLibrary(file) {
  if (!file) return;
  try {
    const text = await file.text();
    showToast('Importing backup...', 1500);
    const result = await dbImportLibrary(text);
    importFileInput.value = '';
    await Player.refreshLibrary();
    await renderPlaylist();
    await renderAdminList();
    showToast(`Imported ${result.imported}; skipped ${result.skipped}`);
  } catch (error) {
    console.error(error);
    showToast('Invalid backup file');
  }
}

// ── Playlists ────────────────────────────
async function openAddToListModal(trackId, withHistory = true) {
  addToListTrackId = Number(trackId);
  if (!addToListTrackId) return;
  const lists = await dbGetAllPlaylists();

  if (!lists.length) {
    addToListOpts.innerHTML = `
      <div class="lists-empty">
        <p>No playlists yet</p>
        <span>Create a playlist first, then add this song.</span>
      </div>
      <button class="add-to-list-opt" data-action="create">Create playlist</button>
    `;
  } else {
    addToListOpts.innerHTML = lists.map(list => `
      <button class="add-to-list-opt" data-playlist-id="${list.id}">
        <span>${escHtml(list.name)}</span>
        <small>${formatSongCount(list.trackIds.length)}</small>
      </button>
    `).join('') + '<button class="add-to-list-opt" data-action="create">Create new playlist</button>';
  }

  addToListOpts.querySelectorAll('[data-playlist-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const playlistId = Number(btn.dataset.playlistId);
      await dbAddTrackToPlaylist(playlistId, addToListTrackId);
      modalAddToList.hidden = true;
      addToListTrackId = null;
      showToast('Added to playlist');
      if (activeTab === 'lists') await renderPlaylist();
    });
  });

  addToListOpts.querySelectorAll('[data-action="create"]').forEach(btn => {
    btn.addEventListener('click', () => {
      modalAddToList.hidden = true;
      newListName.value = '';
      modalNewList.hidden = false;
      setTimeout(() => newListName.focus(), 50);
    });
  });

  modalAddToList.hidden = false;
  if (withHistory) pushView('add-to-list');
}

async function createPlaylist() {
  const name = newListName.value.trim();
  if (!name) { showToast('Enter a playlist name'); return; }
  const id = await dbCreatePlaylist(name);
  modalNewList.hidden = true;
  newListName.value = '';
  if (addToListTrackId) {
    await dbAddTrackToPlaylist(id, addToListTrackId);
    addToListTrackId = null;
    showToast('Playlist created and song added');
  } else {
    activeTab = 'lists';
    activeListId = id;
    localStorage.setItem(LS_TAB, activeTab);
    showToast('Playlist created');
  }
  await renderPlaylist();
}

// ── Search library ───────────────────────
function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '<div class="search-empty"><p>Type to search...</p></div>';
    return;
  }

  const tracks = Player.tracks.filter(track =>
    String(track.title || '').toLowerCase().includes(query) ||
    String(track.artist || '').toLowerCase().includes(query)
  );

  if (!tracks.length) {
    searchResults.innerHTML = '<div class="search-empty"><p>No results found</p></div>';
    return;
  }

  const sorted = applySort(tracks);
  const queueIds = sorted.map(track => track.id);
  searchResults.innerHTML = renderTrackRows(sorted, { showStats: true });
  bindTrackRows(searchResults, queueIds);
}

function openSearch(shouldPush = true) {
  searchOverlay.hidden = false;
  searchInput.value = '';
  renderSearchResults();
  if (shouldPush) pushView('search');
  setTimeout(() => searchInput.focus(), 80);
}

function closeSearchDirect() {
  searchOverlay.hidden = true;
  searchInput.value = '';
}

// ── Online public audio search ───────────
function openOnline(shouldPush = true) {
  onlineOverlay.hidden = false;
  if (!onlineResults.innerHTML.trim()) {
    onlineResults.innerHTML = '<div class="online-empty"><p>Search public audio or paste a direct audio URL.</p><span>Some sources may block direct importing; in that case, download the file manually and use Add songs.</span></div>';
  }
  if (shouldPush) pushView('online');
  setTimeout(() => onlineInput.focus(), 80);
}

function closeOnlineDirect() {
  onlineOverlay.hidden = true;
  if (onlineAbortController) onlineAbortController.abort();
}

function cleanArchiveText(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function archiveSearchUrl(query) {
  const q = `${query} AND mediatype:audio`;
  const params = new URLSearchParams();
  params.set('q', q);
  params.append('fl[]', 'identifier');
  params.append('fl[]', 'title');
  params.append('fl[]', 'creator');
  params.set('rows', '14');
  params.set('page', '1');
  params.set('output', 'json');
  return `https://archive.org/advancedsearch.php?${params.toString()}`;
}

async function searchOnlineAudio() {
  const query = onlineInput.value.trim();
  if (!query) { showToast('Type something to search'); return; }
  if (onlineAbortController) onlineAbortController.abort();
  onlineAbortController = new AbortController();
  onlineResults.innerHTML = '<div class="online-empty"><p>Searching online...</p></div>';

  try {
    const response = await fetch(archiveSearchUrl(query), { signal: onlineAbortController.signal });
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    const docs = data?.response?.docs || [];
    renderOnlineResults(docs);
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error(error);
    onlineResults.innerHTML = '<div class="online-empty"><p>Online search is unavailable right now.</p><span>You can paste a direct legal audio URL or add a local file.</span></div>';
  }
}

function renderOnlineResults(docs) {
  if (!docs.length) {
    onlineResults.innerHTML = '<div class="online-empty"><p>No online results found</p><span>Try another title, artist, or paste a direct audio URL.</span></div>';
    return;
  }

  onlineResults.innerHTML = docs.map((doc, index) => {
    const title = cleanArchiveText(doc.title) || doc.identifier || 'Untitled audio';
    const creator = Array.isArray(doc.creator) ? doc.creator.join(', ') : cleanArchiveText(doc.creator || 'Unknown');
    return `
      <article class="online-item" data-index="${index}">
        <div class="pl-info">
          <div class="pl-title">${escHtml(title)}</div>
          <div class="pl-artist">${escHtml(creator)}</div>
        </div>
        <div class="online-actions">
          <button class="mini-btn" data-action="add-online" data-index="${index}">Add</button>
        </div>
      </article>
    `;
  }).join('');

  onlineResults.querySelectorAll('[data-action="add-online"]').forEach(btn => {
    btn.addEventListener('click', () => addArchiveItem(docs[Number(btn.dataset.index)]));
  });
}

function chooseArchiveAudioFile(files = []) {
  const audioExt = /\.(mp3|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  const candidates = files.filter(file => {
    const name = file?.name || '';
    const format = String(file?.format || '');
    return audioExt.test(name) || /MP3|Ogg|Vorbis|FLAC|WAVE|AAC|MPEG|WebM/i.test(format);
  }).filter(file => !String(file.name || '').includes('_files.xml'));

  const preference = ['VBR MP3', 'MP3', 'Ogg Vorbis', 'Ogg', 'AAC', 'M4A', 'FLAC', 'WAVE', 'WebM'];
  candidates.sort((a, b) => {
    const ai = preference.findIndex(p => String(a.format || a.name || '').toLowerCase().includes(p.toLowerCase()));
    const bi = preference.findIndex(p => String(b.format || b.name || '').toLowerCase().includes(p.toLowerCase()));
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || Number(a.size || 0) - Number(b.size || 0);
  });
  return candidates[0] || null;
}

function mimeFromName(name) {
  const ext = String(name || '').split('.').pop().toLowerCase();
  return ({ mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', aac: 'audio/aac', webm: 'audio/webm', weba: 'audio/webm' })[ext] || 'audio/mpeg';
}

async function addArchiveItem(doc) {
  if (!doc?.identifier) return;
  const title = cleanArchiveText(doc.title) || doc.identifier;
  const artist = Array.isArray(doc.creator) ? doc.creator.join(', ') : cleanArchiveText(doc.creator || 'Unknown');
  showToast('Finding audio file...', 1600);

  try {
    const metaResponse = await fetch(`https://archive.org/metadata/${encodeURIComponent(doc.identifier)}`);
    if (!metaResponse.ok) throw new Error('Could not load metadata');
    const meta = await metaResponse.json();
    const file = chooseArchiveAudioFile(meta.files || []);
    if (!file) { showToast('No downloadable audio file found'); return; }
    const path = String(file.name).split('/').map(encodeURIComponent).join('/');
    const url = `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${path}`;
    await addFromUrl(url, title, artist, file.name);
  } catch (error) {
    console.error(error);
    showToast('This source could not be imported directly');
  }
}

async function addFromUrl(url, title = '', artist = '', filename = '') {
  const cleanUrl = String(url || '').trim();
  if (!cleanUrl) { showToast('Paste an audio URL first'); return; }
  showToast('Downloading audio...', 1800);
  try {
    const response = await fetch(cleanUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const blobFromResponse = await response.blob();
    const fallbackName = filename || decodeURIComponent(cleanUrl.split('/').pop() || 'online-audio.mp3').split('?')[0];
    const type = blobFromResponse.type || mimeFromName(fallbackName);
    const blob = blobFromResponse.type ? blobFromResponse : new Blob([blobFromResponse], { type });
    const parsed = parseFileName(fallbackName);
    await saveBlobAsTrack(blob, title || parsed.title, artist || parsed.artist, fallbackName);
  } catch (error) {
    console.error(error);
    showToast('Direct import was blocked. Download it manually, then use Add songs.', 4200);
  }
}

// ── Lyrics / Karaoke ─────────────────────
function wordSpans(line) {
  const words = line?.words && line.words.length ? line.words : String(line?.text || '').split(/\s+/).filter(Boolean).map(text => ({ text }));
  return words.map((word, index) => `<span class="lyric-word word-color-${index % 8} future-word" data-word-index="${index}">${escHtml(word.text)}</span>`).join(' ');
}

function lineHtml(line, index) {
  return `<div class="lyric-line future" data-idx="${index}" role="button" tabindex="0">${wordSpans(line)}</div>`;
}

function renderKaraokeLines(lines) {
  lyricsRenderedSignature = `${lines.length}:${lines[0]?.time || 0}:${lines[lines.length - 1]?.time || 0}`;
  const html = lines.map(lineHtml).join('');
  inlineLines.innerHTML = html;
  fullscreenLines.innerHTML = html;
  bindLyricLineSeeking(inlineLines);
  bindLyricLineSeeking(fullscreenLines);
}

function bindLyricLineSeeking(container) {
  container.querySelectorAll('.lyric-line').forEach(lineEl => {
    const seekLine = (event) => {
      event.stopPropagation();
      const idx = Number(lineEl.dataset.idx);
      const line = Lyrics.lines[idx];
      if (line && Player.duration) Player.seek(line.time / Player.duration);
    };
    lineEl.addEventListener('click', seekLine);
    lineEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') seekLine(event);
    });
  });
}

function resetLyricsView(message = 'Lyrics will appear here', sub = 'Play a song or add synced .LRC lyrics from Settings.') {
  inlineLines.innerHTML = '';
  fullscreenLines.innerHTML = '';
  inlineNoLyrics.classList.remove('hidden');
  fullscreenEmpty.classList.remove('hidden');
  inlineNoLyrics.querySelector('strong').textContent = message;
  inlineNoLyrics.querySelector('span').textContent = sub;
  fullscreenEmpty.querySelector('strong').textContent = message;
  fullscreenEmpty.querySelector('span').textContent = sub;
  lyricsRenderedSignature = '';
}

function updateLyricsContainer(container, idx, wordIdx, scrollKey) {
  const lineEls = container.querySelectorAll('.lyric-line');
  if (!lineEls.length || idx < 0) return scrollKey;

  lineEls.forEach((lineEl, lineIndex) => {
    lineEl.classList.toggle('active', lineIndex === idx);
    lineEl.classList.toggle('past', lineIndex < idx);
    lineEl.classList.toggle('future', lineIndex > idx);

    lineEl.querySelectorAll('.lyric-word').forEach((wordEl, wordIndex) => {
      const past = lineIndex < idx || (lineIndex === idx && wordIndex < wordIdx);
      const current = lineIndex === idx && wordIndex === wordIdx;
      const future = lineIndex > idx || (lineIndex === idx && wordIndex > wordIdx);
      wordEl.classList.toggle('past-word', past);
      wordEl.classList.toggle('current-word', current);
      wordEl.classList.toggle('future-word', future);
    });
  });

  if (idx !== scrollKey && lineEls[idx]) {
    lineEls[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
    return idx;
  }
  return scrollKey;
}

function updateLyricsHighlight(idx, wordIdx, lines) {
  if (!lines || !lines.length || idx < 0) return;
  const signature = `${lines.length}:${lines[0]?.time || 0}:${lines[lines.length - 1]?.time || 0}`;
  if (signature !== lyricsRenderedSignature) renderKaraokeLines(lines);
  inlineNoLyrics.classList.add('hidden');
  fullscreenEmpty.classList.add('hidden');
  lastMainLyricScrollIdx = updateLyricsContainer(inlineLines, idx, wordIdx, lastMainLyricScrollIdx);
  if (fullscreenActive) lastFullscreenLyricScrollIdx = updateLyricsContainer(fullscreenLines, idx, wordIdx, lastFullscreenLyricScrollIdx);
}

async function loadLyricsForTrack(track) {
  const token = ++lyricsRequestToken;
  if (!track) { resetLyricsView('Lyrics will appear here', 'Add songs and synced .LRC lyrics to start learning.'); return; }
  resetLyricsView('Searching for lyrics...', 'Aurora is looking for synced karaoke lyrics.');
  const result = await Lyrics.load(track.id, track.title, track.artist);
  if (token !== lyricsRequestToken || Player.currentId !== track.id) return;

  if (result === 'found' || result === 'cached') {
    renderKaraokeLines(Lyrics.lines);
    inlineNoLyrics.classList.add('hidden');
    fullscreenEmpty.classList.add('hidden');
    const state = Lyrics.sync(Player.currentTime);
    updateLyricsHighlight(state.idx, state.wordIdx, state.lines);
  } else {
    resetLyricsView('No synced lyrics yet', 'Open Settings and upload an .LRC file for this song.');
  }
}

function handleLrcUpload() {
  const track = Player.currentTrack();
  if (!track) { showToast('Play a song first'); return; }
  lrcFileInput.click();
}

async function deleteCurrentLyrics() {
  const track = Player.currentTrack();
  if (!track) { showToast('No song selected'); return; }
  if (!confirm('Delete lyrics for this song?')) return;
  await Lyrics.remove(track.id);
  resetLyricsView('No synced lyrics yet', 'Open Settings and upload an .LRC file for this song.');
  showToast('Lyrics deleted');
}

// ── Fullscreen karaoke ───────────────────
function openFullscreenKaraoke() {
  if (fullscreenActive) return;
  fullscreenActive = true;
  fullscreenClosing = false;
  document.body.classList.add('in-fullscreen-transition');
  fullscreenKaraoke.hidden = false;
  fullscreenKaraoke.classList.remove('controls-visible');
  lastFullscreenLyricScrollIdx = -1;
  const state = Lyrics.sync(Player.currentTime);
  updateLyricsHighlight(state.idx, state.wordIdx, state.lines);
  requestAnimationFrame(() => fullscreenKaraoke.classList.add('active'));
  pushView('fullscreen');
  setTimeout(() => document.body.classList.remove('in-fullscreen-transition'), 360);
  if (fullscreenKaraoke.requestFullscreen) {
    fullscreenKaraoke.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
  }
}

function closeFullscreenDirect(fromPop = false) {
  if (!fullscreenActive) return;
  fullscreenClosing = true;
  fullscreenActive = false;
  fullscreenKaraoke.classList.remove('active', 'controls-visible');
  if (document.fullscreenElement === fullscreenKaraoke && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  setTimeout(() => {
    if (!fullscreenActive) fullscreenKaraoke.hidden = true;
    fullscreenClosing = false;
  }, 300);
}

function toggleFullscreenControls() {
  if (!fullscreenActive) return;
  fullscreenKaraoke.classList.toggle('controls-visible');
}

// ── Settings ─────────────────────────────
function openSettings() {
  settingsPanel.hidden = false;
  settingsNight.textContent = `Night mode: ${document.body.classList.contains('manual-night') ? 'On' : 'Off'}`;
  pushView('settings');
}

function closeSettingsDirect() {
  settingsPanel.hidden = true;
}

function switchFromSettingsTo(view, openFn) {
  closeSettingsDirect();
  replaceView(view);
  openFn(false);
}

// ── Event bindings ───────────────────────
btnSettings.addEventListener('click', openSettings);
settingsClose.addEventListener('click', () => closeViaHistoryOr(closeSettingsDirect));
settingsBackdrop.addEventListener('click', () => closeViaHistoryOr(closeSettingsDirect));

settingsTheme.addEventListener('click', () => { modalTheme.hidden = false; renderThemeOptions(); pushView('theme'); });
settingsNight.addEventListener('click', () => setNightMode(!document.body.classList.contains('manual-night')));
btnSleepOpen.addEventListener('click', () => {
  if (SleepTimer.active) {
    SleepTimer.cancel();
    showToast('Sleep timer cancelled');
  } else {
    modalSleep.hidden = false;
    pushView('sleep');
  }
});
settingsAll.addEventListener('click', () => { setActiveTab('all'); closeViaHistoryOr(closeSettingsDirect); });
settingsFavorites.addEventListener('click', () => { setActiveTab('favorites'); closeViaHistoryOr(closeSettingsDirect); });
settingsPlaylists.addEventListener('click', () => { setActiveTab('lists'); closeViaHistoryOr(closeSettingsDirect); });
settingsTop.addEventListener('click', () => { setActiveTab('top'); closeViaHistoryOr(closeSettingsDirect); });
settingsSearchLibrary.addEventListener('click', () => switchFromSettingsTo('search', openSearch));
settingsUploadLyrics.addEventListener('click', handleLrcUpload);
settingsDeleteLyrics.addEventListener('click', deleteCurrentLyrics);
settingsManage.addEventListener('click', () => switchFromSettingsTo('admin', () => showMainScreen('admin')));
settingsImport.addEventListener('click', () => importFileInput.click());
settingsExport.addEventListener('click', exportLibrary);

btnBack.addEventListener('click', () => closeViaHistoryOr(() => showMainScreen('player')));
btnAddSong.addEventListener('click', () => fileInput.click());
btnAddSongMain.addEventListener('click', () => fileInput.click());
btnOnlineSearch.addEventListener('click', openOnline);
fileInput.addEventListener('change', () => addAudioFiles(fileInput.files));
btnExport.addEventListener('click', exportLibrary);
btnImport.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', () => importLibrary(importFileInput.files[0]));

btnPlay.addEventListener('click', () => Player.togglePlay());
btnPrev.addEventListener('click', () => Player.prev());
btnNext.addEventListener('click', () => Player.next(true));
btnShuffle.addEventListener('click', () => {
  const on = Player.toggleShuffle();
  updateTransportButtons();
  showToast(on ? 'Shuffle on' : 'Shuffle off');
});
btnRepeat.addEventListener('click', () => {
  const mode = Player.cycleRepeat();
  updateTransportButtons();
  showToast(mode === 'none' ? 'Repeat off' : mode === 'all' ? 'Repeat all' : 'Repeat one');
});

function seekFromPointer(event, element) {
  const rect = element.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const ratio = Math.min(Math.max((point.clientX - rect.left) / rect.width, 0), 1);
  Player.seek(ratio);
}
progressWrap.addEventListener('click', (event) => seekFromPointer(event, progressWrap));
progressWrap.addEventListener('touchstart', (event) => seekFromPointer(event, progressWrap), { passive: true });
fullscreenProgressWrap.addEventListener('click', (event) => seekFromPointer(event, fullscreenProgressWrap));

sortSelect.addEventListener('change', () => {
  sortMode = sortSelect.value;
  localStorage.setItem(LS_SORT, sortMode);
  renderPlaylist();
  if (screenAdmin.classList.contains('active')) renderAdminList();
});

btnSelect.addEventListener('click', () => {
  if (!Player.tracks.length) { showToast('No songs to select'); return; }
  setSelectMode(!selectMode);
});
selectCancelBtn.addEventListener('click', () => setSelectMode(false));
selectAllBtn.addEventListener('click', () => {
  selectedIds = new Set(Player.tracks.map(track => Number(track.id)));
  updateSelectCount();
  renderAdminList();
});
selectDeleteBtn.addEventListener('click', async () => {
  if (!selectedIds.size) { showToast('No songs selected'); return; }
  if (!confirm(`Remove ${selectedIds.size} selected song${selectedIds.size === 1 ? '' : 's'} from this device?`)) return;
  await dbDeleteTracks([...selectedIds]);
  selectedIds.clear();
  setSelectMode(false);
  await Player.refreshLibrary();
  await renderPlaylist();
  await renderAdminList();
  showToast('Selected songs removed');
});

songOptPlay.addEventListener('click', async () => {
  if (!songOptionsTrackId) return;
  await Player.playById(songOptionsTrackId);
  closeViaHistoryOr(closeSongOptionsDirect);
});
songOptFavorite.addEventListener('click', async () => {
  if (!songOptionsTrackId) return;
  const id = songOptionsTrackId;
  closeViaHistoryOr(closeSongOptionsDirect);
  await toggleFavoriteForTrack(id);
});
songOptAddList.addEventListener('click', async () => {
  if (!songOptionsTrackId) return;
  const id = songOptionsTrackId;
  closeSongOptionsDirect();
  replaceView('add-to-list');
  await openAddToListModal(id, false);
});
songOptRemoveList.addEventListener('click', () => {
  if (songOptionsTrackId) removeTrackFromCurrentList(songOptionsTrackId);
});
songOptEdit.addEventListener('click', () => {
  if (!songOptionsTrackId) return;
  const id = songOptionsTrackId;
  closeSongOptionsDirect();
  replaceView('rename');
  openRenameModal(id, false);
});
songOptDelete.addEventListener('click', async () => {
  if (!songOptionsTrackId) return;
  const id = songOptionsTrackId;
  closeViaHistoryOr(closeSongOptionsDirect);
  await deleteSong(id);
});
songOptCancel.addEventListener('click', () => closeViaHistoryOr(closeSongOptionsDirect));
modalSongOptions.addEventListener('click', (event) => { if (event.target === modalSongOptions) closeViaHistoryOr(closeSongOptionsDirect); });

modalCancel.addEventListener('click', () => closeViaHistoryOr(() => { modalRename.hidden = true; renamingId = null; }));
modalSave.addEventListener('click', saveRename);
modalRename.addEventListener('click', (event) => { if (event.target === modalRename) closeViaHistoryOr(() => { modalRename.hidden = true; renamingId = null; }); });
renameTitle.addEventListener('keydown', (event) => { if (event.key === 'Enter') saveRename(); });
renameArtist.addEventListener('keydown', (event) => { if (event.key === 'Enter') saveRename(); });

btnNewList.addEventListener('click', () => { addToListTrackId = null; newListName.value = ''; modalNewList.hidden = false; pushView('new-list'); setTimeout(() => newListName.focus(), 50); });
newListCancel.addEventListener('click', () => closeViaHistoryOr(() => { modalNewList.hidden = true; addToListTrackId = null; }));
newListSave.addEventListener('click', createPlaylist);
newListName.addEventListener('keydown', (event) => { if (event.key === 'Enter') createPlaylist(); });
modalNewList.addEventListener('click', (event) => { if (event.target === modalNewList) closeViaHistoryOr(() => { modalNewList.hidden = true; addToListTrackId = null; }); });
addToListCancel.addEventListener('click', () => closeViaHistoryOr(() => { modalAddToList.hidden = true; addToListTrackId = null; }));
modalAddToList.addEventListener('click', (event) => { if (event.target === modalAddToList) closeViaHistoryOr(() => { modalAddToList.hidden = true; addToListTrackId = null; }); });

listBack.addEventListener('click', () => closeViaHistoryOr(() => { activeListId = null; renderListsPanel(); updateLibraryTitle(); }));
listDeleteBtn.addEventListener('click', async () => {
  if (!activeListId) return;
  if (!confirm('Delete this playlist? Songs will stay in your library.')) return;
  await dbDeletePlaylist(activeListId);
  activeListId = null;
  await renderListsPanel();
  showToast('Playlist deleted');
});

themeClose.addEventListener('click', () => closeViaHistoryOr(() => { modalTheme.hidden = true; }));
modalTheme.addEventListener('click', (event) => { if (event.target === modalTheme) closeViaHistoryOr(() => { modalTheme.hidden = true; }); });

searchBack.addEventListener('click', () => closeViaHistoryOr(closeSearchDirect));
searchInput.addEventListener('input', renderSearchResults);

onlineBack.addEventListener('click', () => closeViaHistoryOr(closeOnlineDirect));
onlineSearchBtn.addEventListener('click', searchOnlineAudio);
onlineInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') searchOnlineAudio(); });
directAddBtn.addEventListener('click', () => addFromUrl(directUrlInput.value, directTitleInput.value, directArtistInput.value));

modalSleepCancel.addEventListener('click', () => closeViaHistoryOr(() => { modalSleep.hidden = true; }));
modalSleep.addEventListener('click', (event) => { if (event.target === modalSleep) closeViaHistoryOr(() => { modalSleep.hidden = true; }); });
document.querySelectorAll('.sleep-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    SleepTimer.start(Number(btn.dataset.minutes));
    modalSleep.hidden = true;
    showToast(`Sleep timer set: ${btn.textContent.trim()}`);
  });
});
sleepCustomSet.addEventListener('click', () => {
  const minutes = Number(sleepCustomInput.value);
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 480) { showToast('Enter 1–480 minutes'); return; }
  SleepTimer.start(minutes);
  sleepCustomInput.value = '';
  modalSleep.hidden = true;
  showToast(`Sleep timer set: ${minutes} min`);
});

lrcFileInput.addEventListener('change', async () => {
  const file = lrcFileInput.files[0];
  const track = Player.currentTrack();
  if (!file || !track) return;
  const text = await file.text();
  const ok = await Lyrics.saveManual(track.id, text);
  lrcFileInput.value = '';
  if (!ok) { showToast('Could not parse this .LRC file'); return; }
  renderKaraokeLines(Lyrics.lines);
  const state = Lyrics.sync(Player.currentTime);
  updateLyricsHighlight(state.idx, state.wordIdx, state.lines);
  showToast('Lyrics loaded');
});

karaokeMain.addEventListener('click', (event) => {
  const now = Date.now();
  if (now - lastKaraokeTap < 330) {
    event.preventDefault();
    openFullscreenKaraoke();
    lastKaraokeTap = 0;
  } else {
    lastKaraokeTap = now;
  }
});

fullscreenKaraoke.addEventListener('click', (event) => {
  if (event.target.closest('.fullscreen-controls')) return;
  toggleFullscreenControls();
});
fullscreenBack.addEventListener('click', () => closeViaHistoryOr(() => closeFullscreenDirect(false)));
fullscreenPlay.addEventListener('click', () => Player.togglePlay());
fullscreenPrev.addEventListener('click', () => Player.prev());
fullscreenNext.addEventListener('click', () => Player.next(true));
document.addEventListener('fullscreenchange', () => {
  if (fullscreenActive && !document.fullscreenElement && !fullscreenClosing) {
    closeFullscreenDirect(true);
  }
});

// ── Player callbacks ─────────────────────
Player.onProgress = (ratio, current, total) => {
  const safeRatio = Math.min(Math.max(ratio || 0, 0), 1);
  const pct = `${safeRatio * 100}%`;
  progressFill.style.width = pct;
  progressThumb.style.left = pct;
  progressWrap.setAttribute('aria-valuenow', String(Math.round(safeRatio * 100)));
  timeCurrent.textContent = Player.formatTime(current);
  timeTotal.textContent = Player.formatTime(total);
  fullscreenProgressFill.style.width = pct;
  fullscreenTimeCurrent.textContent = Player.formatTime(current);
  fullscreenTimeTotal.textContent = Player.formatTime(total);
  Lyrics.sync(current);
};

Player.onPlayState = (playing) => {
  playIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
  fullscreenPlayIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
};

Player.onQueueChange = () => {
  updateTransportButtons();
  renderPlaylist();
};

Player.onStatsChange = () => {
  if (activeTab === 'top') renderPlaylist();
  if (screenAdmin.classList.contains('active')) renderAdminList();
};

Player.onTrackChange = (track) => {
  trackTitle.textContent = track ? (track.title || 'Unknown') : 'No track loaded';
  trackArtist.textContent = track ? (track.artist || 'Unknown') : 'Add songs to get started';
  fullscreenTitle.textContent = track ? (track.title || 'Unknown') : 'No track loaded';
  fullscreenArtist.textContent = track ? (track.artist || 'Unknown') : '—';
  Lyrics.clear();
  lastMainLyricScrollIdx = -1;
  lastFullscreenLyricScrollIdx = -1;
  if (track) loadLyricsForTrack(track);
  else resetLyricsView('Lyrics will appear here', 'Add songs and synced .LRC lyrics to start learning.');
  renderPlaylist();
};

Lyrics.onSync = updateLyricsHighlight;

// ── Init ─────────────────────────────────
(async function init() {
  setupHistory();
  applyTheme(localStorage.getItem(LS_THEME) || 'midnight');
  setNightMode(localStorage.getItem(LS_NIGHT) === '1');
  sortSelect.value = sortMode;
  updateLibraryTitle();
  updateTransportButtons();
  Player.setupMediaSession();
  await Player.loadLibrary();
  await renderPlaylist();
  await dbRequestPersistentStorage();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
