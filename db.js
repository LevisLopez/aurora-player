/* ═══════════════════════════════════════
   db.js — Aurora Player storage layer
   Keeps existing IndexedDB data and adds metadata safely.
═══════════════════════════════════════ */
const DB_NAME = 'AuroraPlayerDB';
const DB_VERSION = 5;
const STORE_TRACKS = 'tracks';
const STORE_LYRICS = 'lyrics';
const STORE_PLAYLISTS = 'playlists';
let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_TRACKS)) {
        db.createObjectStore(STORE_TRACKS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_LYRICS)) {
        db.createObjectStore(STORE_LYRICS, { keyPath: 'trackId' });
      }
      if (!db.objectStoreNames.contains(STORE_PLAYLISTS)) {
        db.createObjectStore(STORE_PLAYLISTS, { keyPath: 'id', autoIncrement: true });
      }
    };

    req.onsuccess = (event) => {
      _db = event.target.result;
      _db.onversionchange = () => {
        _db.close();
        _db = null;
      };
      resolve(_db);
    };
    req.onerror = (event) => reject(event.target.error);
  });
}

function tx(storeName, mode = 'readonly') {
  return openDB().then(db => db.transaction(storeName, mode).objectStore(storeName));
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = (event) => resolve(event.target.result);
    req.onerror = (event) => reject(event.target.error);
  });
}

function normalizeTrackMeta(t) {
  if (!t) return null;
  return {
    id: t.id,
    title: t.title || 'Unknown',
    artist: t.artist || 'Unknown',
    duration: Number(t.duration || 0),
    size: Number(t.size || (t.blob ? t.blob.size : 0) || 0),
    favorite: t.favorite === true,
    addedAt: Number(t.addedAt || t.createdAt || t.id || 0),
    playCount: Number(t.playCount || 0),
    lastPlayedAt: Number(t.lastPlayedAt || 0),
  };
}

// ── Tracks ────────────────────────────────
async function dbSaveTrack(data) {
  const store = await tx(STORE_TRACKS, 'readwrite');
  const now = Date.now();
  const record = {
    ...data,
    title: data.title || 'Unknown',
    artist: data.artist || 'Unknown',
    duration: Number(data.duration || 0),
    size: Number(data.size || (data.blob ? data.blob.size : 0) || 0),
    favorite: data.favorite === true,
    addedAt: Number(data.addedAt || now),
    playCount: Number(data.playCount || 0),
    lastPlayedAt: Number(data.lastPlayedAt || 0),
  };
  return reqToPromise(store.add(record));
}

async function dbGetAllTracks() {
  const store = await tx(STORE_TRACKS, 'readonly');
  const records = await reqToPromise(store.getAll());
  return records.map(normalizeTrackMeta).filter(Boolean);
}

async function dbGetTrack(id) {
  const store = await tx(STORE_TRACKS, 'readonly');
  return reqToPromise(store.get(Number(id)));
}

async function dbUpdateTrack(id, updates) {
  const full = await dbGetTrack(Number(id));
  if (!full) return null;
  const store = await tx(STORE_TRACKS, 'readwrite');
  const record = { ...full, ...updates };
  await reqToPromise(store.put(record));
  return normalizeTrackMeta(record);
}

