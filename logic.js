/* ===== Logic Puzzle (complete the sequence) ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.logic = (() => {
  const MAX_QUESTIONS = 8;
  const SHAPES = ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠', '🔷', '▲'];
  const ANIMALS = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'];
  let q = 0, ans = '', busy = false;

  function start() {
    q = 0; ans = ''; busy = false;
    window._gameState.roundsCompleted = 0;
    nextQ();
  }

  // Build a repeating pattern; level controls complexity
  function build(level) {
    const pool = level <= 2 ? SHAPES : [...SHAPES, ...ANIMALS];
    let unitLen = level <= 1 ? 2 : level <= 3 ? 3 : level === 4 ? 4 : 5;
    // create unit
    const unit = [];
    const used = new Set();
    for (let i = 0; i < unitLen; i++) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      unit.push(pick);
    }
    // avoid too-repetitive trivial unit unless low level
    return unit;
  }

  function renderItem(emoji, idx, size) {
    return `<span class="seq-item" style="font-size:${size}px">${emoji}</span>`;
  }

  function nextQ() {
    const st = window._gameState;
    q++;
    if (q > MAX_QUESTIONS) return finish();
    st.roundsCompleted = q;
    const level = Math.max(1, Math.min(5, st.level));
    const unit = build(level);
    const seqLen = level <= 1 ? 3 : level <= 3 ? 4 : 5;
    const seq = [];
    for (let i = 0; i < seqLen; i++) seq.push(unit[i % unit.length]);
    ans = unit[seqLen % unit.length];

    // sizes: small variety for higher levels
    const sizes = level >= 4 ? [34, 44, 54] : [44];

    const body = document.getElementById('game-body');
    body.innerHTML = `
      <div class="seq-question">${P2G.i18n.t('instrLogic')}</div>
      <div class="seq-row">
        ${seq.map((e, i) => renderItem(e, i, sizes[Math.floor(Math.random() * sizes.length)])).join('')}
        <span class="seq-missing">?</span>
      </div>
      <div class="answer-grid">
        ${options().map(o => `<button class="answer-btn seq-opt" style="font-size:38px" onclick="P2G.games.logic.answer(this, '${o}')">${o}</button>`).join('')}
      </div>
      <div class="q-progress">${q} / ${MAX_QUESTIONS}</div>
    `;
  }

  function options() {
    const set = new Set([ans]);
    while (set.size < 4) {
      const pool = [...SHAPES, ...ANIMALS];
      const p = pool[Math.floor(Math.random() * pool.length)];
      if (p !== ans) set.add(p);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  function answer(btn, val) {
    const st = window._gameState;
    if (busy) return;
    busy = true;
    const btns = document.querySelectorAll('.seq-opt');
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

    if (st.mode === 'adaptive') adaptive();

    setTimeout(() => { busy = false; nextQ(); }, 800);
  }

  function adaptive() {
    const st = window._gameState;
    const recent = st.attempts ? Math.round(st.correctCount / st.attempts * 100) : 50;
    const oldLv = st.level;
    const newLv = P2G.ai.adaptLevel(oldLv, recent);
    if (newLv > oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageHigh', leveled: { up: true, newLevel: st.level } }); }
    else if (newLv < oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageLow', leveled: { up: false, newLevel: st.level } }); }
    else P2G.players.showAI({ msgKey: 'aiMessageMid', leveled: null });
  }

  function finish() {
    const st = window._gameState;
    const rec = P2G.players.finish(st, { levelLabel: P2G.levelLabel(st.level) });
    P2G.players.showResult(st, rec);
  }

  return { start, answer };
})();