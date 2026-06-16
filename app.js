/* ═══════════════════════════════════════
   app.js — Aurora Player modern UI controller
═══════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const screenPlayer = $('screen-player');
const screenAdmin = $('screen-admin');
const screenLyrics = $('screen-lyrics');
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
const btnOpenAdmin = $('btn-open-admin');
const btnBack = $('btn-back');
const btnSearch = $('btn-search');
const btnTheme = $('btn-theme');
const btnLyrics = $('btn-lyrics');
const btnAddSong = $('btn-add-song');
const fileInput = $('file-input');
const btnImport = $('btn-import');
const btnExport = $('btn-export');
const importFileInput = $('import-file-input');
const toastEl = $('toast');

const playlistEl = $('playlist');
const playlistCount = $('playlist-count');
const sortSelect = $('sort-select');
const tabAll = $('tab-all');
const tabFav = $('tab-fav');
const tabLists = $('tab-lists');
const tabTop = $('tab-top');
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

const searchOverlay = $('search-overlay');
const searchInput = $('search-input');
const searchResults = $('search-results');
const searchBack = $('search-back');

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

const lyricsClose = $('lyrics-close');
const lyricsLines = $('lyrics-lines');
const lyricsContent = $('lyrics-content');
const lyricsLoading = $('lyrics-loading');
const lyricsNotFound = $('lyrics-not-found');
const lyricsNoTrack = $('lyrics-no-track');
const lyricsTrackTitle = $('lyrics-track-title');
const lyricsTrackArtist = $('lyrics-track-artist');
const lyricsPFill = $('lyrics-progress-fill');
const lyricsCurrent = $('lyrics-time-current');
const lyricsTotal = $('lyrics-time-total');
const lyricsPlayIcon = $('lyrics-play-icon');
const lyricsProgressWrap = $('lyrics-progress-wrap');
const lyricsUploadBtn = $('lyrics-upload-btn');
const lyricsUploadBtn2 = $('lyrics-upload-btn2');
const lyricsDeleteBtn = $('lyrics-delete-btn');
const lyricsFullscreenBtn = $('lyrics-fullscreen-btn');
const lrcFileInput = $('lrc-file-input');

const inlineLyricsFlow = $('inline-lyrics-flow');
const cleanFullscreen = $('clean-fullscreen');
const fullscreenLyricsFlow = $('fullscreen-lyrics-flow');
const fullscreenEmpty = $('fullscreen-empty');
const fullscreenControls = $('fullscreen-controls');
const fullscreenBack = $('fullscreen-back');
const fullscreenProgressWrap = $('fullscreen-progress-wrap');
const fullscreenProgressFill = $('fullscreen-progress-fill');
const fullscreenCurrent = $('fullscreen-time-current');
const fullscreenTotal = $('fullscreen-time-total');
const fullscreenPrev = $('fullscreen-prev');
const fullscreenNext = $('fullscreen-next');
const fullscreenPlay = $('fullscreen-play');
const fullscreenPlayIcon = $('fullscreen-play-icon');
const btnNightMode = $('btn-night-mode');
const btnSearchAddLocal = $('btn-search-add-local');
const onlineSearchInput = $('online-search-input');
const onlineSearchBtn = $('online-search-btn');
const onlineResults = $('online-results');
const youtubeSearchBtn = $('youtube-search-btn');
const directUrlInput = $('direct-url-input');
const directTitleInput = $('direct-title-input');
const directArtistInput = $('direct-artist-input');
const directAddBtn = $('direct-add-btn');
const modalTrackMenu = $('modal-track-menu');
const trackMenuTitle = $('track-menu-title');
const trackMenuPlay = $('track-menu-play');
const trackMenuFav = $('track-menu-fav');
const trackMenuAddList = $('track-menu-add-list');
const trackMenuEdit = $('track-menu-edit');
const trackMenuRemoveList = $('track-menu-remove-list');
const trackMenuDelete = $('track-menu-delete');
const trackMenuCancel = $('track-menu-cancel');
const btnOnlineSearch = $('btn-online-search');
const btnListSearch = $('btn-list-search');
const btnAdminTheme = $('btn-admin-theme');
const btnAdminNight = $('btn-admin-night');
const dashTotalSongs = $('dash-total-songs');
const dashFavorites = $('dash-favorites');
const dashPlaylists = $('dash-playlists');
const dashShowTop = $('dash-show-top');
const dashTopSongs = $('dash-top-songs');
const dashTopArtists = $('dash-top-artists');
const listAddSongsBtn = $('list-add-songs');
const modalPickSongs = $('modal-pick-songs');
const pickSongSearch = $('pick-song-search');
const pickSongList = $('pick-song-list');
const pickSongClose = $('pick-song-close');
const youtubeQueryInput = $('youtube-query-input');
const youtubeLinkInput = $('youtube-link-input');
const youtubePreview = $('youtube-preview');
const youtubeCopyLink = $('youtube-copy-link');
const youtubeOpenY2Mate = $('youtube-open-y2mate');
const youtubeAddDownloaded = $('youtube-add-downloaded');

const LS_TAB = 'aurora_active_tab';
const LS_SORT = 'aurora_sort_mode';
const LS_THEME = 'aurora_theme';
const LS_NIGHT = 'aurora_night_mode';

const THEMES = [
  { id: 'midnight', name: 'Midnight Blue', swatch: '#1d4ed8' },
  { id: 'electric', name: 'Electric Cyan', swatch: '#06b6d4' },
  { id: 'royal', name: 'Royal Violet', swatch: '#8b5cf6' },
  { id: 'emerald', name: 'Neon Emerald', swatch: '#10b981' },
  { id: 'crimson', name: 'Crimson Pulse', swatch: '#f43f5e' },
  { id: 'gold', name: 'Solar Gold', swatch: '#f59e0b' },
  { id: 'ocean', name: 'Deep Ocean', swatch: '#0284c7' },
  { id: 'arctic', name: 'Arctic Ice', swatch: '#93c5fd' },
  { id: 'neon', name: 'Neon Lime', swatch: '#bef264' },
  { id: 'sunset', name: 'Sunset Pop', swatch: '#f97316' },
  { id: 'rose', name: 'Rose Glow', swatch: '#e11d48' },
  { id: 'lava', name: 'Lava Red', swatch: '#ef4444' },
  { id: 'forest', name: 'Forest Green', swatch: '#16a34a' },
  { id: 'mint', name: 'Mint Teal', swatch: '#2dd4bf' },
  { id: 'amber', name: 'Amber Night', swatch: '#d97706' },
  { id: 'graphite', name: 'Graphite', swatch: '#64748b' },
  { id: 'grape', name: 'Grape Neon', swatch: '#a855f7' },
  { id: 'coral', name: 'Soft Coral', swatch: '#fb7185' },
  { id: 'indigo', name: 'Indigo Focus', swatch: '#4f46e5' },
  { id: 'mono', name: 'Mono White', swatch: '#f8fafc' },
  { id: 'sleep', name: 'Night Sleep', swatch: '#0f172a' },
  { id: 'cosmic', name: 'Cosmic Blue', swatch: '#2563eb' },
  { id: 'ultraviolet', name: 'Ultraviolet', swatch: '#7c3aed' },
  { id: 'cyberpunk', name: 'Cyberpunk', swatch: '#f0f000' },
  { id: 'ruby', name: 'Ruby Noir', swatch: '#be123c' },
  { id: 'sapphire', name: 'Sapphire', swatch: '#0ea5e9' },
  { id: 'jade', name: 'Jade', swatch: '#059669' },
  { id: 'peach', name: 'Peach', swatch: '#fb923c' },
  { id: 'plum', name: 'Plum', swatch: '#c026d3' },
  { id: 'steel', name: 'Blue Steel', swatch: '#94a3b8' },
  { id: 'coffee', name: 'Coffee', swatch: '#a16207' },
  { id: 'aurora', name: 'Aurora Glow', swatch: '#22d3ee' },
  { id: 'matrix', name: 'Matrix', swatch: '#22c55e' },
];

let activeTab = ['all', 'favorites', 'lists', 'top'].includes(localStorage.getItem(LS_TAB)) ? localStorage.getItem(LS_TAB) : 'all';
let sortMode = ['recent', 'az'].includes(localStorage.getItem(LS_SORT)) ? localStorage.getItem(LS_SORT) : 'recent';
let activeListId = null;
let toastTimer = null;
let renamingId = null;
let selectMode = false;
let selectedIds = new Set();
let addToListTrackId = null;
let lyricsVisible = false;
let lyricsRequestToken = 0;
let lastLyricScrollIdx = -1;
let lastLyricsTap = 0;
let lastMainLyricsTap = 0;
let fullscreenControlsTimer = null;
let trackMenuTrackId = null;
let trackMenuQueueIds = [];
let trackMenuRemoveHandler = null;
let backGuardReady = false;

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

function showMainScreen(name) {
  screenPlayer.classList.toggle('active', name === 'player');
  screenAdmin.classList.toggle('active', name === 'admin');
  if (name === 'admin') {
    renderAdminList();
    renderDashboard();
  }
}

function openAdminScreen() {
  showMainScreen('admin');
}

function isModalOpen(el) {
  return el && el.hidden === false;
}

function closeTopLayer() {
  if (cleanFullscreen && cleanFullscreen.hidden === false) { exitCleanFullscreen(); return true; }
  const modalPlaylistsEl = document.getElementById('modal-playlists');
  if (modalPlaylistsEl && modalPlaylistsEl.hidden === false) {
    if (activeListId) { activeListId = null; renderListsPanel(); return true; }
    if (typeof window.closePlaylistsModal === 'function') window.closePlaylistsModal();
    return true;
  }
  const modals = [modalTrackMenu, modalRename, modalNewList, modalAddToList, modalPickSongs, modalTheme, modalSleep];
  const openModal = modals.find(isModalOpen);
  if (openModal) { openModal.hidden = true; return true; }
  if (searchOverlay && searchOverlay.hidden === false) { closeSearchOverlay(); return true; }
  if (lyricsVisible) { hideLyricsScreen(); return true; }
  if (activeTab === 'lists' && activeListId) { activeListId = null; renderListsPanel(); return true; }
  if (screenAdmin.classList.contains('active')) { showMainScreen('player'); return true; }
  return false;
}

function setupBackGuard() {
  if (backGuardReady || !window.history || !history.pushState) return;
  backGuardReady = true;
  try {
    history.replaceState({ auroraRoot: true }, '', location.href);
    history.pushState({ auroraGuard: true }, '', location.href);
    window.addEventListener('popstate', () => {
      if (closeTopLayer()) {
        setTimeout(() => history.pushState({ auroraGuard: true }, '', location.href), 0);
      } else {
        setTimeout(() => history.back(), 0);
      }
    });
  } catch (_) {}
}

function formatSongCount(count) {
  return `${count} song${count === 1 ? '' : 's'}`;
}

function formatPlayCount(count) {
  return `${count || 0} play${Number(count) === 1 ? '' : 's'}`;
}

function updateTransportButtons() {
  btnShuffle.classList.toggle('on', Player.shuffleOn);
  btnRepeat.classList.toggle('on', Player.repeatMode !== 'none');
  const repeatIcon = btnRepeat.querySelector('i');
  repeatIcon.className = Player.repeatMode === 'one' ? 'ti ti-repeat-once' : 'ti ti-repeat';
}

function applyTheme(themeId) {
  const theme = THEMES.some(item => item.id === themeId) ? themeId : 'midnight';
  document.body.dataset.theme = theme;
  localStorage.setItem(LS_THEME, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#050814');
  renderThemeOptions();
}

function applyNightMode(enabled) {
  const on = enabled === undefined ? !(document.body.dataset.night === 'true') : Boolean(enabled);
  document.body.dataset.night = on ? 'true' : 'false';
  localStorage.setItem(LS_NIGHT, on ? 'true' : 'false');
  if (btnNightMode) btnNightMode.classList.toggle('active', on);
  if (btnAdminNight) btnAdminNight.classList.toggle('active', on);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#000104');
  return on;
}

function renderThemeOptions() {
  if (!themeOptions) return;
  const current = document.body.dataset.theme || 'midnight';
  themeOptions.innerHTML = THEMES.map(theme => `
    <button class="theme-option ${theme.id === current ? 'active' : ''}" data-theme="${theme.id}" role="option" aria-selected="${theme.id === current}">
      <span class="theme-swatch" style="--swatch:${theme.swatch}"></span>
      <span>${escHtml(theme.name)}</span>
      ${theme.id === current ? '<i class="ti ti-check"></i>' : ''}
    </button>
  `).join('');
  themeOptions.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      showToast(`${btn.textContent.trim()} theme applied`);
    });
  });
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
      .sort((a, b) => (b.playCount - a.playCount) || (b.lastPlayedAt - a.lastPlayedAt) || compareAZ(a, b))
      .slice(0, 10);
  }
  return applySort(Player.tracks);
}

function getSearchScopeTracks() {
  if (activeTab === 'favorites') return Player.tracks.filter(track => track.favorite === true);
  if (activeTab === 'top') return getVisibleTracks();
  if (activeTab === 'lists' && activeListId) {
    return dbGetPlaylist(activeListId).then(playlist => {
      if (!playlist) return [];
      const byId = new Map(Player.tracks.map(track => [Number(track.id), track]));
      return playlist.trackIds.map(id => byId.get(Number(id))).filter(Boolean);
    });
  }
  return Player.tracks;
}

function setActiveTab(tab) {
  activeTab = tab;
  if (tab !== 'lists') activeListId = null;
  localStorage.setItem(LS_TAB, activeTab);
  renderPlaylist();
}

function updateTabs() {
  tabAll.classList.toggle('active', activeTab === 'all');
  tabFav.classList.toggle('active', activeTab === 'favorites');
  if (tabLists) tabLists.classList.toggle('active', activeTab === 'lists');
  tabTop.classList.toggle('active', activeTab === 'top');
  sortSelect.disabled = activeTab === 'top';
  sortSelect.value = sortMode;
}

function playingBars() {
  return '<div class="playing-bars" aria-label="Now playing"><span></span><span></span><span></span></div>';
}

function renderTrackRows(tracks, options = {}) {
  const currentId = Player.currentId;
  const showRank = options.showRank === true;
  const showStats = options.showStats === true;

  return tracks.map((track, index) => {
    const isActive = Number(track.id) === Number(currentId);
    const isFav = track.favorite === true;
    const left = isActive ? playingBars() : `<span class="pl-num">${index + 1}</span>`;
    const subParts = [escHtml(track.artist || 'Unknown')];
    if (showStats || showRank) subParts.push(formatPlayCount(track.playCount || 0));
    return `
      <article class="playlist-item ${isActive ? 'active' : ''}" data-id="${track.id}" role="button" tabindex="0">
        ${left}
        <div class="pl-info">
          <div class="pl-title">${escHtml(track.title || 'Unknown')}</div>
          <div class="pl-artist">${subParts.join(' • ')}</div>
        </div>
        <button class="row-icon-btn row-fav-btn ${isFav ? 'on' : ''}" data-action="favorite" data-id="${track.id}" aria-label="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}" title="Favorite"><i class="ti ti-heart${isFav ? '-filled' : ''}"></i></button>
        <span class="pl-dur">${track.duration ? Player.formatTime(track.duration) : '—'}</span>
        <button class="row-icon-btn row-menu-btn" data-action="menu" data-id="${track.id}" aria-label="Song options" title="Song options"><i class="ti ti-dots-vertical"></i></button>
      </article>
    `;
  }).join('');
}

function bindTrackRows(container, queueIds, extra = {}) {
  container.querySelectorAll('.playlist-item').forEach(row => {
    row.addEventListener('click', async (event) => {
      if (event.target.closest('button')) return;
      const id = Number(row.dataset.id);
      await Player.playById(id, queueIds);
      renderPlaylist();
    });
    row.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const id = Number(row.dataset.id);
      await Player.playById(id, queueIds);
      renderPlaylist();
    });
  });

  container.querySelectorAll('[data-action="favorite"]').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      event.stopPropagation();
      const id = Number(btn.dataset.id);
      const next = await dbToggleFavorite(id);
      const track = Player.tracks.find(item => Number(item.id) === id);
      if (track) track.favorite = next;
      await renderPlaylist();
      if (screenAdmin.classList.contains('active')) await renderAdminList();
      if (!searchOverlay.hidden) renderSearchResults();
      showToast(next ? 'Added to Favorites' : 'Removed from Favorites');
    });
  });

  container.querySelectorAll('[data-action="menu"]').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      openTrackMenu(Number(btn.dataset.id), queueIds, extra);
    });
  });
}

function openTrackMenu(trackId, queueIds = [], extra = {}) {
  const track = Player.tracks.find(item => Number(item.id) === Number(trackId));
  if (!track) return;
  trackMenuTrackId = Number(trackId);
  trackMenuQueueIds = Array.isArray(queueIds) ? queueIds.map(Number) : [];
  trackMenuRemoveHandler = typeof extra.onRemove === 'function' ? extra.onRemove : null;
  trackMenuTitle.textContent = track.title || 'Song options';
  const favOn = track.favorite === true;
  trackMenuFav.innerHTML = `<i class="ti ti-heart${favOn ? '-filled' : ''}"></i> ${favOn ? 'Remove from Favorites' : 'Add to Favorites'}`;
  trackMenuRemoveList.hidden = !trackMenuRemoveHandler;
  modalTrackMenu.hidden = false;
}

function closeTrackMenu() {
  modalTrackMenu.hidden = true;
  trackMenuTrackId = null;
  trackMenuQueueIds = [];
  trackMenuRemoveHandler = null;
}

async function refreshAfterTrackAction() {
  await Player.refreshLibrary();
  await renderPlaylist();
  if (screenAdmin.classList.contains('active')) await renderAdminList();
  renderDashboard();
  if (!searchOverlay.hidden) renderSearchResults();
}

async function renderPlaylist() {
  updateTabs();
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
  const label = activeTab === 'top' ? `${tracks.length}/10 songs` : formatSongCount(tracks.length);
  playlistCount.textContent = label;

  if (!tracks.length) {
    playlistEl.style.display = 'none';
    if (activeTab === 'favorites') emptyFavorites.hidden = false;
    else if (activeTab === 'top') emptyTop.hidden = false;
    else playlistEl.innerHTML = '';
    return;
  }

  if (!Player.currentId || queueIds.includes(Player.currentId)) Player.setQueue(queueIds, true, false);
  playlistEl.innerHTML = renderTrackRows(tracks, { showRank: activeTab === 'top', showStats: activeTab === 'top' });
  bindTrackRows(playlistEl, queueIds);
}

async function renderListsPanel() {
  activeListId = null;
  listsPanel.hidden = false;
  listDetail.hidden = true;
  playlistCount.textContent = 'Custom playlists';
  const lists = await dbGetAllPlaylists();

  if (!lists.length) {
    listsGrid.innerHTML = `
      <div class="lists-empty">
        <i class="ti ti-playlist"></i>
        <p>No playlists yet</p>
        <span>Create a playlist and add songs from your library.</span>
      </div>
    `;
    return;
  }

  listsGrid.innerHTML = lists.map(list => `
    <article class="list-card" data-id="${list.id}" role="button" tabindex="0">
      <div class="list-card-icon"><i class="ti ti-playlist"></i></div>
      <div class="list-card-info">
        <div class="list-card-title">${escHtml(list.name)}</div>
        <div class="list-card-sub">${formatSongCount(list.trackIds.length)}</div>
      </div>
      <i class="ti ti-chevron-right list-card-arrow"></i>
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

async function openListDetail(id) {
  activeListId = Number(id);
  await renderListDetailById(activeListId);
}

async function renderListDetailById(id) {
  const playlist = await dbGetPlaylist(id);
  if (!playlist) {
    activeListId = null;
    await renderListsPanel();
    return;
  }

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
  listDetailTracks.innerHTML = renderTrackRows(tracks, { allowRemove: true });
  bindTrackRows(listDetailTracks, queueIds, {
    onRemove: async (trackId) => {
      await dbRemoveTrackFromPlaylist(activeListId, trackId);
      showToast('Removed from playlist');
      await renderListDetailById(activeListId);
    },
  });
}

// ── Search ───────────────────────────────
async function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  const scopeValue = getSearchScopeTracks();
  const baseTracks = Array.isArray(scopeValue) ? scopeValue : await scopeValue;
  const matches = !query ? baseTracks : baseTracks.filter(track =>
    String(track.title || '').toLowerCase().includes(query) ||
    String(track.artist || '').toLowerCase().includes(query)
  );

  if (!matches.length) {
    searchResults.innerHTML = `<div class="search-empty">${query ? 'No results found' : 'No songs in this view'}</div>`;
    return;
  }

  const sorted = activeTab === 'top' ? matches : applySort(matches);
  const queueIds = sorted.map(track => track.id);
  searchResults.innerHTML = renderTrackRows(sorted, { showStats: true });
  bindTrackRows(searchResults, queueIds);
}

// ── Admin library ─────────────────────────
async function renderAdminList() {
  const tracks = applySort(Player.tracks);
  const size = await dbGetTotalSize();
  adminCount.textContent = formatSongCount(tracks.length);
  adminSize.textContent = `${(size / 1024 / 1024).toFixed(1)} MB used`;
  var sizeDash = document.getElementById('admin-size-dash');
  if (sizeDash) sizeDash.textContent = `${(size / 1024 / 1024).toFixed(1)} MB`;
  emptyState.classList.toggle('visible', tracks.length === 0);
  adminList.innerHTML = '';
  if (!tracks.length) return;

  adminList.innerHTML = tracks.map(track => {
    const checked = selectedIds.has(Number(track.id));
    return `
      <article class="admin-item ${selectMode ? 'selectable' : ''} ${checked ? 'selected' : ''}" data-id="${track.id}">
        ${selectMode ? `<div class="select-checkbox ${checked ? 'checked' : ''}"><i class="ti ti-check"></i></div>` : ''}
        <div class="admin-thumb"><i class="ti ti-music"></i></div>
        <div class="admin-info-col">
          <div class="admin-title">${escHtml(track.title || 'Unknown')}</div>
          <div class="admin-artist">${escHtml(track.artist || 'Unknown')} • ${formatPlayCount(track.playCount || 0)}</div>
        </div>
        <button class="admin-btn row-menu-btn admin-menu-btn" data-id="${track.id}" aria-label="Song options" title="Song options" ${selectMode ? 'hidden' : ''}><i class="ti ti-dots-vertical"></i></button>
      </article>
    `;
  }).join('');

  adminList.querySelectorAll('.admin-item').forEach(item => {
    item.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (selectMode) toggleSelected(Number(item.dataset.id));
    });
  });

  adminList.querySelectorAll('.admin-menu-btn').forEach(btn => btn.addEventListener('click', (event) => {
    event.stopPropagation();
    openTrackMenu(Number(btn.dataset.id), Player.queueIds);
  }));
  renderDashboard();
}


async function renderDashboard() {
  if (!dashTotalSongs) return;
  const tracks = Player.tracks || [];
  const favorites = tracks.filter(track => track.favorite === true).length;
  const playlists = await dbGetAllPlaylists();
  dashTotalSongs.textContent = String(tracks.length);
  dashFavorites.textContent = String(favorites);
  dashPlaylists.textContent = String(playlists.length);

  const topSongs = [...tracks]
    .filter(track => Number(track.playCount || 0) > 0)
    .sort((a, b) => (b.playCount - a.playCount) || (b.lastPlayedAt - a.lastPlayedAt) || compareAZ(a, b))
    .slice(0, 5);
  dashTopSongs.innerHTML = topSongs.length ? topSongs.map((track, index) => `
    <button class="dash-mini-item" data-id="${track.id}">
      <span>${index + 1}</span>
      <strong>${escHtml(track.title || 'Unknown')}</strong>
      <em>${formatPlayCount(track.playCount || 0)}</em>
    </button>
  `).join('') : '<div class="dash-empty">No plays counted yet.</div>';

  const artistStats = new Map();
  tracks.forEach(track => {
    const name = track.artist || 'Unknown';
    const plays = Number(track.playCount || 0);
    const current = artistStats.get(name) || 0;
    artistStats.set(name, current + plays);
  });
  const topArtists = [...artistStats.entries()].filter(([, plays]) => plays > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
  dashTopArtists.innerHTML = topArtists.length ? topArtists.map(([artist, plays], index) => `
    <div class="dash-mini-item static">
      <span>${index + 1}</span>
      <strong>${escHtml(artist)}</strong>
      <em>${formatPlayCount(plays)}</em>
    </div>
  `).join('') : '<div class="dash-empty">No artist stats yet.</div>';

  dashTopSongs.querySelectorAll('[data-id]').forEach(btn => btn.addEventListener('click', async () => {
    showMainScreen('player');
    await Player.playById(Number(btn.dataset.id), topSongs.map(track => track.id));
  }));
}

async function openPickSongsModal() {
  if (!activeListId) return;
  modalPickSongs.hidden = false;
  pickSongSearch.value = '';
  await renderPickSongList();
  setTimeout(() => pickSongSearch.focus(), 50);
}

async function renderPickSongList() {
  if (!activeListId) return;
  const playlist = await dbGetPlaylist(activeListId);
  if (!playlist) return;
  const query = pickSongSearch.value.trim().toLowerCase();
  const inList = new Set(playlist.trackIds.map(Number));
  const tracks = applySort(Player.tracks).filter(track => {
    if (inList.has(Number(track.id))) return false;
    if (!query) return true;
    return String(track.title || '').toLowerCase().includes(query) || String(track.artist || '').toLowerCase().includes(query);
  });

  if (!tracks.length) {
    pickSongList.innerHTML = '<div class="search-empty">No songs available to add.</div>';
    return;
  }

  pickSongList.innerHTML = tracks.map(track => `
    <button class="pick-song-item" data-id="${track.id}">
      <span><strong>${escHtml(track.title || 'Unknown')}</strong><em>${escHtml(track.artist || 'Unknown')}</em></span>
      <i class="ti ti-plus"></i>
    </button>
  `).join('');
  pickSongList.querySelectorAll('.pick-song-item').forEach(btn => btn.addEventListener('click', async () => {
    await dbAddTrackToPlaylist(activeListId, Number(btn.dataset.id));
    showToast('Added to playlist');
    await renderPickSongList();
    await renderListDetailById(activeListId);
    renderDashboard();
  }));
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
  const track = Player.tracks.find(item => Number(item.id) === Number(id));
  if (!track) return;
  if (!confirm(`Remove "${track.title}" from this device?`)) return;
  await dbDeleteTrack(id);
  await Player.refreshLibrary();
  await renderPlaylist();
  await renderAdminList();
  showToast('Song removed');
}

function openRenameModal(id) {
  const track = Player.tracks.find(item => Number(item.id) === Number(id));
  if (!track) return;
  renamingId = id;
  renameTitle.value = track.title || '';
  renameArtist.value = track.artist || '';
  modalRename.hidden = false;
  setTimeout(() => renameTitle.focus(), 50);
}

async function saveRename() {
  if (!renamingId) return;
  const updated = await dbUpdateTrack(renamingId, {
    title: renameTitle.value.trim() || 'Unknown',
    artist: renameArtist.value.trim() || 'Unknown',
  });
  const track = Player.tracks.find(item => Number(item.id) === Number(renamingId));
  if (track && updated) Object.assign(track, updated);
  modalRename.hidden = true;
  renamingId = null;
  await renderPlaylist();
  await renderAdminList();
  showToast('Track updated');
}

async function getAudioDuration(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
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

async function addAudioFiles(files) {
  const fileList = Array.from(files || []);
  if (!fileList.length) return;

  const supported = /\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm)$/i;
  let added = 0;
  let skipped = 0;
  const duplicates = [];

  showToast('Adding songs...', 1200);

  for (const file of fileList) {
    const ok = file.type.startsWith('audio/') || file.type === 'video/mp4' || supported.test(file.name);
    if (!ok) { skipped++; continue; }

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    let title = baseName.trim() || 'Unknown';
    let artist = 'Unknown';
    const dash = baseName.indexOf(' - ');
    if (dash !== -1) {
      artist = baseName.slice(0, dash).trim() || 'Unknown';
      title = baseName.slice(dash + 3).trim() || 'Unknown';
    }

    const duplicate = await dbCheckDuplicate(title, artist);
    if (duplicate) { duplicates.push(title); continue; }

    const duration = await getAudioDuration(file);
    await dbSaveTrack({ title, artist, blob: file, duration, size: file.size, favorite: false });
    added++;
  }

  fileInput.value = '';
  await Player.refreshLibrary();
  await renderPlaylist();
  await renderAdminList();
  await renderDashboard();

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
    a.download = `aurora-player-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
    await renderDashboard();
    showToast(`Imported ${result.imported}; skipped ${result.skipped}`);
  } catch (error) {
    console.error(error);
    showToast('Invalid backup file');
  }
}

// ── Playlists modals ──────────────────────
async function openAddToListModal(trackId) {
  addToListTrackId = Number(trackId);
  if (!addToListTrackId) return;
  const lists = await dbGetAllPlaylists();
  if (!lists.length) {
    showToast('Create a playlist first');
    activeTab = 'lists';
    localStorage.setItem(LS_TAB, activeTab);
    await renderPlaylist();
    modalNewList.hidden = false;
    setTimeout(() => newListName.focus(), 50);
    return;
  }

  addToListOpts.innerHTML = lists.map(list => `
    <button class="add-to-list-opt" data-playlist-id="${list.id}">
      <i class="ti ti-playlist"></i>
      <span>${escHtml(list.name)}</span>
      <small>${formatSongCount(list.trackIds.length)}</small>
    </button>
  `).join('');

  addToListOpts.querySelectorAll('.add-to-list-opt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const playlistId = Number(btn.dataset.playlistId);
      await dbAddTrackToPlaylist(playlistId, addToListTrackId);
      modalAddToList.hidden = true;
      showToast('Added to playlist');
      if (activeTab === 'lists') await renderPlaylist();
    });
  });

  modalAddToList.hidden = false;
}

async function createPlaylist() {
  const name = newListName.value.trim();
  if (!name) { showToast('Enter a playlist name'); return; }
  const id = await dbCreatePlaylist(name);
  modalNewList.hidden = true;
  newListName.value = '';
  activeTab = 'lists';
  activeListId = id;
  localStorage.setItem(LS_TAB, activeTab);
  await renderPlaylist();
  showToast('Playlist created');
}

// ── Lyrics / Karaoke ──────────────────────
function showLyricsScreen() {
  lyricsVisible = true;
  screenLyrics.classList.add('active');
  btnLyrics.classList.add('lyrics-on');
  const track = Player.currentTrack();
  if (track) loadLyricsForTrack(track, true);
  else showLyricsState('no-track');
}

function hideLyricsScreen() {
  lyricsVisible = false;
  screenLyrics.classList.remove('active');
  btnLyrics.classList.remove('lyrics-on');
}

function showLyricsState(state) {
  lyricsLoading.hidden = state !== 'loading';
  lyricsNotFound.hidden = state !== 'not-found';
  lyricsNoTrack.hidden = state !== 'no-track';
  lyricsLines.hidden = state !== 'lines';
}

function resetInlineLyrics() {
  const prev = $('inline-prev-line');
  const active = $('inline-active-line');
  const next = $('inline-next-line');
  if (prev) prev.textContent = '';
  if (active) active.textContent = '';
  if (next) next.textContent = '';
  if (inlineLyricsFlow) inlineLyricsFlow.innerHTML = '';
  if (fullscreenLyricsFlow) fullscreenLyricsFlow.innerHTML = '';
  if (fullscreenEmpty) fullscreenEmpty.hidden = false;
  $('inline-no-lyrics').classList.remove('hidden');
}

function wordSpans(line, activeWordIdx = -1, markActive = false) {
  if (!line || !line.words || !line.words.length) return escHtml(line?.text || '');
  return line.words.map((word, index) => {
    const cls = [
      'lyric-word',
      `word-color-${index % 6}`,
      markActive && index < activeWordIdx ? 'past-word' : '',
      markActive && index === activeWordIdx ? 'current-word' : '',
      markActive && index > activeWordIdx ? 'future-word' : '',
    ].filter(Boolean).join(' ');
    return `<span class="${cls}" data-word-index="${index}">${escHtml(word.text)}</span>`;
  }).join(' ');
}

function renderLyricsCollection(container, lines, className = 'flow-line') {
  if (!container) return;
  if (!lines || !lines.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = lines.map((line, index) => `
    <div class="${className}" data-idx="${index}" data-time="${line.time}" style="cursor:pointer;">
      ${wordSpans(line)}
    </div>
  `).join('');

  // Tap en línea:
  // - Tap simple → seek a esa línea
  // - Doble tap → entrar en fullscreen (igual que antes)
  var tapTimer = null;
  container.querySelectorAll('[data-time]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var t = parseFloat(el.dataset.time);
      if (tapTimer) {
        // Doble tap — cancelar seek pendiente y abrir fullscreen
        clearTimeout(tapTimer);
        tapTimer = null;
        if (typeof enterCleanFullscreen === 'function') enterCleanFullscreen();
      } else {
        // Esperar 250ms para ver si viene un segundo tap
        tapTimer = setTimeout(function() {
          tapTimer = null;
          if (Number.isFinite(t) && typeof Player !== 'undefined') {
            Player.seek(t);
            if (!Player.isPlaying) Player.play();
          }
        }, 250);
      }
    });
  });
}

function renderInlineLyricsList() {
  $('inline-no-lyrics').classList.add('hidden');
  renderLyricsCollection(inlineLyricsFlow, Lyrics.lines, 'flow-line');
  renderLyricsCollection(fullscreenLyricsFlow, Lyrics.lines, 'flow-line');
  if (fullscreenEmpty) fullscreenEmpty.hidden = Lyrics.lines.length > 0;
}

function scrollLineIntoContainer(container, lineEl, ratio = 0.66) {
  if (!container || !lineEl) return;
  const top = lineEl.offsetTop - (container.clientHeight * ratio) + (lineEl.clientHeight / 2);
  container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function updateLyricsContainer(container, idx, wordIdx, options = {}) {
  if (!container) return;
  const lineEls = container.querySelectorAll('[data-idx]');
  if (!lineEls.length) return;
  lineEls.forEach((lineEl, lineIndex) => {
    lineEl.classList.toggle('active', lineIndex === idx);
    lineEl.classList.toggle('past', lineIndex < idx);
    lineEl.classList.toggle('future', lineIndex > idx);
    lineEl.querySelectorAll('.lyric-word').forEach((wordEl, wordIndex) => {
      const past = lineIndex < idx || (lineIndex === idx && wordIndex < wordIdx);
      const current = lineIndex === idx && wordIndex === wordIdx;
      wordEl.classList.toggle('past-word', past);
      wordEl.classList.toggle('current-word', current);
      wordEl.classList.toggle('future-word', lineIndex > idx || (lineIndex === idx && wordIndex > wordIdx));
    });
  });
  if (idx >= 0 && lineEls[idx] && options.scroll !== false) {
    scrollLineIntoContainer(container, lineEls[idx], options.ratio || 0.66);
  }
}

function renderInlineLyrics(idx, wordIdx, lines) {
  if (idx < 0 || !lines[idx]) return;
  $('inline-no-lyrics').classList.add('hidden');
  if (inlineLyricsFlow && !inlineLyricsFlow.children.length) renderInlineLyricsList();
  updateLyricsContainer(inlineLyricsFlow, idx, wordIdx, { ratio: 0.54 });
  updateLyricsContainer(fullscreenLyricsFlow, idx, wordIdx, { ratio: 0.50 });
}

function renderLyricsLines() {
  showLyricsState('lines');
  lastLyricScrollIdx = -1;
  lyricsLines.innerHTML = Lyrics.lines.map((line, index) => `
    <div class="lyric-line" data-idx="${index}" role="button" tabindex="0">
      ${wordSpans(line)}
    </div>
  `).join('');

  lyricsLines.querySelectorAll('.lyric-line').forEach((lineEl, index) => {
    const seekLine = (event) => {
      event.stopPropagation();
      if (Player.duration) Player.seek(Lyrics.lines[index].time / Player.duration);
    };
    lineEl.addEventListener('click', seekLine);
    lineEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') seekLine(event);
    });
  });

  renderInlineLyricsList();
  const state = Lyrics.sync(Player.currentTime);
  updateLyricsHighlight(state.idx, state.wordIdx, state.lines, Player.currentTime);
}

function updateLyricsHighlight(idx, wordIdx, lines) {
  if (!lines || idx < 0 || !lines[idx]) return;
  renderInlineLyrics(idx, wordIdx, lines);

  const lineEls = lyricsLines.querySelectorAll('.lyric-line');
  if (lineEls.length) {
    lineEls.forEach((lineEl, lineIndex) => {
      lineEl.classList.toggle('active', lineIndex === idx);
      lineEl.classList.toggle('past', lineIndex < idx);
      lineEl.classList.toggle('future', lineIndex > idx);

      lineEl.querySelectorAll('.lyric-word').forEach((wordEl, wordIndex) => {
        const past = lineIndex < idx || (lineIndex === idx && wordIndex < wordIdx);
        const current = lineIndex === idx && wordIndex === wordIdx;
        wordEl.classList.toggle('past-word', past);
        wordEl.classList.toggle('current-word', current);
        wordEl.classList.toggle('future-word', lineIndex > idx || (lineIndex === idx && wordIndex > wordIdx));
      });
    });

    if (lyricsVisible && idx !== lastLyricScrollIdx && lineEls[idx]) {
      lastLyricScrollIdx = idx;
      lineEls[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

async function loadLyricsForTrack(track, foreground = false) {
  const token = ++lyricsRequestToken;
  lyricsTrackTitle.textContent = track?.title || 'Unknown';
  lyricsTrackArtist.textContent = track?.artist || 'Unknown';
  if (foreground) showLyricsState('loading');

  const result = await Lyrics.load(track.id, track.title, track.artist);
  if (token !== lyricsRequestToken || Player.currentId !== track.id) return;

  if (result === 'found' || result === 'cached') {
    $('inline-no-lyrics').classList.add('hidden');
    renderInlineLyricsList();
    if (foreground || lyricsVisible) renderLyricsLines();
    lyricsDeleteBtn.hidden = false;
    const state = Lyrics.sync(Player.currentTime);
    updateLyricsHighlight(state.idx, state.wordIdx, state.lines, Player.currentTime);
  } else {
    resetInlineLyrics();
    lyricsDeleteBtn.hidden = true;
    if (foreground || lyricsVisible) showLyricsState('not-found');
  }
}

function handleLrcUpload() {
  lrcFileInput.click();
}



// ── Clean fullscreen lyrics ───────────────
async function enterCleanFullscreen() {
  if (!Player.currentTrack()) { showToast('Play a song first'); return; }
  if (Lyrics.enabled && !fullscreenLyricsFlow.children.length) renderInlineLyricsList();
  cleanFullscreen.hidden = false;
  requestAnimationFrame(() => cleanFullscreen.classList.add('active'));
  hideFullscreenControls(true);
  if (fullscreenEmpty) fullscreenEmpty.hidden = Lyrics.enabled && Lyrics.lines.length > 0;
  try {
    if (cleanFullscreen.requestFullscreen && document.fullscreenElement !== cleanFullscreen) {
      await cleanFullscreen.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch (_) {}
  const state = Lyrics.sync(Player.currentTime);
  updateLyricsHighlight(state.idx, state.wordIdx, state.lines, Player.currentTime);
}

async function exitCleanFullscreen() {
  if (!cleanFullscreen || cleanFullscreen.hidden) return;
  cleanFullscreen.classList.remove('active', 'controls-visible');
  fullscreenControls.classList.remove('show');
  fullscreenControls.hidden = true;
  clearTimeout(fullscreenControlsTimer);
  try {
    if (document.fullscreenElement === cleanFullscreen) await document.exitFullscreen();
  } catch (_) {}
  setTimeout(() => { cleanFullscreen.hidden = true; }, 220);
}

function showFullscreenControls(autoHide = true) {
  fullscreenControls.hidden = false;
  cleanFullscreen.classList.add('controls-visible');
  fullscreenControls.classList.add('show');
  clearTimeout(fullscreenControlsTimer);
  if (autoHide) fullscreenControlsTimer = setTimeout(() => hideFullscreenControls(), 4200);
}

function hideFullscreenControls(force = false) {
  clearTimeout(fullscreenControlsTimer);
  cleanFullscreen.classList.remove('controls-visible');
  fullscreenControls.classList.remove('show');
  if (force) fullscreenControls.hidden = true;
  else setTimeout(() => { if (!cleanFullscreen.classList.contains('controls-visible')) fullscreenControls.hidden = true; }, 220);
}

function toggleFullscreenControls() {
  if (cleanFullscreen.classList.contains('controls-visible')) hideFullscreenControls();
  else showFullscreenControls();
}

async function toggleLyricsFullscreen() {
  if (cleanFullscreen && cleanFullscreen.hidden === false) return exitCleanFullscreen();
  return enterCleanFullscreen();
}

function updateFullscreenIcon() {
  const full = cleanFullscreen && cleanFullscreen.hidden === false;
  document.body.classList.toggle('lyrics-fullscreen', full);
  if (lyricsFullscreenBtn) lyricsFullscreenBtn.querySelector('i').className = full ? 'ti ti-minimize' : 'ti ti-maximize';
}

// ── Search / online add ───────────────────
function openSearchOverlay(mode = 'local') {
  searchOverlay.hidden = false;
  if (mode === 'local') {
    searchInput.value = '';
    renderSearchResults();
    setTimeout(() => searchInput.focus(), 80);
  } else {
    setTimeout(() => {
      const target = mode === 'youtube' ? youtubeQueryInput : onlineSearchInput;
      target?.focus();
      $('youtube-helper-card')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 80);
  }
}

function closeSearchOverlay() {
  searchOverlay.hidden = true;
  searchInput.value = '';
}

function onlineEmpty(message) {
  onlineResults.innerHTML = `<div class="search-empty">${escHtml(message)}</div>`;
}

async function searchOnlineTracks() {
  const query = onlineSearchInput.value.trim();
  if (!query) { onlineEmpty('Type a song or artist name.'); return; }
  onlineEmpty('Searching previews...');
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    const results = (data.results || []).filter(item => item.previewUrl);
    if (!results.length) { onlineEmpty('No downloadable previews found. Try another search or add a local file.'); return; }
    onlineResults.innerHTML = results.map((item, index) => `
      <article class="online-result-item" data-index="${index}">
        <img class="online-artwork" src="${escHtml((item.artworkUrl100 || '').replace('100x100', '200x200'))}" alt="" loading="lazy" />
        <div class="online-info">
          <div class="online-title">${escHtml(item.trackName || 'Unknown')}</div>
          <div class="online-artist">${escHtml(item.artistName || 'Unknown')} • preview</div>
        </div>
        <button class="mini-btn online-add-btn" data-index="${index}"><i class="ti ti-download"></i> Add</button>
      </article>
    `).join('');
    onlineResults.querySelectorAll('.online-add-btn').forEach(btn => {
      btn.addEventListener('click', () => addOnlinePreview(results[Number(btn.dataset.index)]));
    });
  } catch (error) {
    console.error(error);
    onlineEmpty('Online search is not available right now. Add a local file or a direct audio URL.');
  }
}

async function addBlobAsTrack(blob, title, artist) {
  if (!blob || !blob.size) throw new Error('Empty audio file');
  const safeTitle = title || 'Online audio';
  const safeArtist = artist || 'Unknown';
  const duplicate = await dbCheckDuplicate(safeTitle, safeArtist);
  if (duplicate) { showToast('This song is already in your library'); return null; }
  const ext = blob.type.includes('mpeg') ? 'mp3' : blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'audio';
  const file = new File([blob], `${safeArtist} - ${safeTitle}.${ext}`, { type: blob.type || 'audio/mpeg' });
  const duration = await getAudioDuration(file);
  const id = await dbSaveTrack({ title: safeTitle, artist: safeArtist, blob: file, duration, size: file.size, favorite: false });
  await Player.refreshLibrary();
  await renderPlaylist();
  await renderAdminList();
  return id;
}

async function addOnlinePreview(item) {
  if (!item?.previewUrl) return;
  try {
    showToast('Downloading preview...', 1200);
    const response = await fetch(item.previewUrl);
    if (!response.ok) throw new Error('Preview download failed');
    const blob = await response.blob();
    await addBlobAsTrack(blob, item.trackName || 'Online preview', item.artistName || 'Unknown');
    showToast('Preview added to library');
  } catch (error) {
    console.error(error);
    showToast('This source blocked the download. Try local import or direct URL.');
  }
}

async function addFromDirectUrl() {
  const url = directUrlInput.value.trim();
  if (!url) { showToast('Paste a direct audio URL'); return; }
  try {
    showToast('Downloading audio...', 1400);
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    if (!blob.type.startsWith('audio/') && !/\.(mp3|m4a|aac|ogg|opus|wav|flac|webm)(\?|$)/i.test(url)) {
      throw new Error('Not an audio file');
    }
    const guessed = decodeURIComponent(url.split('/').pop().split('?')[0] || '').replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
    const title = directTitleInput.value.trim() || guessed || 'Direct audio';
    const artist = directArtistInput.value.trim() || 'Unknown';
    await addBlobAsTrack(blob, title, artist);
    directUrlInput.value = '';
    directTitleInput.value = '';
    directArtistInput.value = '';
    showToast('Audio added to library');
  } catch (error) {
    console.error(error);
    showToast('Could not download this URL. The server may block browser downloads.');
  }
}

function openYoutubeSearch() {
  const query = (youtubeQueryInput?.value || onlineSearchInput.value || searchInput.value || '').trim();
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query || 'music')}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('Choose a video, copy its link, then paste it here.');
}

function getYoutubeId(url) {
  try {
    const parsed = new URL(String(url || '').trim());
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1).split('/')[0] || null;
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
      const shorts = parsed.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shorts) return shorts[1];
      const embed = parsed.pathname.match(/\/embed\/([^/?#]+)/);
      if (embed) return embed[1];
    }
  } catch (_) {}
  return null;
}

function updateYoutubePreview() {
  if (!youtubePreview || !youtubeLinkInput) return;
  const id = getYoutubeId(youtubeLinkInput.value);
  if (!id) {
    youtubePreview.hidden = true;
    youtubePreview.innerHTML = '';
    return;
  }
  youtubePreview.hidden = false;
  youtubePreview.innerHTML = `<iframe title="YouTube preview" src="https://www.youtube.com/embed/${encodeURIComponent(id)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

async function copyYoutubeLink() {
  const link = youtubeLinkInput?.value.trim();
  if (!link) { showToast('Paste a YouTube link first'); return; }
  try {
    await navigator.clipboard.writeText(link);
    showToast('YouTube link copied');
  } catch (_) {
    youtubeLinkInput.select();
    showToast('Copy the selected link manually');
  }
}

async function openY2MateHelper() {
  const link = youtubeLinkInput?.value.trim();
  if (link) await copyYoutubeLink();
  window.open('https://v5.y2mate.nu/es/', '_blank', 'noopener,noreferrer');
  showToast('Link copied. Paste it on the MP3 page, then import the file.');
}

function addDownloadedFromPhone() {
  showToast('Choose the downloaded MP3 from your phone.');
  fileInput.click();
}

// ── Event bindings ────────────────────────
btnOpenAdmin.addEventListener('click', openAdminScreen);
btnBack.addEventListener('click', () => showMainScreen('player'));

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
  if (mode !== 'none') showToast(mode === 'all' ? 'Repeat all' : 'Repeat one');
  else showToast('Repeat off');
});

function seekFromPointer(event, element) {
  const rect = element.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const ratio = Math.min(Math.max((point.clientX - rect.left) / rect.width, 0), 1);
  Player.seek(ratio);
}
progressWrap.addEventListener('click', (event) => seekFromPointer(event, progressWrap));
progressWrap.addEventListener('touchstart', (event) => seekFromPointer(event, progressWrap), { passive: true });
lyricsProgressWrap.addEventListener('click', (event) => seekFromPointer(event, lyricsProgressWrap));

if (btnSearch) btnSearch.addEventListener('click', () => openSearchOverlay('local'));
if (btnListSearch) btnListSearch.addEventListener('click', () => openSearchOverlay('local'));
if (btnOnlineSearch) btnOnlineSearch.addEventListener('click', () => openSearchOverlay('youtube'));
searchBack.addEventListener('click', closeSearchOverlay);
searchInput.addEventListener('input', () => renderSearchResults());
if (btnSearchAddLocal) btnSearchAddLocal.addEventListener('click', () => fileInput.click());
if (onlineSearchBtn) onlineSearchBtn.addEventListener('click', searchOnlineTracks);
if (onlineSearchInput) onlineSearchInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') searchOnlineTracks(); });
if (youtubeSearchBtn) youtubeSearchBtn.addEventListener('click', openYoutubeSearch);
if (youtubeQueryInput) youtubeQueryInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') openYoutubeSearch(); });
if (youtubeLinkInput) youtubeLinkInput.addEventListener('input', updateYoutubePreview);
if (youtubeCopyLink) youtubeCopyLink.addEventListener('click', copyYoutubeLink);
if (youtubeOpenY2Mate) youtubeOpenY2Mate.addEventListener('click', openY2MateHelper);
if (youtubeAddDownloaded) youtubeAddDownloaded.addEventListener('click', addDownloadedFromPhone);
if (directAddBtn) directAddBtn.addEventListener('click', addFromDirectUrl);

btnTheme.addEventListener('click', () => { modalTheme.hidden = false; renderThemeOptions(); });
if (btnAdminTheme) btnAdminTheme.addEventListener('click', () => { modalTheme.hidden = false; renderThemeOptions(); });
themeClose.addEventListener('click', () => { modalTheme.hidden = true; });
modalTheme.addEventListener('click', (event) => { if (event.target === modalTheme) modalTheme.hidden = true; });
if (btnNightMode) btnNightMode.addEventListener('click', () => { const on = applyNightMode(); showToast(on ? 'Night mode on' : 'Night mode off'); });
if (btnAdminNight) btnAdminNight.addEventListener('click', () => { const on = applyNightMode(); showToast(on ? 'Night mode on' : 'Night mode off'); });

tabAll.addEventListener('click', () => setActiveTab('all'));
tabFav.addEventListener('click', () => setActiveTab('favorites'));
if (tabLists) tabLists.addEventListener('click', () => setActiveTab('lists'));
tabTop.addEventListener('click', () => setActiveTab('top'));
sortSelect.addEventListener('change', () => {
  sortMode = sortSelect.value;
  localStorage.setItem(LS_SORT, sortMode);
  renderPlaylist();
  if (screenAdmin.classList.contains('active')) renderAdminList();
  renderDashboard();
});

btnAddSong.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => addAudioFiles(fileInput.files));
btnExport.addEventListener('click', exportLibrary);
btnImport.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', () => importLibrary(importFileInput.files[0]));

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

modalCancel.addEventListener('click', () => { modalRename.hidden = true; renamingId = null; });
modalSave.addEventListener('click', saveRename);
modalRename.addEventListener('click', (event) => { if (event.target === modalRename) { modalRename.hidden = true; renamingId = null; } });
renameTitle.addEventListener('keydown', (event) => { if (event.key === 'Enter') saveRename(); });
renameArtist.addEventListener('keydown', (event) => { if (event.key === 'Enter') saveRename(); });

btnNewList.addEventListener('click', () => {
  newListName.value = '';
  modalNewList.hidden = false;
  setTimeout(() => newListName.focus(), 50);
});
newListCancel.addEventListener('click', () => { modalNewList.hidden = true; });
newListSave.addEventListener('click', createPlaylist);
newListName.addEventListener('keydown', (event) => { if (event.key === 'Enter') createPlaylist(); });
modalNewList.addEventListener('click', (event) => { if (event.target === modalNewList) modalNewList.hidden = true; });
addToListCancel.addEventListener('click', () => { modalAddToList.hidden = true; });
modalAddToList.addEventListener('click', (event) => { if (event.target === modalAddToList) modalAddToList.hidden = true; });
trackMenuCancel.addEventListener('click', closeTrackMenu);
modalTrackMenu.addEventListener('click', (event) => { if (event.target === modalTrackMenu) closeTrackMenu(); });
trackMenuPlay.addEventListener('click', async () => {
  const id = trackMenuTrackId;
  const queue = trackMenuQueueIds.length ? trackMenuQueueIds : Player.queueIds;
  closeTrackMenu();
  if (id) await Player.playById(id, queue);
});
trackMenuFav.addEventListener('click', async () => {
  const id = trackMenuTrackId;
  if (!id) return;
  const next = await dbToggleFavorite(id);
  const track = Player.tracks.find(item => Number(item.id) === id);
  if (track) track.favorite = next;
  closeTrackMenu();
  await renderPlaylist();
  if (screenAdmin.classList.contains('active')) await renderAdminList();
  renderDashboard();
  if (!searchOverlay.hidden) renderSearchResults();
  showToast(next ? 'Added to Favorites' : 'Removed from Favorites');
});
trackMenuAddList.addEventListener('click', () => {
  const id = trackMenuTrackId;
  closeTrackMenu();
  if (id) openAddToListModal(id);
});
trackMenuEdit.addEventListener('click', () => {
  const id = trackMenuTrackId;
  closeTrackMenu();
  if (id) openRenameModal(id);
});
trackMenuRemoveList.addEventListener('click', async () => {
  const id = trackMenuTrackId;
  const handler = trackMenuRemoveHandler;
  closeTrackMenu();
  if (id && handler) await handler(id);
});
trackMenuDelete.addEventListener('click', async () => {
  const id = trackMenuTrackId;
  closeTrackMenu();
  if (id) await deleteSong(id);
});

listBack.addEventListener('click', () => { activeListId = null; renderListsPanel(); });
if (listAddSongsBtn) listAddSongsBtn.addEventListener('click', openPickSongsModal);
if (pickSongClose) pickSongClose.addEventListener('click', () => { modalPickSongs.hidden = true; });
if (pickSongSearch) pickSongSearch.addEventListener('input', () => renderPickSongList());
if (modalPickSongs) modalPickSongs.addEventListener('click', (event) => { if (event.target === modalPickSongs) modalPickSongs.hidden = true; });
if (dashShowTop) dashShowTop.addEventListener('click', () => {
  setActiveTab('top');
  showMainScreen('player');
});
const dashShowSongs = document.getElementById('dash-show-songs');
const dashShowFavorites = document.getElementById('dash-show-favorites');
if (dashShowSongs) dashShowSongs.addEventListener('click', () => {
  setActiveTab('all');
  showMainScreen('player');
});
if (dashShowFavorites) dashShowFavorites.addEventListener('click', () => {
  setActiveTab('favorites');
  showMainScreen('player');
});
listDeleteBtn.addEventListener('click', async () => {
  if (!activeListId) return;
  if (!confirm('Delete this playlist? Songs will stay in your library.')) return;
  await dbDeletePlaylist(activeListId);
  activeListId = null;
  await renderListsPanel();
  showToast('Playlist deleted');
});

btnLyrics.addEventListener('click', () => lyricsVisible ? hideLyricsScreen() : showLyricsScreen());
lyricsClose.addEventListener('click', hideLyricsScreen);
$('lyrics-prev').addEventListener('click', () => Player.prev());
$('lyrics-next').addEventListener('click', () => Player.next(true));
$('lyrics-play').addEventListener('click', () => Player.togglePlay());
$('inline-lyrics').addEventListener('click', () => {
  const now = Date.now();
  if (now - lastMainLyricsTap < 330) enterCleanFullscreen();
  lastMainLyricsTap = now;
});
lyricsUploadBtn.addEventListener('click', handleLrcUpload);
lyricsUploadBtn2.addEventListener('click', handleLrcUpload);
lyricsDeleteBtn.addEventListener('click', async () => {
  const track = Player.currentTrack();
  if (!track) return;
  if (!confirm('Delete lyrics for this song?')) return;
  await Lyrics.remove(track.id);
  resetInlineLyrics();
  showLyricsState('not-found');
  lyricsDeleteBtn.hidden = true;
  showToast('Lyrics deleted');
});
lyricsFullscreenBtn.addEventListener('click', toggleLyricsFullscreen);
document.addEventListener('fullscreenchange', updateFullscreenIcon);
if (fullscreenBack) fullscreenBack.addEventListener('click', (event) => { event.stopPropagation(); exitCleanFullscreen(); });
if (fullscreenPrev) fullscreenPrev.addEventListener('click', (event) => { event.stopPropagation(); Player.prev(); showFullscreenControls(); });
if (fullscreenNext) fullscreenNext.addEventListener('click', (event) => { event.stopPropagation(); Player.next(true); showFullscreenControls(); });
if (fullscreenPlay) fullscreenPlay.addEventListener('click', (event) => { event.stopPropagation(); Player.togglePlay(); showFullscreenControls(); });
if (fullscreenProgressWrap) fullscreenProgressWrap.addEventListener('click', (event) => { event.stopPropagation(); seekFromPointer(event, fullscreenProgressWrap); showFullscreenControls(); });
if (cleanFullscreen) cleanFullscreen.addEventListener('click', (event) => {
  // No activar toggle si el tap fue en una línea de letra o en botón
  if (event.target.closest('button') || event.target.closest('.fullscreen-progress-wrap') || event.target.closest('.flow-line')) return;
  toggleFullscreenControls();
});
lyricsContent.addEventListener('click', () => {
  const now = Date.now();
  if (now - lastLyricsTap < 320) toggleLyricsFullscreen();
  lastLyricsTap = now;
}, true);
lrcFileInput.addEventListener('change', async () => {
  const file = lrcFileInput.files[0];
  const track = Player.currentTrack();
  if (!file || !track) return;
  const text = await file.text();
  const ok = await Lyrics.saveManual(track.id, text);
  lrcFileInput.value = '';
  if (!ok) { showToast('Could not parse this .lrc file'); return; }
  renderInlineLyricsList();
  renderLyricsLines();
  lyricsDeleteBtn.hidden = false;
  showToast('Lyrics loaded');
});

$('btn-sleep').addEventListener('click', () => {
  if (SleepTimer.active) SleepTimer.cancel(true);
  else modalSleep.hidden = false;
});
modalSleepCancel.addEventListener('click', () => { modalSleep.hidden = true; });
modalSleep.addEventListener('click', (event) => { if (event.target === modalSleep) modalSleep.hidden = true; });
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

// ── Player callbacks ──────────────────────
Player.onProgress = (ratio, current, total) => {
  const pct = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
  progressFill.style.width = pct;
  progressThumb.style.left = pct;
  progressWrap.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  timeCurrent.textContent = Player.formatTime(current);
  timeTotal.textContent = Player.formatTime(total);
  lyricsPFill.style.width = pct;
  lyricsCurrent.textContent = Player.formatTime(current);
  lyricsTotal.textContent = Player.formatTime(total);
  if (fullscreenProgressFill) fullscreenProgressFill.style.width = pct;
  if (fullscreenCurrent) fullscreenCurrent.textContent = Player.formatTime(current);
  if (fullscreenTotal) fullscreenTotal.textContent = Player.formatTime(total);
  Lyrics.sync(current);
};

Player.onPlayState = (playing) => {
  playIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
  lyricsPlayIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
  if (fullscreenPlayIcon) fullscreenPlayIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
};

Player.onQueueChange = () => {
  updateTransportButtons();
  renderPlaylist();
};

Player.onStatsChange = () => {
  if (activeTab === 'top') renderPlaylist();
  if (screenAdmin.classList.contains('active')) renderAdminList();
  renderDashboard();
};

Player.onTrackChange = (track) => {
  trackTitle.textContent = track ? (track.title || 'Unknown') : 'No track loaded';
  trackArtist.textContent = track ? (track.artist || 'Unknown') : 'Add songs to get started';
  lyricsTrackTitle.textContent = track ? (track.title || 'Unknown') : '—';
  lyricsTrackArtist.textContent = track ? (track.artist || 'Unknown') : '—';
  resetInlineLyrics();
  Lyrics.clear();
  lyricsDeleteBtn.hidden = true;
  if (track) loadLyricsForTrack(track, lyricsVisible);
  else if (lyricsVisible) showLyricsState('no-track');
  renderPlaylist();
  updateFavNowBtn(track);
};

function updateFavNowBtn(track) {
  const icon = document.getElementById('fav-now-icon');
  const btn  = document.getElementById('btn-fav-now');
  if (!icon || !btn) return;
  const isFav = track?.favorite === true;
  icon.className = isFav ? 'ti ti-heart-filled' : 'ti ti-heart';
  btn.style.color = isFav ? 'var(--fav, #fb6fb8)' : '';
}

const btnFavNow = document.getElementById('btn-fav-now');
if (btnFavNow) {
  btnFavNow.addEventListener('click', async () => {
    const track = Player.currentTrack();
    if (!track) return;
    const next = await dbToggleFavorite(track.id);
    // Actualizar en memoria
    const t = Player.tracks.find(t => t.id === track.id);
    if (t) t.favorite = next;
    updateFavNowBtn({ ...track, favorite: next });
    renderPlaylist();
    showToast(next ? '♥ Added to Favorites' : 'Removed from Favorites');
  });
}

Lyrics.onSync = updateLyricsHighlight;

// ── Init ──────────────────────────────────
// Botones inline en barra de tabs
(function() {
  var themeInline = document.getElementById('btn-theme-inline');
  var sleepInline = document.getElementById('btn-sleep-inline');
  var adminInline = document.getElementById('btn-admin-inline');
  if (themeInline) themeInline.addEventListener('click', function() {
    if (typeof modalTheme !== 'undefined' && modalTheme) modalTheme.hidden = false;
  });
  if (sleepInline) sleepInline.addEventListener('click', function() {
    if (typeof SleepTimer !== 'undefined' && SleepTimer.active) SleepTimer.cancel();
    else if (typeof modalSleep !== 'undefined' && modalSleep) modalSleep.hidden = false;
  });
  if (adminInline) adminInline.addEventListener('click', function() {
    if (typeof showMainScreen === 'function') showMainScreen('admin');
  });

  // Botones del panel deslizable (swipe) en track-info
  var sleepSwipe = document.getElementById('btn-sleep-swipe');
  var themeSwipe = document.getElementById('btn-theme-swipe');
  var adminSwipe = document.getElementById('btn-admin-swipe');
  if (sleepSwipe) sleepSwipe.addEventListener('click', function() {
    if (typeof SleepTimer !== 'undefined' && SleepTimer.active) SleepTimer.cancel();
    else if (typeof modalSleep !== 'undefined' && modalSleep) modalSleep.hidden = false;
  });
  if (themeSwipe) themeSwipe.addEventListener('click', function() {
    if (typeof modalTheme !== 'undefined' && modalTheme) modalTheme.hidden = false;
  });
  if (adminSwipe) adminSwipe.addEventListener('click', function() {
    if (typeof showMainScreen === 'function') showMainScreen('admin');
  });

  // Swipe horizontal en track-info para revelar el panel oculto
  var trackSwipe = document.getElementById('track-info-swipe');
  if (trackSwipe) {
    var swipeStartX = 0, swipeStartY = 0, swiping = false;
    trackSwipe.addEventListener('pointerdown', function(e) {
      swipeStartX = e.clientX;
      swipeStartY = e.clientY;
      swiping = true;
    });
    trackSwipe.addEventListener('pointerup', function(e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.clientX - swipeStartX;
      var dy = e.clientY - swipeStartY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) trackSwipe.classList.add('panel-open');
      else trackSwipe.classList.remove('panel-open');
    });
    trackSwipe.addEventListener('pointercancel', function() { swiping = false; });
  }

  // Resize con "snap" a 3 tamaños (como Spotify): arrastras desde casi
  // cualquier parte (letra o lista) y al soltar se ajusta solo a
  // pequeño / mediano / grande. Un tap normal sigue funcionando igual
  // (botones, líneas de letra, doble-tap a fullscreen, etc).
  var resizeHandle = document.getElementById('resize-handle');
  var learningCard = document.querySelector('.learning-card');
  var playlistSectionEl = document.querySelector('.main-list-topline');
  var screenPlayerEl = document.getElementById('screen-player');

  var SNAP_RATIOS = [0.30, 0.55, 0.85]; // pequeño / mediano / grande (proporción de la pantalla para la letra)
  var snapIndex = 1; // arranca en "mediano"

  function applySnap(index, animate) {
    snapIndex = Math.max(0, Math.min(SNAP_RATIOS.length - 1, index));
    var totalH = screenPlayerEl.getBoundingClientRect().height;
    var h = totalH * SNAP_RATIOS[snapIndex];
    learningCard.style.transition = animate ? 'flex-basis 0.28s cubic-bezier(.2,.8,.2,1)' : 'none';
    learningCard.style.flex = '0 0 ' + h + 'px';
  }

  function setupResizeDrag(zone, opts) {
    opts = opts || {};
    if (!zone || !learningCard || !screenPlayerEl) return;
    var dragStartY = 0;
    var startH = 0;
    var dragging = false;
    var activePointerId = null;
    var threshold = opts.threshold || 8;
    var scrollEl = opts.scrollEl || null; // si se da, respeta el scroll de este elemento

    zone.addEventListener('pointerdown', function(e) {
      // No iniciar drag sobre controles interactivos
      if (e.target.closest('button, input, .progress-section, .controls-row')) return;
      dragStartY = e.clientY;
      startH = learningCard.getBoundingClientRect().height;
      dragging = false;
      activePointerId = e.pointerId;
    });

    zone.addEventListener('pointermove', function(e) {
      if (activePointerId === null || e.buttons !== 1) return;
      var dy = e.clientY - dragStartY;

      if (!dragging) {
        if (Math.abs(dy) < threshold) return;

        if (scrollEl) {
          var atTop = scrollEl.scrollTop <= 0;
          var atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1;
          // dy > 0 = dedo bajando = lista quiere mostrar contenido de arriba (solo posible si atTop)
          // dy < 0 = dedo subiendo = lista quiere mostrar contenido de abajo (solo posible si atBottom)
          var canIntercept = (dy > 0 && atTop) || (dy < 0 && atBottom);
          if (!canIntercept) return; // dejar que el scroll nativo actúe
        }

        dragging = true;
        if (resizeHandle) resizeHandle.classList.add('dragging');
        learningCard.style.transition = 'none';
        try { zone.setPointerCapture(activePointerId); } catch (_) {}
      }

      var totalH = screenPlayerEl.getBoundingClientRect().height;
      var newH = startH + dy;
      var minH = totalH * (SNAP_RATIOS[0] - 0.08);
      var maxH = totalH * 0.94;
      newH = Math.min(Math.max(newH, minH), maxH);
      learningCard.style.flex = '0 0 ' + newH + 'px';
      e.preventDefault();
    }, { passive: false });

    function endDrag(e) {
      if (activePointerId === null) return;
      if (resizeHandle) resizeHandle.classList.remove('dragging');
      if (dragging) {
        var totalH = screenPlayerEl.getBoundingClientRect().height;
        var curH = learningCard.getBoundingClientRect().height;
        var ratio = curH / totalH;

        // Si se arrastró casi al máximo, abrir pantalla completa de letras
        if (ratio >= 0.90 && typeof enterCleanFullscreen === 'function') {
          applySnap(SNAP_RATIOS.length - 1, true);
          enterCleanFullscreen();
        } else {
          // Buscar el snap más cercano
          var best = 0, bestDist = Infinity;
          for (var i = 0; i < SNAP_RATIOS.length; i++) {
            var d = Math.abs(SNAP_RATIOS[i] - ratio);
            if (d < bestDist) { bestDist = d; best = i; }
          }
          applySnap(best, true);
        }
      }
      dragging = false;
      activePointerId = null;
    }
    zone.addEventListener('pointerup', endDrag);
    zone.addEventListener('pointercancel', endDrag);
  }

  // La tarjeta de letras responde al arrastre desde casi cualquier punto
  setupResizeDrag(learningCard);
  // La barra de pestañas de la lista también (no scrollea, así que siempre intercepta)
  if (playlistSectionEl) setupResizeDrag(playlistSectionEl);
  // La lista de canciones: respeta su propio scroll, pero permite redimensionar
  // cuando el dedo arrastra "más allá" del límite de scroll (arriba/abajo)
  var playlistListEl = document.getElementById('playlist');
  if (playlistListEl) setupResizeDrag(playlistListEl, { scrollEl: playlistListEl });
  // El tirador explícito también funciona (umbral menor)
  setupResizeDrag(resizeHandle, { threshold: 2 });

  // Tocar el tirador alterna entre los 3 tamaños
  if (resizeHandle) {
    resizeHandle.addEventListener('click', function() {
      applySnap((snapIndex + 1) % SNAP_RATIOS.length, true);
    });
  }

  // Tamaño inicial
  applySnap(snapIndex, false);

  var playlistsAdmin = document.getElementById('btn-playlists-admin');
  var modalPlaylists = document.getElementById('modal-playlists');
  var playlistsModalBody = document.getElementById('playlists-modal-body');
  var playlistsModalClose = document.getElementById('playlists-modal-close');
  var playlistsOriginalParent = null;
  var playlistsOriginalNext = null;

  if (playlistsAdmin) playlistsAdmin.addEventListener('click', async function() {
    if (!modalPlaylists || !playlistsModalBody || !listsPanel) return;
    // Guardar posición original de los paneles (solo la primera vez)
    if (!playlistsOriginalParent) {
      playlistsOriginalParent = listsPanel.parentNode;
      playlistsOriginalNext = listsPanel.nextSibling;
    }
    // Mover los paneles al modal
    playlistsModalBody.appendChild(listsPanel);
    playlistsModalBody.appendChild(listDetail);
    listsPanel.hidden = false;
    listDetail.hidden = true;
    activeListId = null;
    await renderListsPanel();
    modalPlaylists.hidden = false;
  });

  function closePlaylistsModal() {
    if (!modalPlaylists) return;
    modalPlaylists.hidden = true;
    // Devolver los paneles a su lugar original
    if (playlistsOriginalParent) {
      if (playlistsOriginalNext) {
        playlistsOriginalParent.insertBefore(listsPanel, playlistsOriginalNext);
        playlistsOriginalParent.insertBefore(listDetail, playlistsOriginalNext);
      } else {
        playlistsOriginalParent.appendChild(listsPanel);
        playlistsOriginalParent.appendChild(listDetail);
      }
    }
    listsPanel.hidden = true;
    listDetail.hidden = true;
    activeListId = null;
  }

  if (playlistsModalClose) playlistsModalClose.addEventListener('click', closePlaylistsModal);
  if (modalPlaylists) modalPlaylists.addEventListener('click', function(e) {
    if (e.target === modalPlaylists) closePlaylistsModal();
  });
  window.closePlaylistsModal = closePlaylistsModal;
})();

(async function init() {
  applyTheme(localStorage.getItem(LS_THEME) || 'midnight');
  applyNightMode(localStorage.getItem(LS_NIGHT) === 'true');
  setupBackGuard();
  sortSelect.value = sortMode;
  updateTabs();
  updateTransportButtons();
  Player.setupMediaSession();
  await Player.loadLibrary();
  await renderPlaylist();
  await renderDashboard();
  await dbRequestPersistentStorage();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
