/* ===== Creativity Game (paint-by-numbers mosaic) ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.creativity = (() => {
  const PATTERNS = [
    {
      name: 'heart',
      art: [
        '..##..',
        '.##.##',
        '######',
        '######',
        '.####.',
        '..##..'
      ]
    },
    {
      name: 'smiley',
      art: [
        '.####.',
        '#....#',
        '#.00.#',
        '#....#',
        '#0..0#',
        '.##..',
        '.#.#..'
      ].map(r => r.replace(/0/g, '.'))
    },
    {
      name: 'star',
      art: [
        '...##...',
        '..####..',
        '.######.',
        '########',
        '..#..#..',
        '..####..'
      ]
    },
    {
      name: 'rocket',
      art: [
        '...##...',
        '..####..',
        '..####..',
        '..####..',
        '...##...',
        '..####..',
        '.##..##.',
        '##....##'
      ]
    },
    {
      name: 'flower',
      art: [
        '..#..#..',
        '..####..',
        '.######.',
        '##.##.##',
        '.######.',
        '..####..',
        '..#..#..'
      ]
    },
    {
      name: 'diamond',
      art: [
        '..##..',
        '.####.',
        '######',
        '.####.',
        '..##..'
      ]
    }
  ];

  // color families by number index
  const COLOR_SETS = [
    ['#e74c3c', '#f1c40f'],
    ['#e74c3c', '#3498db'],
    ['#e74c3c', '#f1c40f', '#8e44ad'],
    ['#e74c3c', '#f1c40f', '#2ecc71'],
    ['#2980b9', '#e74c3c', '#f1c40f', '#2ecc71']
  ];

  let currentPattern = null, targetMap = [];
  let selectedColor = 0;
  let round = 0, filled = 0;
  const MAX_ROUNDS = 2;

  function start() {
    round = 0; filled = 0;
    nextRound();
  }

  function levelRegions(level) {
    return Math.max(1, Math.min(5, level));
  }

  function nextRound() {
    const st = window._gameState;
    round++;
    if (round > MAX_ROUNDS) return finish();
    st.roundsCompleted = round;

    const lv = Math.max(1, Math.min(5, st.level));
    const colorsIdx = Math.min(lv - 1, COLOR_SETS.length - 1);
    const colors = COLOR_SETS[colorsIdx];

    // choose pattern with grid size >= number of colors used
    const choice = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    currentPattern = choice;
    selectedColor = 0;

    // assign each cell a color index (numbers along pattern grid)
    filled = 0;
    render(currentPattern, colors);
  }

  function render(pattern, colors) {
    const st = window._gameState;
    const art = pattern.art;
    const nColors = colors.length;
    const cells = [];
    // map each art cell to color index 0..nColors-1 deterministically by hash
    const map = [];
    art.forEach((row, r) => {
      const rowMap = [];
      row.split('').forEach((ch, c) => {
        if (ch === '#') {
          rowMap.push({ r, c, colorIdx: (r * art[0].length + c) % nColors, filled: false });
        } else {
          rowMap.push(null);
        }
      });
      map.push(rowMap);
    });
    targetMap = map;

    const body = document.getElementById('game-body');
    const gridMaxW = Math.min(420, Math.max(280, art[0].length * 46));
    body.innerHTML = `
      <div class="crea-wrap">
        <div class="crea-grid" style="grid-template-columns: repeat(${art[0].length}, 1fr); width:${gridMaxW}px">
          ${map.flat().map((cell, idx) => {
            if (!cell) return `<span style="visibility:hidden"></span>`;
            return `<button class="crea-cell" data-idx="${idx}"
                      style="background:${colors[cell.colorIdx]}22"
                      onclick="P2G.games.creativity.fill(this)"><b>${cell.colorIdx + 1}</b></button>`;
          }).join('')}
        </div>
        <div class="crea-palette">
          ${colors.map((c, i) => `
            <button class="pal ${i === selectedColor ? 'active' : ''}" data-c="${i}"
                    style="background:${c}" onclick="P2G.games.creativity.pick(this, ${i})"></button>`).join('')}
        </div>
        <p class="muted small">${P2G.i18n.t('fillColor')}</p>
      </div>
      <div style="text-align:center;font-size:1.2rem;margin-top:1rem">${st.mode === 'adaptive' ? '🤖 ' + P2G.i18n.t('levelAdaptive') : ''}</div>
    `;
  }

  function pick(btn, i) {
    selectedColor = i;
    document.querySelectorAll('.pal').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
  }

  function fill(btn) {
    const st = window._gameState;
    const idx = parseInt(btn.dataset.idx);
    const cell = targetMap.flat()[idx];
    if (!cell || cell.filled) return;
    const myColor = COLOR_SETS[Math.min(Math.max(1, Math.min(5, st.level)) - 1, COLOR_SETS.length - 1)][cell.colorIdx];
    const picked = COLOR_SETS[Math.min(Math.max(1, Math.min(5, st.level)) - 1, COLOR_SETS.length - 1)][selectedColor];

    if (selectedColor === cell.colorIdx) {
      cell.filled = true;
      filled++;
      st.correctCount++; st.score += 10;
      P2G.fx && P2G.fx.play('correct');
      btn.style.background = myColor;
      btn.innerHTML = '✔';
      btn.classList.add('cell-done');
    } else {
      st.errors++; st.score = Math.max(0, st.score - 2);
      P2G.fx && P2G.fx.play('wrong');
      btn.classList.add('cell-wrong');
      setTimeout(() => btn.classList.remove('cell-wrong'), 400);
    }
    st.attempts++;
    P2G.players.updateChips(st);

    const totalCells = targetMap.flat().filter(c => c).length;
    if (filled === totalCells) roundDone();
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

  return { start, pick, fill };
})();