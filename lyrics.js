/* ═══════════════════════════════════════
   lyrics.js — Karaoke system
   - Auto-fetch from lrclib.net
   - Manual .lrc upload fallback
   - Stored in IndexedDB
   - Spotify-style display replacing EQ bars
═══════════════════════════════════════ */

const Lyrics = (() => {

  let lines       = [];   // [{time, text}]
  let currentLine = -1;
  let visible     = false;
  let trackId     = null;
  let tickerId    = null;

  const audio = document.getElementById('audio');

  // ── Parse .lrc format ────────────────────
  function parseLRC(text) {
    const result = [];
    const lineRe = /\[(\d{1,3}):(\d{2})\.(\d{1,3})\](.*)/;
    text.split('\n').forEach(row => {
      const m = row.match(lineRe);
      if (!m) return;
      const mins = parseInt(m[1]);
      const secs = parseInt(m[2]);
      const ms   = parseInt(m[3].padEnd(3,'0').slice(0,3));
      const time = mins * 60 + secs + ms / 1000;
      const text = m[4].trim();
      if (text) result.push({ time, text });
    });
    return result.sort((a,b) => a.time - b.time);
  }

  // ── Fetch from lrclib.net ─────────────────
  async function fetchFromAPI(title, artist) {
    try {
      const q   = encodeURIComponent(`${title} ${artist}`);
      const url = `https://lrclib.net/api/search?q=${q}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.length) return null;
      // Try to find best match
      const match = data.find(d =>
        d.syncedLyrics &&
        d.trackName?.toLowerCase().includes(title.toLowerCase().slice(0,5))
      ) || data.find(d => d.syncedLyrics) || null;
      return match?.syncedLyrics || null;
    } catch { return null; }
  }

  // ── Load lyrics for current track ─────────
  async function loadForTrack(track) {
    if (!track) { lines = []; return; }
    if (trackId === track.id && lines.length) return; // already loaded
    trackId = track.id;
    lines   = [];

    // 1. Check IndexedDB first
    const saved = await dbGetLyrics(track.id);
    if (saved) { lines = parseLRC(saved); renderLines(); return; }

    // 2. Try API
    showLyricsStatus('Searching lyrics...');
    const lrc = await fetchFromAPI(track.title || '', track.artist || '');
    if (lrc) {
      await dbSaveLyrics(track.id, lrc);
      lines = parseLRC(lrc);
      renderLines();
      return;
    }

    // 3. Not found
    showLyricsStatus('not-found');
  }

  // ── Tick — highlight current line ─────────
  function tick() {
    if (!lines.length || !visible) return;
    const t = audio.currentTime;
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= t) idx = i;
      else break;
    }
    if (idx === currentLine) return;
    currentLine = idx;
    updateHighlight();
  }

  function updateHighlight() {
    const els = document.querySelectorAll('.lyric-line');
    els.forEach((el, i) => {
      const active = i === currentLine;
      const past   = i < currentLine;
      el.classList.toggle('active', active);
      el.classList.toggle('past',   past && !active);
    });
    // scroll active line into view
    const activeEl = document.querySelector('.lyric-line.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // ── Render lines into lyrics container ────
  function renderLines() {
    const container = document.getElementById('lyrics-container');
    if (!container) return;
    document.getElementById('lyrics-status').hidden  = true;
    document.getElementById('lyrics-lines').hidden   = false;
    document.getElementById('lyrics-nofound').hidden = true;

    const linesEl = document.getElementById('lyrics-lines');
    linesEl.innerHTML = lines.map((l, i) =>
      `<div class="lyric-line" data-idx="${i}">${escHtmlL(l.text)}</div>`
    ).join('');

    // Click line to seek
    linesEl.querySelectorAll('.lyric-line').forEach((el, i) => {
      el.addEventListener('click', () => {
        audio.currentTime = lines[i].time;
        if (audio.paused) audio.play().catch(()=>{});
      });
    });

    currentLine = -1;
    tick();
  }

  function showLyricsStatus(state) {
    const status  = document.getElementById('lyrics-status');
    const nofound = document.getElementById('lyrics-nofound');
    const linesEl = document.getElementById('lyrics-lines');
    if (!status) return;
    if (state === 'not-found') {
      status.hidden  = true;
      linesEl.hidden = true;
      nofound.hidden = false;
    } else {
      status.textContent = state;
      status.hidden  = false;
      linesEl.hidden = true;
      nofound.hidden = true;
    }
  }

  // ── Show / hide lyrics screen ──────────────
  async function show() {
    visible = true;
    document.getElementById('lyrics-screen').hidden = false;
    document.getElementById('btn-lyrics').classList.add('on');
    const track = window.Player?.currentTrack();
    if (track) await loadForTrack(track);
    else showLyricsStatus('No track playing');
    clearInterval(tickerId);
    tickerId = setInterval(tick, 200);
  }

  function hide() {
    visible = false;
    document.getElementById('lyrics-screen').hidden = true;
    document.getElementById('btn-lyrics').classList.remove('on');
    clearInterval(tickerId);
  }

  function toggle() {
    visible ? hide() : show();
  }

  // ── Manual LRC upload ─────────────────────
  async function uploadLRC(file, trackId) {
    const text = await file.text();
    const parsed = parseLRC(text);
    if (!parsed.length) { return false; }
    await dbSaveLyrics(trackId, text);
    lines = parsed;
    renderLines();
    return true;
  }

  // ── When track changes, reload lyrics ──────
  function onTrackChange(track) {
    currentLine = -1;
    lines = [];
    trackId = null;
    if (visible && track) loadForTrack(track);
    else if (visible) showLyricsStatus('No track playing');
  }

  function escHtmlL(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Auto-tick on timeupdate for smoother sync
  audio.addEventListener('timeupdate', tick);

  return { show, hide, toggle, onTrackChange, uploadLRC,
           get visible() { return visible; } };

})();
