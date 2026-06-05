/* ═══════════════════════════════════════
   db.js — IndexedDB storage layer v4
   Stores: tracks (audio+meta) + lyrics
═══════════════════════════════════════ */
const DB_NAME = 'AuroraPlayerDB', DB_VERSION = 3, STORE_TRACKS = 'tracks', STORE_LYRICS = 'lyrics', STORE_PLAYLISTS = 'playlists';
let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
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
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ── Tracks ────────────────────────────────
async function dbSaveTrack(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS).add(data);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbGetAllTracks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).getAll();
    req.onsuccess = (e) => {
      resolve(e.target.result.map(t => ({
        id: t.id, title: t.title, artist: t.artist,
        duration: t.duration, size: t.size,
        favorite: t.favorite === true,
      })));
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

async function dbGetTrack(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).get(id);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbUpdateTrack(id, updates) {
  const full = await dbGetTrack(id);
  if (!full) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS).put({ ...full, ...updates });
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbDeleteTrack(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbToggleFavorite(id) {
  const full = await dbGetTrack(id);
  if (!full) return false;
  const newVal = !(full.favorite === true);
  await dbUpdateTrack(id, { favorite: newVal });
  return newVal;
}

async function dbGetTotalSize() {
  const tracks = await dbGetAllTracks();
  return tracks.reduce((sum, t) => sum + (t.size || 0), 0);
}

async function dbCheckDuplicate(title, artist) {
  const tracks = await dbGetAllTracks();
  const t = title.toLowerCase().trim(), a = artist.toLowerCase().trim();
  return tracks.find(tr =>
    (tr.title  || '').toLowerCase().trim() === t &&
    (tr.artist || '').toLowerCase().trim() === a
  ) || null;
}

// ── Lyrics ────────────────────────────────
async function dbSaveLyrics(trackId, lrcText) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_LYRICS, 'readwrite').objectStore(STORE_LYRICS).put({ trackId, lrc: lrcText });
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbGetLyrics(trackId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_LYRICS, 'readonly').objectStore(STORE_LYRICS).get(trackId);
    req.onsuccess = (e) => resolve(e.target.result?.lrc || null);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbDeleteLyrics(trackId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_LYRICS, 'readwrite').objectStore(STORE_LYRICS).delete(trackId);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ── Playlists ─────────────────────────────
async function dbGetAllPlaylists() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_PLAYLISTS, 'readonly').objectStore(STORE_PLAYLISTS).getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbCreatePlaylist(name) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_PLAYLISTS, 'readwrite').objectStore(STORE_PLAYLISTS).add({ name, trackIds: [] });
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbGetPlaylist(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_PLAYLISTS, 'readonly').objectStore(STORE_PLAYLISTS).get(id);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbUpdatePlaylist(id, updates) {
  const pl = await dbGetPlaylist(id);
  if (!pl) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_PLAYLISTS, 'readwrite').objectStore(STORE_PLAYLISTS).put({ ...pl, ...updates });
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbDeletePlaylist(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_PLAYLISTS, 'readwrite').objectStore(STORE_PLAYLISTS).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function dbAddTrackToPlaylist(playlistId, trackId) {
  const pl = await dbGetPlaylist(playlistId);
  if (!pl) return;
  if (!pl.trackIds.includes(trackId)) {
    pl.trackIds.push(trackId);
    await dbUpdatePlaylist(playlistId, { trackIds: pl.trackIds });
  }
}

async function dbRemoveTrackFromPlaylist(playlistId, trackId) {
  const pl = await dbGetPlaylist(playlistId);
  if (!pl) return;
  pl.trackIds = pl.trackIds.filter(id => id !== trackId);
  await dbUpdatePlaylist(playlistId, { trackIds: pl.trackIds });
}

// ── Export / Import ───────────────────────
async function dbExportLibrary() {
  const db = await openDB();
  // Get full tracks with blobs
  const tracks = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
  const lyrics    = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE_LYRICS, 'readonly').objectStore(STORE_LYRICS).getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
  const playlists = await dbGetAllPlaylists();

  // Convert blobs to base64
  const tracksEncoded = await Promise.all(tracks.map(async t => {
    if (!t.blob) return { ...t, blobB64: null, blobType: null };
    const b64 = await new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(',')[1]);
      r.readAsDataURL(t.blob);
    });
    return { ...t, blob: undefined, blobB64: b64, blobType: t.blob.type || 'audio/mpeg' };
  }));

  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tracks: tracksEncoded, lyrics, playlists });
}

async function dbImportLibrary(jsonStr, onProgress) {
  const data = JSON.parse(jsonStr);
  if (!data.tracks) throw new Error('Invalid backup file');

  let imported = 0, skipped = 0;
  const idMap = {}; // old id → new id

  for (const t of data.tracks) {
    const dup = await dbCheckDuplicate(t.title, t.artist);
    if (dup) { idMap[t.id] = dup.id; skipped++; continue; }
    let blob = null;
    if (t.blobB64) {
      const bin = atob(t.blobB64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      blob = new Blob([arr], { type: t.blobType || 'audio/mpeg' });
    }
    const newId = await dbSaveTrack({ title: t.title, artist: t.artist, blob, duration: t.duration, size: t.size, favorite: t.favorite });
    idMap[t.id] = newId;
    imported++;
    if (onProgress) onProgress(imported, data.tracks.length);
  }

  // Import lyrics with remapped ids
  for (const l of (data.lyrics || [])) {
    const newId = idMap[l.trackId];
    if (newId) await dbSaveLyrics(newId, l.lrc);
  }

  // Import playlists with remapped ids
  for (const pl of (data.playlists || [])) {
    const mappedIds = (pl.trackIds || []).map(id => idMap[id]).filter(Boolean);
    await dbCreatePlaylist(pl.name);
    const allPls = await dbGetAllPlaylists();
    const newPl  = allPls[allPls.length - 1];
    if (newPl) await dbUpdatePlaylist(newPl.id, { trackIds: mappedIds });
  }

  return { imported, skipped };
}
