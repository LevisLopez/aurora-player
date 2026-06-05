/* ═══════════════════════════════════════
   lyrics.js — Karaoke engine v2
   - Fetches from lrclib.net automatically
   - Falls back to manual .lrc upload
   - Saves to IndexedDB
   - Syncs with audio playback
   - NEW: Handles 3-line cascade UI & Fullscreen
═══════════════════════════════════════ */

const Lyrics = (() => {

  let lines      = [];   // [{time, text}]
  let activeIdx  = -1;
  let onLine     = null; // callback when active line changes
  let enabled    = false;
  let hudTimeout = null; // Para ocultar los controles en Fullscreen

  // ── Parse LRC format ─────────────────────
  function parseLRC(text) {
    const result = [];
    // Soporta formatos estándar [mm:ss.xx] y variaciones
    const lineRe = /\[(\d+):(\d+(?:\.\d+)?)\](.*)/;
    text.split('\n').forEach(row => {
      const m = row.match(lineRe);
      if (!m) return;
      const time = parseInt(m[1], 10) * 60 + parseFloat(m[2]);
      const lyric = m[3].trim();
      // Guardamos la línea aunque esté vacía para mantener los tiempos de pausa musicales
      result.push({ time, text: lyric || "♪" });
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

    // Actualizar UI a estado "Buscando..." antes de empezar
    updateUIStates('searching');

    // 1. Check IndexedDB cache first
    const cached = await dbGetLyrics(trackId);
    if (cached) {
      lines   = parseLRC(cached);
      enabled = lines.length > 0;
      renderInitialDOM();
      return enabled ? 'cached' : 'empty';
    }

    // 2. Fetch from lrclib.net
    const lrc = await fetchFromNet(title, artist);
    if (lrc) {
      await dbSaveLyrics(trackId, lrc);
      lines   = parseLRC(lrc);
      enabled = lines.length > 0;
      renderInitialDOM();
      return enabled ? 'found' : 'empty';
    }

    updateUIStates('not_found');
    return 'not_found';
  }

  // ── Save manual .lrc file ─────────────────
  async function saveManual(trackId, lrcText) {
    await dbSaveLyrics(trackId, lrcText);
    lines   = parseLRC(lrcText);
    enabled = lines.length > 0;
    if (enabled) {
      renderInitialDOM();
    }
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
      updateCascadeUI(activeIdx);
      if (onLine) onLine(activeIdx, lines);
    }
  }

  // ── Renderizado Dinámico de las Letras ──────
  function renderInitialDOM() {
    const container = document.querySelector('.lyrics-scroll-container');
    if (!container) return;

    updateUIStates('playing');

    // Limpiamos e inyectamos todas las líneas del tema
    container.innerHTML = lines.map((line, idx) => `
      <div class="inline-line" data-idx="${idx}">${line.text}</div>
    `).join('');

    // Agregar el listener para que el usuario pueda saltar a una parte de la canción tocando la letra
    const elements = container.querySelectorAll('.inline-line');
    elements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitamos que interfiera con el Fullscreen click
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        if (window.AudioEngine && lines[idx]) {
          window.AudioEngine.currentTime = lines[idx].time;
        }
      });
    });

    // Forzar render inicial en la primera línea o intro
    updateCascadeUI(-1);
  }

  // ── Animación en Cascada (Efecto de Desplazamiento Vertical) ──
  function updateCascadeUI(idx) {
    const container = document.querySelector('.lyrics-scroll-container');
    const linesElements = document.querySelectorAll('.inline-line');
    if (!container || linesElements.length === 0) return;

    // Resetear clases de animación en todas las líneas
    linesElements.forEach(line => {
      line.classList.remove('prev', 'active', 'next');
    });

    let targetElement = null;

    if (idx === -1) {
      // Estado de introducción musical antes de que empiece la primera letra
      if (linesElements[0]) {
        linesElements[0].classList.add('next');
        targetElement = linesElements[0];
      }
    } else {
      // Línea activa actual
      if (linesElements[idx]) {
        linesElements[idx].classList.add('active');
        targetElement = linesElements[idx];
      }
      // Línea anterior (atenuada)
      if (idx > 0 && linesElements[idx - 1]) {
        linesElements[idx - 1].classList.add('prev');
      }
      // Línea siguiente (espera)
      if (idx < linesElements.length - 1 && linesElements[idx + 1]) {
        linesElements[idx + 1].classList.add('next');
      }
    }

    // Centrado físico vertical automatizado: Desplazamos el contenedor basándonos en la línea activa
    if (targetElement) {
      const containerHeight = container.parentElement.clientHeight;
      const elementOffset = targetElement.offsetTop;
      const elementHeight = targetElement.clientHeight;

      // Calculamos la posición exacta para que la línea quede perfectamente al medio del 60% superior
      const scrollOffset = (containerHeight / 2) - elementOffset - (elementHeight / 2);
      container.style.transform = `translateY(${scrollOffset}px)`;
    }
  }

  // ── Manejo del estado interno de las Vistas ──
  function updateUIStates(state) {
    const noLyricsEl = document.querySelector('.inline-no-lyrics');
    const container = document.querySelector('.lyrics-scroll-container');

    if (!noLyricsEl || !container) return;

    if (state === 'searching') {
      container.innerHTML = '';
      noLyricsEl.classList.remove('hidden');
      noLyricsEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:var(--accent)"></i><span style="font-size:12px; margin-top:8px;">Buscando letra...</span>`;
    } else if (state === 'not_found') {
      container.innerHTML = '';
      noLyricsEl.classList.remove('hidden');
      noLyricsEl.innerHTML = `
        <i class="fa-solid fa-music"></i>
        <span style="font-size:12px; margin-top:4px;">Letra no encontrada</span>
        <button class="inline-upload-btn" onclick="document.getElementById('manual-lrc-input').click()" style="margin-top:8px;">
          <i class="fa-solid fa-upload"></i> Subir .LRC
        </button>
      `;
    } else {
      // Estado 'playing' o 'cached'
      noLyricsEl.classList.add('hidden');
    }
  }

  // ── Inicializador de Eventos de Gestos / Fullscreen ──
  function initFullscreenFeatures() {
    const karaokeZone = document.querySelector('.karaoke-zone');
    const controlZone = document.querySelector('.controls-and-list-zone');

    if (!karaokeZone || !controlZone) return;

    // Al dar un toque en la zona del Karaoke, alternamos o despertamos pantallas
    karaokeZone.addEventListener('click', () => {
      const isFullscreen = karaokeZone.classList.contains('fullscreen-active');

      if (!isFullscreen) {
        // Entrar a Modo Full Screen Completo
        karaokeZone.classList.add('fullscreen-active');
        controlZone.classList.add('fullscreen-hidden');
        wakeUpHUD();
      } else {
        // Si ya está en pantalla completa, un toque despierta o refresca los botones ocultos (HUD)
        if (!karaokeZone.classList.contains('show-hud')) {
          wakeUpHUD();
        } else {
          // Si el HUD ya está visible y tocan la letra de nuevo, regresamos al modo normal
          karaokeZone.classList.remove('fullscreen-active');
          controlZone.classList.remove('fullscreen-hidden');
          karaokeZone.classList.remove('show-hud');
          if (hudTimeout) clearTimeout(hudTimeout);
        }
      }
    });

    function wakeUpHUD() {
      karaokeZone.classList.add('show-hud');
      if (hudTimeout) clearTimeout(hudTimeout);
      // Los botones e info de pista se desvanecen automáticamente tras 4 segundos de inactividad táctil
      hudTimeout = setTimeout(() => {
        if (karaokeZone.classList.contains('fullscreen-active')) {
          karaokeZone.classList.remove('show-hud');
        }
      }, 4000);
    }
  }

  // Ejecutar inicialización de eventos una vez cargue el script
  document.addEventListener('DOMContentLoaded', () => {
    initFullscreenFeatures();
  });

  // ── Operaciones de limpieza ─────────────────────
  async function remove(trackId) {
    await dbDeleteLyrics(trackId);
    clear();
  }

  function clear() {
    lines      = [];
    activeIdx  = -1;
    enabled    = false;
    const container = document.querySelector('.lyrics-scroll-container');
    if (container) container.innerHTML = '';
    updateUIStates('not_found');
  }

  return {
    load, saveManual, sync, remove, clear,
    get enabled()  { return enabled; },
    get lines()    { return lines; },
    get activeIdx(){ return activeIdx; },
    set onLine(fn) { onLine = fn; },
  };

})();
