/* ===== Math Adventure ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.math = (() => {
  const MAX_QUESTIONS = 10;
  let q = 0, ans = 0, busy = false;

  function start() {
    q = 0; ans = 0; busy = false;
    window._gameState.roundsCompleted = 0;
    nextQ();
  }

  function cfg(level) {
    switch (level) {
      case 1: return { kind: 'add', max: 6 };
      case 2: return { kind: 'add', max: 12 };
      case 3: return { kind: 'mix', max: 20 };
      case 4: return { kind: 'mix', max: 35 };
      default: return { kind: 'hard', max: 50 };
    }
  }

  function makeQ(level) {
    const c = cfg(level);
    let a, b, op, answer;
    if (c.kind === 'hard') {
      a = rnd(2, 6); b = rnd(1, 9);
      op = Math.random() < 0.5 ? '×' : '−';
      answer = op === '×' ? a * b : a * 7 - b + (level >= 5 ? rnd(0, 5) : 0);
      if (op === '−') { a = Math.max(10, a * 7); answer = a - b; b = a - answer; }
    } else if (c.kind === 'mix') {
      a = rnd(1, c.max); b = rnd(1, c.max);
      op = Math.random() < 0.5 ? '+' : '−';
      if (op === '−' && b > a) { const t = a; a = b; b = t; }
      answer = op === '+' ? a + b : a - b;
    } else {
      a = rnd(1, c.max); op = '+';
      if (level >= 2 && a + 5 > c.max) a = Math.max(1, c.max - 5);
      b = rnd(1, Math.min(c.max - a, 9));
      answer = a + b;
    }
    // ensure answer is non-negative and reasonable
    if (answer < 0) answer = a - b;
    return { text: `${a} ${op} ${b}`, answer };
  }

  function options(ansV) {
    const set = new Set([ansV]);
    while (set.size < 4) {
      const off = rnd(-7, 7);
      if (ansV + off >= 0 && ansV + off !== ansV) set.add(ansV + off);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  function nextQ() {
    const st = window._gameState;
    q++;
    if (q > MAX_QUESTIONS) return finish();
    st.roundsCompleted = q;
    const level = Math.max(1, Math.min(5, st.level));
    const qq = makeQ(level);
    ans = qq.answer;
    const opts = options(ans);

    const body = document.getElementById('game-body');
    body.innerHTML = `
      <div class="math-q">${qq.text} = ?</div>
      <div class="answer-grid">
        ${opts.map(o => `<button class="answer-btn" onclick="P2G.games.math.answer(this, ${o})">${o}</button>`).join('')}
      </div>
      <div class="q-progress">${q} / ${MAX_QUESTIONS}</div>
    `;
  }

  function answer(btn, val) {
    const st = window._gameState;
    if (busy) return;
    busy = true;
    const btns = document.querySelectorAll('.answer-btn');
    btns.forEach(b => b.disabled = true);
    if (val === ans) {
      st.correctCount++;
      st.score += 10;
      btn.classList.add('ok');
      P2G.fx && P2G.fx.play('correct');
    } else {
      st.errors++;
      st.score = Math.max(0, st.score - 2);
      btn.classList.add('no');
      P2G.fx && P2G.fx.play('wrong');
      btns.forEach(b => { if (parseFloat(b.textContent) === ans) b.classList.add('ok'); });
    }
    st.attempts++;
    P2G.players.updateChips(st);

    // adaptive adjust after each question based on last-3 accuracy
    if (st.mode === 'adaptive') {
      const recent = st.attempts > 0 ? Math.round((st.correctCount / st.attempts) * 100) : 50;
      const oldLv = st.level;
      const newLv = P2G.ai.adaptLevel(oldLv, recent);
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

  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  return { start, answer };
})();