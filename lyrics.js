/* ═══════════════════════════════════════
   lyrics.js — Karaoke engine
   Supports normal LRC line timing and enhanced word timing.
═══════════════════════════════════════ */
const Lyrics = (() => {
  let lines = [];
  let activeIdx = -1;
  let activeWordIdx = -1;
  let enabled = false;
  let onSync = null;

  function parseTimeStamp(value) {
    const match = String(value || '').match(/^(\d{1,3}):(\d{1,2})(?:\.(\d{1,3}))?$/);
    if (!match) return null;
    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const ms = Number(String(match[3] || '0').padEnd(3, '0').slice(0, 3));
    return (minutes * 60) + seconds + (ms / 1000);
  }

  function splitWords(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(word => ({ text: word, time: null, endTime: null, estimated: true }));
  }

  function stripWordTags(text) {
    return String(text || '').replace(/<\d{1,3}:\d{1,2}(?:\.\d{1,3})?>/g, '').replace(/\s+/g, ' ').trim();
  }

  function parseEnhancedWords(rawText) {
    const wordTagRegex = /<(\d{1,3}:\d{1,2}(?:\.\d{1,3})?)>/g;
    const tags = [...String(rawText || '').matchAll(wordTagRegex)];
    if (!tags.length) return splitWords(stripWordTags(rawText));

    const words = [];
    for (let i = 0; i < tags.length; i++) {
      const time = parseTimeStamp(tags[i][1]);
      const start = tags[i].index + tags[i][0].length;
      const end = i + 1 < tags.length ? tags[i + 1].index : rawText.length;
      const segment = rawText.slice(start, end).replace(/\s+/g, ' ').trim();
      const segmentWords = segment.split(' ').filter(Boolean);
      segmentWords.forEach((word, segmentIndex) => {
        words.push({ text: word, time, endTime: null, estimated: segmentWords.length > 1 && segmentIndex > 0 });
      });
    }
    return words.length ? words : splitWords(stripWordTags(rawText));
  }

  function parseLRC(text) {
    const parsed = [];
    const rows = String(text || '').replace(/\r/g, '').split('\n');
    const lineTagRegex = /\[(\d{1,3}:\d{1,2}(?:\.\d{1,3})?)\]/g;

    rows.forEach(row => {
      const tags = [...row.matchAll(lineTagRegex)];
      if (!tags.length) return;
      const rawLyric = row.replace(lineTagRegex, '').trim();
      const cleanText = stripWordTags(rawLyric);
      if (!cleanText) return;
      tags.forEach(tag => {
        const time = parseTimeStamp(tag[1]);
        if (time === null) return;
        parsed.push({
          time,
          endTime: null,
          text: cleanText,
          words: parseEnhancedWords(rawLyric),
        });
      });
    });

    parsed.sort((a, b) => a.time - b.time);

    for (let i = 0; i < parsed.length; i++) {
      const current = parsed[i];
      const next = parsed[i + 1];
      current.endTime = next ? next.time : current.time + Math.max(3.2, current.words.length * 0.55);
      prepareWordTiming(current);
    }

    return parsed;
  }

  function prepareWordTiming(line) {
    if (!line.words || !line.words.length) {
      line.words = splitWords(line.text);
    }

    const duration = Math.max(0.4, (line.endTime || line.time + 3) - line.time);
    const hasAnyTimedWord = line.words.some(word => typeof word.time === 'number');

    if (!hasAnyTimedWord) {
      const step = duration / Math.max(1, line.words.length);
      line.words.forEach((word, index) => {
        word.time = line.time + (step * index);
        word.endTime = index < line.words.length - 1 ? line.time + (step * (index + 1)) : line.endTime;
        word.estimated = true;
      });
      return;
    }

    let lastKnownTime = line.time;
    line.words.forEach((word, index) => {
      if (typeof word.time !== 'number') {
        const remainingWords = line.words.length - index;
        const remainingTime = Math.max(0.2, (line.endTime || lastKnownTime + 1) - lastKnownTime);
        word.time = lastKnownTime + (remainingTime / Math.max(1, remainingWords));
        word.estimated = true;
      }
      lastKnownTime = word.time;
    });

    line.words.forEach((word, index) => {
      const next = line.words[index + 1];
      word.endTime = next ? next.time : line.endTime;
    });
  }

  async function fetchFromNet(title, artist) {
    try {
      const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(title || '')}&artist_name=${encodeURIComponent(artist || '')}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return null;
      const data = await response.json();
      return data.syncedLyrics || null;
    } catch (_) {
      return null;
    }
  }

  async function load(trackId, title, artist) {
    clear();

    const cached = await dbGetLyrics(trackId);
    if (cached) {
      lines = parseLRC(cached);
      enabled = lines.length > 0;
      return enabled ? 'cached' : 'empty';
    }

    const onlineLrc = await fetchFromNet(title, artist);
    if (onlineLrc) {
      await dbSaveLyrics(trackId, onlineLrc);
      lines = parseLRC(onlineLrc);
      enabled = lines.length > 0;
      return enabled ? 'found' : 'empty';
    }

    return 'not_found';
  }

  async function saveManual(trackId, lrcText) {
    await dbSaveLyrics(trackId, lrcText);
    lines = parseLRC(lrcText);
    activeIdx = -1;
    activeWordIdx = -1;
    enabled = lines.length > 0;
    return enabled;
  }

  function sync(currentTime) {
    if (!enabled || !lines.length) return { idx: -1, wordIdx: -1, lines };

    let nextIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].time) { nextIdx = i; break; }
    }

    let nextWordIdx = -1;
    if (nextIdx >= 0) {
      const words = lines[nextIdx].words || [];
      for (let i = words.length - 1; i >= 0; i--) {
        if (currentTime >= words[i].time) { nextWordIdx = i; break; }
      }
    }

    if (nextIdx !== activeIdx || nextWordIdx !== activeWordIdx) {
      activeIdx = nextIdx;
      activeWordIdx = nextWordIdx;
      if (onSync) onSync(activeIdx, activeWordIdx, lines, currentTime);
    }

    return { idx: activeIdx, wordIdx: activeWordIdx, lines };
  }

  async function remove(trackId) {
    await dbDeleteLyrics(trackId);
    clear();
  }

  function clear() {
    lines = [];
    activeIdx = -1;
    activeWordIdx = -1;
    enabled = false;
  }

  return {
    load,
    saveManual,
    sync,
    remove,
    clear,
    parseLRC,
    get enabled() { return enabled; },
    get lines() { return lines; },
    get activeIdx() { return activeIdx; },
    get activeWordIdx() { return activeWordIdx; },
    set onSync(fn) { onSync = fn; },
  };
})();
