/* ===== Attention Game (Spot the Difference) ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.attention = (() => {
  const MAX_ROUNDS = 3;
  const PALETTE = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍊', '🍋', '🍉', '🍑', '🥥', '🍒', '🫐'];
  // levels: [rows, cols, diffs]
  const CFG = {
    1: [4, 4, 3], 2: [4, 5, 4], 3: [5, 5, 4], 4: [5, 6, 5], 5: [6, 6, 6]
  };
  let board = [], diffs = [], found = [];
  let round = 0;

  function start() {
    round = 0; found = [];
    nextRound();
  }

  function nextRound() {
    const st = window._gameState;
    round++;
    if (round > MAX_ROUNDS) return finish();
    st.roundsCompleted = round;

    const lv = Math.max(1, Math.min(5, st.level));
    const [rows, cols, nDiff] = CFG[lv];
    const size = rows * cols;

    // original board
    const orig = [];
    for (let i = 0; i < size; i++) orig.push(PALETTE[Math.floor(Math.random() * PALETTE.length)]);

    // choose diff positions
    const pos = [];
    while (pos.length < nDiff) {
      const p = Math.floor(Math.random() * size);
      if (!pos.includes(p)) pos.push(p);
    }
    // modified board
    const mod = orig.slice();
    pos.forEach(p => {
      let ne;
      do {
        ne = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      } while (ne === orig[p]);
      mod[p] = ne;
    });

    board = orig; diffs = pos; found = [];

    render(rows, cols, orig, mod, nDiff);
  }

  function render(rows, cols, orig, mod, nDiff) {
    const body = document.getElementById('game-body');
    const cellCSS = `style="grid-template-columns: repeat(${cols}, 1fr)"`;
    const mk = (arr) => arr.map((e) =>
      `<span class="dif-cell">${e}</span>`).join('');
    const mkB = (arr) => arr.map((e, i) =>
      `<button class="dif-cell" data-i="${i}" onclick="P2G.games.attention.tap(this, ${i})">${e}</button>`).join('');

    body.innerHTML = `
      <div class="attention-wrap">
        <div class="att-panels">
          <div class="att-panel">
            <div class="att-label">🅰 ${P2G.i18n.t('diffOriginal')}</div>
            <div class="dif-grid" ${cellCSS}>${mk(orig)}</div>
          </div>
          <div class="att-panel">
            <div class="att-label">🅱 ${P2G.i18n.t('diffModified')}</div>
            <div class="dif-grid" ${cellCSS}>${mkB(mod)}</div>
          </div>
        </div>
        <div class="att-progress" id="att-progress">
          ${P2G.i18n.t('findLeft')}: <b>${nDiff}</b>
        </div>
      </div>
    `;
  }

  function tap(btn, i) {
    const st = window._gameState;
    const lv = Math.max(1, Math.min(5, st.level));
    const nDiff = CFG[lv][2];
    if (found.includes(i)) return;
    if (diffs.includes(i)) {
      found.push(i);
      st.correctCount++; st.score += 10;
      btn.classList.add('found');
      btn.style.opacity = 0.4;
      P2G.fx && P2G.fx.play('correct');
    } else {
      st.errors++; st.score = Math.max(0, st.score - 2);
      btn.classList.add('wrong');
      P2G.fx && P2G.fx.play('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 450);
    }
    st.attempts++;
    P2G.players.updateChips(st);

    const prog = document.getElementById('att-progress');
    if (prog) prog.innerHTML = `${P2G.i18n.t('findLeft')}: <b>${nDiff - found.length}</b>`;

    if (found.length === diffs.length) roundDone();
  }

  function roundDone() {
    const st = window._gameState;
    if (st.mode === 'adaptive') {
      const recent = st.attempts ? Math.round(st.correctCount / st.attempts * 100) : 50;
      const oldLv = st.level; const newLv = P2G.ai.adaptLevel(oldLv, recent);
      if (newLv > oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageHigh', leveled: { up: true, newLevel: st.level } }); }
      else if (newLv < oldLv) { st.level = newLv; P2G.players.showAI({ msgKey: 'aiMessageLow', leveled: { up: false, newLevel: st.level } }); }
      else P2G.players.showAI({ msgKey: 'aiMessageMid', leveled: null });
    }
    setTimeout(nextRound, 900);
  }

  function finish() {
    const st = window._gameState;
    const rec = P2G.players.finish(st, { levelLabel: P2G.levelLabel(st.level) });
    P2G.players.showResult(st, rec);
  }

  return { start, tap };
})();