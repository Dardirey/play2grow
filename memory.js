/* ===== Memory Game ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.memory = (() => {
  const EMOJIS = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐵', '🦄', '🐙', '🦋'];
  // pairs count and columns per level 1..5
  const CFG = { 1: { p: 6, cols: 4 }, 2: { p: 8, cols: 4 }, 3: { p: 8, cols: 4 }, 4: { p: 12, cols: 6 }, 5: { p: 15, cols: 6 } };
  const MAX_ROUNDS = 3;

  let cards = [], flipped = [], lock = false;
  let round = 0;
  let boardMatched = 0;

  function start() {
    round = 0; cards = []; flipped = []; lock = false;
    boardMatched = 0;
    nextRound();
  }

  function nextRound() {
    const st = window._gameState;
    round++;
    boardMatched = 0; flipped = []; lock = false;

    if (round > MAX_ROUNDS) return finishGame();

    // adaptive: level already adjusted at end of previous round
    const level = Math.max(1, Math.min(5, st.level));
    const cfg = CFG[level];
    const chosen = EMOJIS.slice(0, cfg.p);
    const deck = [...chosen, ...chosen].sort(() => Math.random() - 0.5);
    cards = deck.map((e, i) => ({ id: i, e, flip: false, match: false }));
    st.roundsCompleted++;

    renderBoard(cfg.cols);
    const aiMsg = document.getElementById('game-ai');
    if (aiMsg) aiMsg.innerHTML = '';
  }

  function renderBoard(cols) {
    const body = document.getElementById('game-body');
    body.style.setProperty('--mcols', cols);
    body.innerHTML = `
      <div class="memory-board" style="grid-template-columns: repeat(${cols}, 1fr)">
        ${cards.map((c, i) => `
          <button class="mcard ${c.match ? 'matched' : ''}" data-i="${i}" onclick="P2G.games.memory.flip(${i})">
            <span class="mcard-face">${c.match ? c.e : '❓'}</span>
          </button>`).join('')}
      </div>
      <div class="round-indicator">${'●'.repeat(MAX_ROUNDS - (round - 1))} ${P2G.i18n.t('next')}</div>
    `;
  }

  function flip(i) {
    const st = window._gameState;
    const c = cards[i];
    if (lock || c.match || c.flip) return;
    c.flip = true;
    flipped.push(c);
    st.attempts++;

    const btn = document.querySelector(`.mcard[data-i="${i}"]`);
    if (btn) btn.querySelector('.mcard-face').textContent = c.e;

    if (flipped.length === 2) {
      lock = true;
      const [a, b] = flipped;
      if (a.e === b.e) {
        a.match = true; b.match = true;
        boardMatched++;
        st.correctCount += 2;
        st.score += 20;
        P2G.fx && P2G.fx.play('correct');
        const cells = document.querySelectorAll('.mcard');
        cells.forEach(el => {
          const ix = parseInt(el.dataset.i);
          if (cards[ix].match) el.classList.add('matched');
        });
        P2G.players.updateChips(st);
        flipped = []; lock = false;

        const totalPairs = CFG[Math.max(1, Math.min(5, st.level))].p;
        if (boardMatched === totalPairs) roundDone();
      } else {
        st.errors += 2;
        st.score = Math.max(0, st.score - 2);
        P2G.fx && P2G.fx.play('wrong');
        P2G.players.updateChips(st);
        setTimeout(() => {
          cards.forEach((c2, i2) => { if (!c2.match) c2.flip = false; });
          const cells = document.querySelectorAll('.mcard');
          cells.forEach(el => {
            const ix = parseInt(el.dataset.i);
            if (!cards[ix].match) el.querySelector('.mcard-face').textContent = '❓';
          });
          flipped = []; lock = false;
        }, 800);
      }
    }
  }

  function roundDone() {
    const st = window._gameState;
    if (st.mode === 'adaptive') {
      const acc = st.attempts ? Math.round(st.correctCount / st.attempts * 100) : 0;
      const oldLv = st.level;
      const newLv = P2G.ai.adaptLevel(oldLv, acc);
      if (newLv > oldLv) {
        st.level = newLv;
        P2G.players.showAI({ msgKey: 'aiMessageHigh', leveled: { up: true, newLevel: st.level } });
      } else if (newLv < oldLv) {
        st.level = newLv;
        P2G.players.showAI({ msgKey: 'aiMessageLow', leveled: { up: false, newLevel: st.level } });
      } else {
        P2G.players.showAI({ msgKey: 'aiMessageMid', leveled: null });
      }
    }
    setTimeout(nextRound, 900);
  }

  function finishGame() {
    const st = window._gameState;
    const rec = P2G.players.finish(st, { levelLabel: P2G.levelLabel(st.level) });
    P2G.players.showResult(st, rec);
  }

  return { start, flip };
})();