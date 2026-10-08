/* ===== Play2Grow Sound FX (Web Audio API) ===== */
window.P2G = window.P2G || {};
P2G.fx = (() => {
  let ctx = null;
  let enabled = localStorage.getItem('p2g_sound') !== 'off';

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
    }
    return ctx;
  }

  // tone(freq, t0, dur, type, vol, slide?)
  function tone(freq, start, dur, type, vol, slideTo) {
    const c = ensure();
    if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  const beep = {
    correct() {
      const t = ensure() && ctx.currentTime;
      tone(660, t, 0.12, 'triangle', 0.18);
      tone(880, t + 0.12, 0.16, 'triangle', 0.18);
    },
    wrong() {
      const t = ctx && ctx.currentTime;
      tone(220, t, 0.2, 'sawtooth', 0.12, 180);
    },
    levelUp() {
      const t = ctx && ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.08, 0.12, 'triangle', 0.16));
    },
    levelDown() {
      const t = ctx && ctx.currentTime;
      [392, 330, 262].forEach((f, i) => tone(f, t + i * 0.09, 0.14, 'triangle', 0.14));
    },
    win() {
      const t = ctx && ctx.currentTime;
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.1, 0.22, 'triangle', 0.18));
      tone(1047, t + 0.55, 0.4, 'sine', 0.15);
    },
    click() {
      const t = ctx && ctx.currentTime;
      tone(800, t, 0.06, 'sine', 0.08);
    }
  };

  function play(name) {
    if (!enabled) return;
    try { beep[name](); } catch (e) { }
  }

  function setEnabled(on) {
    enabled = on;
    localStorage.setItem('p2g_sound', on ? 'on' : 'off');
  }
  function isEnabled() { return enabled; }
  function toggle() { setEnabled(!enabled); return enabled; }

  return { play, setEnabled, toggle, isEnabled };
})();