/* ═══════════════════════════════════════
   sleep.js — Sleep timer with gentle fade out.
═══════════════════════════════════════ */
const SleepTimer = (() => {
  let endTime = null;
  let tickerId = null;
  let fadeId = null;
  let fadeIntervalId = null;
  let active = false;

  const audio = document.getElementById('audio');
  const badge = document.getElementById('sleep-badge');
  const countdown = document.getElementById('sleep-countdown');
  const btnSleep = document.getElementById('btn-sleep');
  const cancelBtn = document.getElementById('sleep-cancel');

  const overlay = document.createElement('div');
  overlay.className = 'fade-overlay';
  document.body.appendChild(overlay);

  function notify(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
  }

  function formatMs(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(total / 60).toString().padStart(2, '0');
    const seconds = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function start(minutes) {
    cancel(false);
    const ms = Number(minutes) * 60 * 1000;
    if (!Number.isFinite(ms) || ms <= 0) return;

    endTime = Date.now() + ms;
    active = true;
    badge.hidden = false;
    btnSleep.classList.add('sleep-on');
    document.body.classList.add('night-mode');
    countdown.textContent = formatMs(ms);

    tickerId = setInterval(() => {
      const remaining = endTime - Date.now();
      countdown.textContent = formatMs(remaining);
      if (remaining <= 0) expire();
    }, 1000);

    const fadeDelay = Math.max(0, ms - 30000);
    fadeId = setTimeout(() => {
      overlay.classList.add('fading');
      fadeMusicOut(Math.min(30000, ms));
    }, fadeDelay);
  }

  function fadeMusicOut(durationMs) {
    if (fadeIntervalId) clearInterval(fadeIntervalId);
    const startVolume = audio.volume;
    const steps = 60;
    const stepTime = Math.max(50, durationMs / steps);
    let step = 0;

    fadeIntervalId = setInterval(() => {
      step += 1;
      audio.volume = Math.max(0, startVolume * (1 - (step / steps)));
      if (step >= steps) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
      }
    }, stepTime);
  }

  function expire() {
    audio.pause();
    audio.volume = 1;
    cancel(false);
    notify('Sleep timer ended.');
  }

  function cancel(showMessage = true) {
    if (tickerId) clearInterval(tickerId);
    if (fadeId) clearTimeout(fadeId);
    if (fadeIntervalId) clearInterval(fadeIntervalId);
    tickerId = null;
    fadeId = null;
    fadeIntervalId = null;
    endTime = null;
    active = false;
    badge.hidden = true;
    overlay.classList.remove('fading');
    audio.volume = 1;
    btnSleep.classList.remove('sleep-on');
    document.body.classList.remove('night-mode');
    if (showMessage) notify('Sleep timer cancelled.');
  }

  cancelBtn.addEventListener('click', () => cancel(true));

  return {
    start,
    cancel,
    get active() { return active; },
    get remainingMs() { return active && endTime ? Math.max(0, endTime - Date.now()) : 0; },
  };
})();
