/* ═══════════════════════════════════════
   lyrics.js — Karaoke engine v1
   - Fetches from lrclib.net automatically
   - Falls back to manual .lrc upload
   - Saves to IndexedDB
   - Syncs with audio playback
═══════════════════════════════════════ */

const Lyrics = (() => {

  let lines      = [];   // [{time, text}]
  let activeIdx  = -1;
  let onLine     = null; // callback when active line changes
  let enabled    = false;

  // ── Parse LRC format ─────────────────────
  function parseLRC(text) {
    const result = [];
    const lineRe = /\[(\d+):(\d+\.\d+)\](.*)/;
    text.split('\n').forEach(row => {
      const m = row.match(lineRe);
      if (!m) return;
      const time = parseInt(m[1]) * 60 + parseFloat(m[2]);
      const lyric = m[3].trim();
      if (lyric) result.push({ time, text: lyric });
    });
    return result.sort((a, b) => a.time - b.time);
  }

  // ── Fetch from lrclib.net ─────────────────
  async function fetchFromNet(title, artist) {
    try {
      const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`;
      const res  = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return data.syncedLyrics || null;
    } catch (_) {
      return null;
    }
  }

  // ── Load lyrics for a track ───────────────
  async function load(trackId, title, artist) {
    lines     = [];
    activeIdx = -1;
    enabled   = false;

    // 1. Check IndexedDB cache first
    const cached = await dbGetLyrics(trackId);
    if (cached) {
      lines   = parseLRC(cached);
      enabled = lines.length > 0;
      return enabled ? 'cached' : 'empty';
    }

    // 2. Fetch from lrclib.net
    const lrc = await fetchFromNet(title, artist);
    if (lrc) {
      await dbSaveLyrics(trackId, lrc);
      lines   = parseLRC(lrc);
      enabled = lines.length > 0;
      return enabled ? 'found' : 'empty';
    }

    return 'not_found';
  }

  // ── Save manual .lrc file ─────────────────
  async function saveManual(trackId, lrcText) {
    await dbSaveLyrics(trackId, lrcText);
    lines   = parseLRC(lrcText);
    enabled = lines.length > 0;
    return enabled;
  }

  // ── Sync with current time ─────────────────
  function sync(currentTime) {
    if (!enabled || !lines.length) return;

    let newIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].time) { newIdx = i; break; }
    }

    if (newIdx !== activeIdx) {
      activeIdx = newIdx;
      if (onLine) onLine(activeIdx, lines);
    }
  }

  // ── Delete lyrics for a track ─────────────
  async function remove(trackId) {
    await dbDeleteLyrics(trackId);
    lines     = [];
    activeIdx = -1;
    enabled   = false;
  }

  function clear() {
    lines     = [];
    activeIdx = -1;
    enabled   = false;
  }

  return {
    load, saveManual, sync, remove, clear,
    get enabled()  { return enabled; },
    get lines()    { return lines; },
    get activeIdx(){ return activeIdx; },
    set onLine(fn) { onLine = fn; },
  };

})();