async function dbDeleteTrack(id) {
  id = Number(id);
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_TRACKS, STORE_LYRICS, STORE_PLAYLISTS], 'readwrite');
    transaction.objectStore(STORE_TRACKS).delete(id);
    transaction.objectStore(STORE_LYRICS).delete(id);
    const listStore = transaction.objectStore(STORE_PLAYLISTS);
    const allReq = listStore.getAll();
    allReq.onsuccess = () => {
      (allReq.result || []).forEach(pl => {
        const nextIds = (pl.trackIds || []).filter(trackId => Number(trackId) !== id);
        if (nextIds.length !== (pl.trackIds || []).length) {
          listStore.put({ ...pl, trackIds: nextIds });
        }
      });
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

async function dbDeleteTracks(ids) {
  for (const id of ids) await dbDeleteTrack(id);
}

async function dbToggleFavorite(id) {
  const full = await dbGetTrack(Number(id));
  if (!full) return false;
  const next = !(full.favorite === true);
  await dbUpdateTrack(id, { favorite: next });
  return next;
}

async function dbIncrementPlayCount(id) {
  const full = await dbGetTrack(Number(id));
  if (!full) return null;
  const updated = {
    playCount: Number(full.playCount || 0) + 1,
    lastPlayedAt: Date.now(),
  };
  return dbUpdateTrack(id, updated);
}

async function dbGetTotalSize() {
  const tracks = await dbGetAllTracks();
  return tracks.reduce((sum, track) => sum + Number(track.size || 0), 0);
}

async function dbCheckDuplicate(title, artist) {
  const tracks = await dbGetAllTracks();
  const cleanTitle = String(title || '').toLowerCase().trim();
  const cleanArtist = String(artist || '').toLowerCase().trim();
  return tracks.find(track =>
    String(track.title || '').toLowerCase().trim() === cleanTitle &&
    String(track.artist || '').toLowerCase().trim() === cleanArtist
  ) || null;
}

async function dbGetTopTracks(limit = 10) {
  const tracks = await dbGetAllTracks();
  return tracks
    .filter(track => Number(track.playCount || 0) > 0)
    .sort((a, b) => (b.playCount - a.playCount) || (b.lastPlayedAt - a.lastPlayedAt) || String(a.title).localeCompare(String(b.title)))
    .slice(0, limit);
}

// ── Lyrics ────────────────────────────────
async function dbSaveLyrics(trackId, lrcText) {
  const store = await tx(STORE_LYRICS, 'readwrite');
  return reqToPromise(store.put({ trackId: Number(trackId), lrc: String(lrcText || ''), updatedAt: Date.now() }));
}

async function dbGetLyrics(trackId) {
  const store = await tx(STORE_LYRICS, 'readonly');
  const result = await reqToPromise(store.get(Number(trackId)));
  return result?.lrc || null;
}

async function dbDeleteLyrics(trackId) {
  const store = await tx(STORE_LYRICS, 'readwrite');
  return reqToPromise(store.delete(Number(trackId)));
}

// ── Playlists ─────────────────────────────
function normalizePlaylist(pl) {
  if (!pl) return null;
  return {
    id: pl.id,
    name: pl.name || 'Playlist',
    trackIds: Array.isArray(pl.trackIds) ? pl.trackIds.map(Number).filter(Boolean) : [],
    createdAt: Number(pl.createdAt || pl.id || Date.now()),
    updatedAt: Number(pl.updatedAt || pl.createdAt || pl.id || Date.now()),
  };
}

async function dbGetAllPlaylists() {
  const store = await tx(STORE_PLAYLISTS, 'readonly');
  const records = await reqToPromise(store.getAll());
  return records.map(normalizePlaylist).filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
}

async function dbCreatePlaylist(name) {
  const store = await tx(STORE_PLAYLISTS, 'readwrite');
  const now = Date.now();
  return reqToPromise(store.add({ name: String(name || 'Playlist').trim() || 'Playlist', trackIds: [], createdAt: now, updatedAt: now }));
}

async function dbGetPlaylist(id) {
  const store = await tx(STORE_PLAYLISTS, 'readonly');
  return normalizePlaylist(await reqToPromise(store.get(Number(id))));
}

async function dbUpdatePlaylist(id, updates) {
  const full = await dbGetPlaylist(Number(id));
  if (!full) return null;
  const store = await tx(STORE_PLAYLISTS, 'readwrite');
  const record = { ...full, ...updates, updatedAt: Date.now() };
  await reqToPromise(store.put(record));
  return normalizePlaylist(record);
}

async function dbDeletePlaylist(id) {
  const store = await tx(STORE_PLAYLISTS, 'readwrite');
  return reqToPromise(store.delete(Number(id)));
}

async function dbAddTrackToPlaylist(playlistId, trackId) {
  const pl = await dbGetPlaylist(Number(playlistId));
  if (!pl) return null;
  const id = Number(trackId);
  const trackIds = pl.trackIds.includes(id) ? pl.trackIds : [...pl.trackIds, id];
  return dbUpdatePlaylist(pl.id, { trackIds });
}

async function dbRemoveTrackFromPlaylist(playlistId, trackId) {
  const pl = await dbGetPlaylist(Number(playlistId));
  if (!pl) return null;
  const id = Number(trackId);
  return dbUpdatePlaylist(pl.id, { trackIds: pl.trackIds.filter(trackIdInList => Number(trackIdInList) !== id) });
}

// ── Export / Import ───────────────────────
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (!blob) { resolve(null); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64, type = 'audio/mpeg') {
  if (!base64) return null;
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type });
}

async function dbExportLibrary() {
  const db = await openDB();
  const tracks = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).getAll();
    req.onsuccess = (event) => resolve(event.target.result || []);
    req.onerror = (event) => reject(event.target.error);
  });
  const lyrics = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE_LYRICS, 'readonly').objectStore(STORE_LYRICS).getAll();
    req.onsuccess = (event) => resolve(event.target.result || []);
    req.onerror = (event) => reject(event.target.error);
  });
  const playlists = await dbGetAllPlaylists();

  const tracksEncoded = await Promise.all(tracks.map(async track => ({
    ...track,
    blob: undefined,
    blobB64: await blobToBase64(track.blob),
    blobType: track.blob?.type || 'audio/mpeg',
  })));

  return JSON.stringify({
    version: 2,
    app: 'Aurora Player',
    exportedAt: new Date().toISOString(),
    tracks: tracksEncoded,
    lyrics,
    playlists,
  });
}

async function dbImportLibrary(jsonStr, onProgress) {
  const data = JSON.parse(jsonStr);
  if (!data || !Array.isArray(data.tracks)) throw new Error('Invalid backup file');

  const idMap = {};
  let imported = 0;
  let skipped = 0;

  for (const track of data.tracks) {
    const duplicate = await dbCheckDuplicate(track.title, track.artist);
    if (duplicate) {
      idMap[track.id] = duplicate.id;
      skipped++;
      continue;
    }
    const blob = base64ToBlob(track.blobB64, track.blobType || 'audio/mpeg');
    const newId = await dbSaveTrack({
      title: track.title,
      artist: track.artist,
      blob,
      duration: track.duration,
      size: track.size || blob?.size || 0,
      favorite: track.favorite === true,
      addedAt: track.addedAt || Date.now(),
      playCount: Number(track.playCount || 0),
      lastPlayedAt: Number(track.lastPlayedAt || 0),
    });
    idMap[track.id] = newId;
    imported++;
    if (onProgress) onProgress(imported, data.tracks.length);
  }

  for (const lyric of (data.lyrics || [])) {
    const newId = idMap[lyric.trackId];
    if (newId) await dbSaveLyrics(newId, lyric.lrc || '');
  }

  for (const playlist of (data.playlists || [])) {
    const newPlaylistId = await dbCreatePlaylist(playlist.name || 'Playlist');
    const mappedIds = (playlist.trackIds || []).map(id => idMap[id]).filter(Boolean);
    await dbUpdatePlaylist(newPlaylistId, { trackIds: mappedIds });
  }

  return { imported, skipped };
}

// ── Storage persistence helper ─────────────
async function dbRequestPersistentStorage() {
  if (!navigator.storage || !navigator.storage.persist) return false;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch (_) {
    return false;
  }
}
