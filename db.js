/* ═══════════════════════════════════════
   db.js — IndexedDB storage layer v4
   Stores: tracks (audio+meta) + lyrics
═══════════════════════════════════════ */
const DB_NAME = 'AuroraPlayerDB', DB_VERSION = 2, STORE_TRACKS = 'tracks', STORE_LYRICS = 'lyrics';
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

// ── Lyrics storage (separate store) ──────────
async function dbGetLyricsDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('AuroraLyricsDB', 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore('lyrics', { keyPath: 'trackId' });
    };
    req.onsuccess  = e => resolve(e.target.result);
    req.onerror    = e => reject(e.target.error);
  });
}

async function dbSaveLyrics(trackId, lrcText) {
  const db = await dbGetLyricsDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('lyrics','readwrite').objectStore('lyrics').put({ trackId, lrcText });
    req.onsuccess = () => resolve();
    req.onerror   = e => reject(e.target.error);
  });
}

async function dbGetLyrics(trackId) {
  const db = await dbGetLyricsDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('lyrics','readonly').objectStore('lyrics').get(trackId);
    req.onsuccess = e => resolve(e.target.result?.lrcText || null);
    req.onerror   = e => reject(e.target.error);
  });
}

async function dbDeleteLyrics(trackId) {
  const db = await dbGetLyricsDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('lyrics','readwrite').objectStore('lyrics').delete(trackId);
    req.onsuccess = () => resolve();
    req.onerror   = e => reject(e.target.error);
  });
}
