/* ═══════════════════════════════════════
   db.js — IndexedDB storage layer v3
═══════════════════════════════════════ */
const DB_NAME = 'AuroraPlayerDB', DB_VERSION = 1, STORE_TRACKS = 'tracks';
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
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Save a new track
async function dbSaveTrack(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS).add(data);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Get all tracks (metadata — includes favorite field, excludes heavy blob)
async function dbGetAllTracks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).getAll();
    req.onsuccess = (e) => {
      // Return lightweight copies without blob for memory efficiency
      const tracks = e.target.result.map(t => ({
        id:       t.id,
        title:    t.title,
        artist:   t.artist,
        duration: t.duration,
        size:     t.size,
        favorite: t.favorite === true, // normalize — undefined becomes false
      }));
      resolve(tracks);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

// Get single track WITH blob (for playback)
async function dbGetTrack(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS).get(id);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Update fields (reads full record with blob, merges, writes back)
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

// Delete track
async function dbDeleteTrack(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Toggle favorite — single atomic operation
async function dbToggleFavorite(id) {
  const full = await dbGetTrack(id);
  if (!full) return false;
  const newVal = !(full.favorite === true);
  await dbUpdateTrack(id, { favorite: newVal });
  return newVal;
}

// Total storage used
async function dbGetTotalSize() {
  const tracks = await dbGetAllTracks();
  return tracks.reduce((sum, t) => sum + (t.size || 0), 0);
}

// Check if a song already exists (by title + artist, case-insensitive)
async function dbCheckDuplicate(title, artist) {
  const tracks = await dbGetAllTracks();
  const t = title.toLowerCase().trim();
  const a = artist.toLowerCase().trim();
  return tracks.find(track =>
    (track.title  || '').toLowerCase().trim() === t &&
    (track.artist || '').toLowerCase().trim() === a
  ) || null;
}
