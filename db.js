/* ═══════════════════════════════════════
   db.js — IndexedDB storage layer
   Stores: audio blobs + track metadata
═══════════════════════════════════════ */

const DB_NAME    = 'AuroraPlayerDB';
const DB_VERSION = 1;
const STORE_TRACKS = 'tracks';

let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return; }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_TRACKS)) {
        const store = db.createObjectStore(STORE_TRACKS, { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      }
    };

    req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror    = (e) => reject(e.target.error);
  });
}

// Save a new track: { title, artist, blob, duration, size }
async function dbSaveTrack(trackData) {
  const db    = await openDB();
  const store = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS);
  return new Promise((resolve, reject) => {
    const req = store.add(trackData);
    req.onsuccess = (e) => resolve(e.target.result); // returns new id
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Get all tracks (metadata only, no blob)
async function dbGetAllTracks() {
  const db    = await openDB();
  const store = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Get a single track by id (includes blob)
async function dbGetTrack(id) {
  const db    = await openDB();
  const store = db.transaction(STORE_TRACKS, 'readonly').objectStore(STORE_TRACKS);
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Update title/artist for a track
async function dbUpdateTrack(id, updates) {
  const track = await dbGetTrack(id);
  if (!track) return;
  const merged = { ...track, ...updates };
  const db     = await openDB();
  const store  = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS);
  return new Promise((resolve, reject) => {
    const req = store.put(merged);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Delete a track by id
async function dbDeleteTrack(id) {
  const db    = await openDB();
  const store = db.transaction(STORE_TRACKS, 'readwrite').objectStore(STORE_TRACKS);
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Calculate total size used in bytes
async function dbGetTotalSize() {
  const tracks = await dbGetAllTracks();
  return tracks.reduce((sum, t) => sum + (t.size || 0), 0);
}
