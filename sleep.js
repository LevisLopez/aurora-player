/* ═══════════════════════════════════════
   sleep.js — Sleep Timer
   Counts down, fades volume, stops audio.
═══════════════════════════════════════ */

const SleepTimer = (() => {

  let endTime    = null;   // timestamp when timer expires
  let tickerId   = null;   // setInterval id
  let fadeId     = null;   // setTimeout for fade start
  let active     = false;

  const audio       = document.getElementById('audio');
  const badge       = document.getElementById('sleep-badge');
  const countdown   = document.getElementById('sleep-countdown');
  const btnSleep    = document.getElementById('btn-sleep');
  const cancelBtn   = document.getElementById('sleep-cancel');

  // Fade overlay element (created once)
  const overlay = document.createElement('div');
  overlay.className = 'fade-overlay';
  document.body.appendChild(overlay);

  // ── Format mm:ss ──────────────────────
  function fmt(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Start timer ───────────────────────
  function start(minutes) {
    cancel(); // clear any existing timer
    const ms  = minutes * 60 * 1000;
    endTime   = Date.now() + ms;
    active    = true;

    badge.hidden  = false;
    btnSleep.classList.add('sleep-on');

    // Ticker: update countdown every second
    tickerId = setInterval(() => {
      const remaining = endTime - Date.now();
      countdown.textContent = fmt(remaining);

      if (remaining <= 0) {
        expire();
      }
    }, 1000);

    countdown.textContent = fmt(ms);

    // Start fade 30s before end (or halfway if timer < 60s)
    const fadeDelay = Math.max(0, ms - 30000);
    fadeId = setTimeout(() => {
      overlay.classList.add('fading');
      fadeMusicOut(Math.min(30000, ms));
    }, fadeDelay);
  }

  // ── Fade music volume to 0 ────────────
  function fadeMusicOut(durationMs) {
    const startVol   = audio.volume;
    const steps      = 60;
    const stepTime   = durationMs / steps;
    const volStep    = startVol / steps;
    let   step       = 0;

    const fadeInterval = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol - volStep * step);
      if (step >= steps) clearInterval(fadeInterval);
    }, stepTime);
  }

  // ── Timer expired ─────────────────────
  function expire() {
    audio.pause();
    audio.volume = 1; // restore volume for next session
    cancel();
    overlay.classList.remove('fading');
    showToast('Sleep timer ended — good night! 🌙');
  }

  // ── Cancel timer ──────────────────────
  function cancel() {
    if (tickerId) { clearInterval(tickerId); tickerId = null; }
    if (fadeId)   { clearTimeout(fadeId);    fadeId   = null; }
    active         = false;
    endTime        = null;
    badge.hidden   = true;
    overlay.classList.remove('fading');
    audio.volume   = 1;
    btnSleep.classList.remove('sleep-on');
  }

  // ── Cancel button ─────────────────────
  cancelBtn.addEventListener('click', () => {
    cancel();
    showToast('Sleep timer cancelled');
  });

  return { start, cancel, get active() { return active; } };

})();
