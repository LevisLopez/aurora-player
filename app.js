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
const listPlayBtn = $('list-play');
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

const LS_TAB = 'aurora_active_tab';
const LS_SORT = 'aurora_sort_mode';
const LS_THEME = 'aurora_theme';

const THEMES = [
  { id: 'midnight', name: 'Midnight Blue', swatch: '#1d4ed8' },
  { id: 'electric', name: 'Electric Cyan', swatch: '#06b6d4' },
  { id: 'royal', name: 'Royal Violet', swatch: '#8b5cf6' },
  { id: 'emerald', name: 'Neon Emerald', swatch: '#10b981' },
  { id: 'crimson', name: 'Crimson Pulse', swatch: '#f43f5e' },
  { id: 'gold', name: 'Solar Gold', swatch: '#f59e0b' },
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
  if (name === 'admin') renderAdminList();
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

function setActiveTab(tab) {
  activeTab = tab;
  if (tab !== 'lists') activeListId = null;
  localStorage.setItem(LS_TAB, activeTab);
  renderPlaylist();
}

function updateTabs() {
  tabAll.classList.toggle('active', activeTab === 'all');
  tabFav.classList.toggle('active', activeTab === 'favorites');
  tabLists.classList.toggle('active', activeTab === 'lists');
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
  const allowRemove = options.allowRemove === true;

  return tracks.map((track, index) => {
    const isActive = Number(track.id) === Number(currentId);
    const isFav = track.favorite === true;
    const left = isActive ? playingBars() : `<span class="pl-num">${showRank ? index + 1 : index + 1}</span>`;
    const subParts = [escHtml(track.artist || 'Unknown')];
    if (showStats || showRank) subParts.push(formatPlayCount(track.playCount || 0));
    return `
      <article class="playlist-item ${isActive ? 'active' : ''}" data-id="${track.id}" role="button" tabindex="0">
        ${left}
        <div class="pl-info">
          <div class="pl-title">${escHtml(track.title || 'Unknown')}</div>
          <div class="pl-artist">${subParts.join(' • ')}</div>
        </div>
        <button class="row-icon-btn fav-btn ${isFav ? 'on' : ''}" data-action="favorite" data-id="${track.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
        </button>
        <button class="row-icon-btn add-list-btn" data-action="add-list" data-id="${track.id}" aria-label="Add to playlist"><i class="ti ti-list-plus"></i></button>
        ${allowRemove ? `<button class="row-icon-btn danger remove-from-list-btn" data-action="remove-list" data-id="${track.id}" aria-label="Remove from playlist"><i class="ti ti-x"></i></button>` : ''}
        <span class="pl-dur">${track.duration ? Player.formatTime(track.duration) : '—'}</span>
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
    });
    row.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const id = Number(row.dataset.id);
      await Player.playById(id, queueIds);
    });
  });

  container.querySelectorAll('[data-action="favorite"]').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      event.stopPropagation();
      const id = Number(btn.dataset.id);
      const next = await dbToggleFavorite(id);
      const track = Player.tracks.find(item => Number(item.id) === id);
      if (track) track.favorite = next;
      renderPlaylist();
      if (screenAdmin.classList.contains('active')) renderAdminList();
      showToast(next ? 'Added to Favorites' : 'Removed from Favorites');
    });
  });

  container.querySelectorAll('[data-action="add-list"]').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      openAddToListModal(Number(btn.dataset.id));
    });
  });

  if (extra.onRemove) {
    container.querySelectorAll('[data-action="remove-list"]').forEach(btn => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        await extra.onRemove(Number(btn.dataset.id));
      });
    });
  }
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

  // Habilitar/deshabilitar botón de reproducir lista
  listPlayBtn.disabled = tracks.length === 0;
  listPlayBtn.title = tracks.length ? `Reproducir ${playlist.name}` : 'Sin canciones';
  listPlayBtn.onclick = () => {
    if (!tracks.length) return;
    const ids = tracks.map(t => t.id);
    Player.setQueue(ids, false, false);
    Player.playById(ids[0], ids);
    showMainScreen('player');
    showToast(`▶ ${playlist.name}`);
  };

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
      showToast('Canción quitada de la lista');
      await renderListDetailById(activeListId);
    },
  });
}

// ── Search ───────────────────────────────
function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '<div class="search-empty">Type to search...</div>';
    return;
  }

  const tracks = Player.tracks.filter(track =>
    String(track.title || '').toLowerCase().includes(query) ||
    String(track.artist || '').toLowerCase().includes(query)
  );

  if (!tracks.length) {
    searchResults.innerHTML = '<div class="search-empty">No results found</div>';
    return;
  }

  const sorted = applySort(tracks);
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
        <div class="admin-actions" ${selectMode ? 'hidden' : ''}>
          <button class="admin-btn add-list-btn" data-id="${track.id}" aria-label="Add to playlist" title="Add to playlist"><i class="ti ti-list-plus"></i></button>
          <button class="admin-btn edit-btn" data-id="${track.id}" aria-label="Edit track" title="Edit"><i class="ti ti-pencil"></i></button>
          <button class="admin-btn delete-btn danger" data-id="${track.id}" aria-label="Delete track" title="Delete"><i class="ti ti-trash"></i></button>
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

  adminList.querySelectorAll('.add-list-btn').forEach(btn => btn.addEventListener('click', () => openAddToListModal(Number(btn.dataset.id))));
  adminList.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openRenameModal(Number(btn.dataset.id))));
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
  pushNavState('lyrics');
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
  const wrap = $('inline-klines-wrap');
  if (wrap) { wrap.innerHTML = ''; wrap.style.transform = ''; }
  $('inline-no-lyrics').classList.remove('hidden');
}

function buildInlineKaraokeLines(lines) {
  const wrap = $('inline-klines-wrap');
  if (!wrap) return;
  $('inline-no-lyrics').classList.add('hidden');
  wrap.innerHTML = lines.map((line, i) =>
    `<div class="kline" data-idx="${i}">${escHtml(line.text)}</div>`
  ).join('');
}

function scrollInlineKaraoke(idx) {
  const wrap = $('inline-klines-wrap');
  const container = wrap?.parentElement;
  if (!wrap || !container || idx < 0) return;
  const lines = wrap.querySelectorAll('.kline');
  if (!lines[idx]) return;

  // Actualizar clases
  lines.forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.classList.toggle('near',   Math.abs(i - idx) === 1);
    el.classList.remove('near');
  });
  // Near = ±1
  if (lines[idx - 1]) lines[idx - 1].classList.add('near');
  if (lines[idx + 1]) lines[idx + 1].classList.add('near');

  // Centrar la línea activa con transform
  const containerH = container.clientHeight;
  const lineTop    = lines[idx].offsetTop;
  const lineH      = lines[idx].offsetHeight;
  const offset     = lineTop - containerH / 2 + lineH / 2;
  wrap.style.transform = `translateY(${-offset}px)`;
}

function renderInlineLyrics(idx, wordIdx, lines) {
  if (idx < 0 || !lines[idx]) return;
  scrollInlineKaraoke(idx);
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

  const state = Lyrics.sync(Player.currentTime);
  updateLyricsHighlight(state.idx, state.wordIdx, state.lines, Player.currentTime);
}

function updateLyricsHighlight(idx, wordIdx, lines) {
  if (!lines || idx < 0 || !lines[idx]) return;
  renderInlineLyrics(idx, wordIdx, lines);

  const lineEls = lyricsLines.querySelectorAll('.lyric-line');
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

  if (lyricsVisible && idx !== lastLyricScrollIdx && lineEls[idx]) {
    lastLyricScrollIdx = idx;
    lineEls[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
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
    buildInlineKaraokeLines(Lyrics.lines);
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

let fsControlsTimer = null;

function showFsControls() {
  document.body.classList.add('fs-controls-visible');
  clearTimeout(fsControlsTimer);
  fsControlsTimer = setTimeout(() => {
    document.body.classList.remove('fs-controls-visible');
  }, 3000);
}

async function toggleLyricsFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (screenLyrics.requestFullscreen) {
      await screenLyrics.requestFullscreen();
    } else {
      document.body.classList.toggle('lyrics-cinema');
      updateFullscreenIcon();
    }
  } catch (_) {
    document.body.classList.toggle('lyrics-cinema');
    updateFullscreenIcon();
  }
}

function updateFullscreenIcon() {
  const full = document.fullscreenElement === screenLyrics || document.body.classList.contains('lyrics-cinema');
  document.body.classList.toggle('lyrics-fullscreen', full);
  lyricsFullscreenBtn.querySelector('i').className = full ? 'ti ti-minimize' : 'ti ti-maximize';
  if (!full) {
    // Al salir de fullscreen, restaurar controles visibles
    document.body.classList.remove('fs-controls-visible');
    clearTimeout(fsControlsTimer);
  }
}

// ── Manejo del botón atrás del celular ───
function pushNavState(name) {
  history.pushState({ screen: name }, '', '');
}

const _showMainScreen = showMainScreen;
window.showMainScreen = function(name) {
  _showMainScreen(name);
  if (name !== 'player') pushNavState(name);
};

function showLyricsScreen_orig() {
  lyricsVisible = true;
  screenLyrics.classList.add('active');
  btnLyrics.classList.add('lyrics-on');
  const track = Player.currentTrack();
  if (track) loadLyricsForTrack(track, true);
  else showLyricsState('no-track');
  pushNavState('lyrics');
}

window.addEventListener('popstate', (e) => {
  // Cerrar fullscreen primero
  const isFullscreen = document.body.classList.contains('lyrics-fullscreen') ||
                       document.body.classList.contains('lyrics-cinema');
  if (isFullscreen) {
    if (document.fullscreenElement) document.exitFullscreen();
    document.body.classList.remove('lyrics-cinema', 'lyrics-fullscreen', 'fs-controls-visible');
    updateFullscreenIcon();
    pushNavState('lyrics'); // mantener en lyrics para el siguiente atrás
    return;
  }
  // Cerrar pantalla de lyrics
  if (lyricsVisible) {
    hideLyricsScreen();
    return;
  }
  // Cerrar pantalla admin
  if (screenAdmin.classList.contains('active')) {
    _showMainScreen('player');
    return;
  }
  // Si ya estamos en player, salir (comportamiento por defecto)
});
btnBack.addEventListener('click', () => showMainScreen('player'));
btnOpenAdmin.addEventListener('click', () => { showMainScreen('admin'); pushNavState('admin'); });

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

btnSearch.addEventListener('click', () => {
  searchOverlay.hidden = false;
  searchInput.value = '';
  renderSearchResults();
  setTimeout(() => searchInput.focus(), 80);
});
searchBack.addEventListener('click', () => { searchOverlay.hidden = true; });
searchInput.addEventListener('input', renderSearchResults);

btnTheme.addEventListener('click', () => { modalTheme.hidden = false; renderThemeOptions(); });
themeClose.addEventListener('click', () => { modalTheme.hidden = true; });
modalTheme.addEventListener('click', (event) => { if (event.target === modalTheme) modalTheme.hidden = true; });

tabAll.addEventListener('click', () => setActiveTab('all'));
tabFav.addEventListener('click', () => setActiveTab('favorites'));
tabLists.addEventListener('click', () => setActiveTab('lists'));
tabTop.addEventListener('click', () => setActiveTab('top'));
sortSelect.addEventListener('change', () => {
  sortMode = sortSelect.value;
  localStorage.setItem(LS_SORT, sortMode);
  renderPlaylist();
  if (screenAdmin.classList.contains('active')) renderAdminList();
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

listBack.addEventListener('click', () => { activeListId = null; renderListsPanel(); });
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
$('inline-lyrics').addEventListener('click', () => { if (Player.currentTrack()) showLyricsScreen(); });
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
lyricsContent.addEventListener('click', (e) => {
  const isFullscreen = document.body.classList.contains('lyrics-fullscreen') ||
                       document.body.classList.contains('lyrics-cinema');
  if (isFullscreen) {
    // Toque simple → mostrar/ocultar controles
    const visible = document.body.classList.contains('fs-controls-visible');
    if (visible) {
      document.body.classList.remove('fs-controls-visible');
      clearTimeout(fsControlsTimer);
    } else {
      showFsControls();
    }
    return;
  }
  // Doble tap fuera de fullscreen → entrar en fullscreen
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
  Lyrics.sync(current);
};

Player.onPlayState = (playing) => {
  playIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
  lyricsPlayIcon.className = playing ? 'ti ti-player-pause' : 'ti ti-player-play';
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
  lyricsTrackTitle.textContent = track ? (track.title || 'Unknown') : '—';
  lyricsTrackArtist.textContent = track ? (track.artist || 'Unknown') : '—';
  resetInlineLyrics();
  Lyrics.clear();
  lyricsDeleteBtn.hidden = true;
  if (track) loadLyricsForTrack(track, lyricsVisible);
  else if (lyricsVisible) showLyricsState('no-track');
  renderPlaylist();
};

Lyrics.onSync = updateLyricsHighlight;

// ── Init ──────────────────────────────────
(async function init() {
  applyTheme(localStorage.getItem(LS_THEME) || 'midnight');
  sortSelect.value = sortMode;
  updateTabs();
  updateTransportButtons();
  Player.setupMediaSession();
  await Player.loadLibrary();
  await renderPlaylist();

  // Almacenamiento persistente — mostrar aviso si no está garantizado
  await checkPersistentStorage();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();

async function checkPersistentStorage() {
  if (!navigator.storage || !navigator.storage.persisted) return;
  const storageWarning = $('storage-warning');
  const persistBtn = $('storage-persist-btn');
  try {
    const persisted = await navigator.storage.persisted();
    if (persisted) {
      if (storageWarning) storageWarning.hidden = true;
      return;
    }
    // Intentar pedir automáticamente (puede requerir interacción del usuario)
    const granted = await navigator.storage.persist();
    if (granted) {
      if (storageWarning) storageWarning.hidden = true;
      return;
    }
    // No se pudo otorgar automáticamente — mostrar aviso
    if (storageWarning) storageWarning.hidden = false;
    if (persistBtn) {
      persistBtn.addEventListener('click', async () => {
        const ok = await navigator.storage.persist();
        if (ok) {
          storageWarning.hidden = true;
          showToast('✓ Almacenamiento permanente activado');
        } else {
          showToast('El navegador no pudo garantizarlo. Instala la app como PWA para mejor protección.');
        }
      });
    }
  } catch (_) {}
}
