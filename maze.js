/* ===== Maze Game ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.maze = (() => {
  const MAX_ROUNDS = 2;
  const SIZE = { 1: 9, 2: 11, 3: 13, 4: 15, 5: 17 };

  let maze = [], px = 0, py = 0, gx = 0, gy = 0, cell = 20;
  let canvas = null, ctx = null;
  let round = 0, won = false;
  let moves = 0;

  function start() {
    round = 0; won = false;
    nextRound();
  }

  function nextRound() {
    const st = window._gameState;
    round++;
    if (round > MAX_ROUNDS) return finish();
    st.roundsCompleted = round;

    const size = SIZE[Math.max(1, Math.min(5, st.level))] || SIZE[3];
    cell = Math.max(14, Math.floor(460 / size));
    maze = genMaze(size);
    px = 1; py = 1; won = false; moves = 0;

    const body = document.getElementById('game-body');
    body.innerHTML = `
      <div class="maze-wrap">
        <canvas id="maze-canvas" width="${size * cell}" height="${size * cell}"></canvas>
        <div class="dpad">
          <div class="dpad-row"><button class="dpad-btn" data-d="up">⬆️</button></div>
          <div class="dpad-row">
            <button class="dpad-btn" data-d="left">⬅️</button>
            <button class="dpad-btn" data-d="down">⬇️</button>
            <button class="dpad-btn" data-d="right">➡️</button>
          </div>
        </div>
      </div>
    `;
    canvas = document.getElementById('maze-canvas');
    ctx = canvas.getContext('2d');

    // goal at bottom-right inside
    gx = size - 2; gy = size - 2;
    maze[gy + 1][gx] = 0; // open the exit hole

    bindControls();
    draw();
  }

  function genMaze(size) {
    // init walls
    const m = [];
    for (let y = 0; y < size; y++) m.push(new Array(size).fill(1));
    // recursive backtracker
    const stack = [];
    const startX = 1, startY = 1;
    m[startY][startX] = 0;
    stack.push([startX, startY]);
    const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]];
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const nd = dirs.slice().sort(() => Math.random() - 0.5)
        .filter(([dx, dy]) => {
          const nx = cx + dx, ny = cy + dy;
          return nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && m[ny][nx] === 1;
        });
      if (nd.length === 0) { stack.pop(); continue; }
      const [dx, dy] = nd[0];
      m[cy + dy / 2][cx + dx / 2] = 0;
      m[cy + dy][cx + dx] = 0;
      stack.push([cx + dx, cy + dy]);
    }
    // open entrance
    m[1][0] = 0;
    // ensure goal cell is open + exit opening at bottom
    m[size - 2][size - 2] = 0;
    m[size - 1][size - 2] = 0;
    return m;
  }

  function draw() {
    if (!ctx) return;
    const size = maze.length;
    ctx.clearRect(0, 0, size * cell, size * cell);
    // floor
    ctx.fillStyle = '#feedb8';
    ctx.fillRect(0, 0, size * cell, size * cell);
    // walls
    ctx.fillStyle = '#6C5CE7';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (maze[y][x] === 1) ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    // cheese (goal)
    ctx.font = `${cell}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧀', gx * cell + cell / 2, gy * cell + cell / 2);
    // player
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(px * cell + cell / 2, py * cell + cell / 2, cell / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(dx, dy) {
    const st = window._gameState;
    if (won) return;
    const nx = px + dx, ny = py + dy;
    if (nx < 0 || ny < 0 || nx >= maze.length || ny >= maze.length || maze[ny][nx] === 1) {
      // wall hit
      st.errors++;
      st.attempts++;
      st.score = Math.max(0, st.score - 1);
      P2G.fx && P2G.fx.play('wrong');
      P2G.players.updateChips(st);
      flashPlayer();
      return;
    }
    px = nx; py = ny;
    st.correctCount++;
    st.attempts++;
    st.score += 2;
    moves++;
    P2G.players.updateChips(st);
    draw();
    // goal check
    if (px === gx && py === gy) { won = true; draw(); winFlash(); roundDone(); }
  }

  function flashPlayer() {
    if (!ctx) return;
    const cx = px * cell + cell / 2, cy = py * cell + cell / 2;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, cell / 2 + 2, 0, Math.PI * 2);
    ctx.stroke();
    setTimeout(draw, 150);
  }

  function winFlash() {
    if (!ctx) return;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(gx * cell, gy * cell, cell, cell);
    ctx.font = `${cell}px serif`;
    ctx.fillText('🏆', gx * cell + cell / 2, gy * cell + cell / 2);
  }

  function bindControls() {
    document.querySelectorAll('.dpad-btn').forEach(b => {
      b.addEventListener('click', () => {
        const d = b.dataset.d;
        if (d === 'up') move(0, -1);
        if (d === 'down') move(0, 1);
        if (d === 'left') move(-1, 0);
        if (d === 'right') move(1, 0);
      });
    });
    window._mazeKey = (e) => {
      const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      const d = dir[e.key];
      if (d) { e.preventDefault(); move(d[0], d[1]); }
    };
    document.addEventListener('keydown', window._mazeKey);
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
    setTimeout(nextRound, 1100);
  }

  function finish() {
    if (window._mazeKey) document.removeEventListener('keydown', window._mazeKey);
    const st = window._gameState;
    const rec = P2G.players.finish(st, { levelLabel: P2G.levelLabel(st.level) });
    P2G.players.showResult(st, rec);
  }

  return { start, move };
})();