/* ===== Time Game (Clock Reading) ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.time = (() => {
  const MAX_QUESTIONS = 8;
  let q = 0, ans = '', busy = false;
  let canvas = null, ctx = null;

  function start() {
    q = 0; ans = ''; busy = false;
    window._gameState.roundsCompleted = 0;
    nextQ();
  }

  // allowed minute sets per level
  function minuteSet(level) {
    if (level <= 2) return [0];
    if (level === 3) return [0, 30];
    if (level === 4) return [0, 15, 30, 45];
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  }

  function fmt(h, m) {
    m = m === 0 ? '00' : (m < 10 ? '0' + m : '' + m);
    return h + ':' + m;
  }

  function nextQ() {
    const st = window._gameState;
    q++;
    if (q > MAX_QUESTIONS) return finish();
    st.roundsCompleted = q;

    const lv = Math.max(1, Math.min(5, st.level));
    const mins = minuteSet(lv);
    const h = 1 + Math.floor(Math.random() * 12);
    const m = mins[Math.floor(Math.random() * mins.length)];
    ans = fmt(h, m);

    const opts = genOptions(h, m, mins);

    const body = document.getElementById('game-body');
    body.innerHTML = `
      <div class="clock-question">${P2G.i18n.t('instrTime')}</div>
      <div class="clock-canvas-wrap">
        <canvas id="clock-canvas" width="220" height="220"></canvas>
      </div>
      <div class="answer-grid">
        ${opts.map(o => `<button class="answer-btn time-opt" onclick="P2G.games.time.answer(this, '${o}')">${o}</button>`).join('')}
      </div>
      <div class="q-progress">${q} / ${MAX_QUESTIONS}</div>
    `;

    canvas = document.getElementById('clock-canvas');
    ctx = canvas.getContext('2d');
    drawClock(h, m, lv);
  }

  function genOptions(h, m, mins) {
    const set = new Set([fmt(h, m)]);
    let guard = 0;
    while (set.size < 4 && guard < 200) {
      guard++;
      const hh = 1 + Math.floor(Math.random() * 12);
      const mm = mins[Math.floor(Math.random() * mins.length)];
      const s = fmt(hh, mm);
      if (!set.has(s)) set.add(s);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  function drawClock(h, m, lv) {
    if (!ctx) return;
    const cx = 110, cy = 110, R = 95;
    ctx.clearRect(0, 0, 220, 220);

    // face
    ctx.beginPath();
    ctx.fillStyle = '#fffaf0';
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#6C5CE7';
    ctx.stroke();

    // ticks
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const big = i % 5 === 0;
      const r1 = R - (big ? 18 : 9);
      const r2 = R - 6;
      ctx.strokeStyle = big ? '#2d3436' : '#ccc';
      ctx.lineWidth = big ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a - Math.PI / 2) * r1, cy + Math.sin(a - Math.PI / 2) * r1);
      ctx.lineTo(cx + Math.cos(a - Math.PI / 2) * r2, cy + Math.sin(a - Math.PI / 2) * r2);
      ctx.stroke();
    }

    // hour numbers (only on higher levels to avoid crowding young kids)
    if (lv >= 3) {
      ctx.fillStyle = '#2d3436';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let n = 1; n <= 12; n++) {
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2;
        ctx.fillText(n, cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30));
      }
    }

    // hands
    const mAngle = (m / 60) * Math.PI * 2 - Math.PI / 2;
    const hAngle = ((h % 12) + m / 60) / 12 * Math.PI * 2 - Math.PI / 2;
    // hour hand
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hAngle) * (R - 36), cy + Math.sin(hAngle) * (R - 36));
    ctx.stroke();
    // minute hand
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(mAngle) * (R - 20), cy + Math.sin(mAngle) * (R - 20));
    ctx.stroke();
    // center dot
    ctx.fillStyle = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function answer(btn, val) {
    const st = window._gameState;
    if (busy) return;
    busy = true;
    const btns = document.querySelectorAll('.time-opt');
    btns.forEach(b => b.disabled = true);
    if (val === ans) {
      st.correctCount++; st.score += 10; btn.classList.add('ok');
      P2G.fx && P2G.fx.play('correct');
    } else {
      st.errors++; st.score = Math.max(0, st.score - 2); btn.classList.add('no');
      P2G.fx && P2G.fx.play('wrong');
      btns.forEach(b => { if (b.textContent === ans) b.classList.add('ok'); });
    }
    st.attempts++;
    P2G.players.updateChips(st);

    if (st.mode === 'adaptive') {
      const recent = Math.round(st.correctCount / st.attempts * 100);
      const oldLv = st.level; const newLv = P2G.ai.adaptLevel(oldLv, recent);
      if (newLv > oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageHigh', leveled: { up: true, newLevel: st.level } }); }
      else if (newLv < oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageLow', leveled: { up: false, newLevel: st.level } }); }
      else P2G.players.showAI({ msgKey: 'aiMessageMid', leveled: null });
    }

    setTimeout(() => { busy = false; nextQ(); }, 800);
  }

  function finish() {
    const st = window._gameState;
    const rec = P2G.players.finish(st, { levelLabel: P2G.levelLabel(st.level) });
    P2G.players.showResult(st, rec);
  }

  return { start, answer };
})();