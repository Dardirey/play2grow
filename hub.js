/* ===== Games Hub: choose game + difficulty ===== */
window.P2G = window.P2G || {};

(function () {
  const t = (k) => P2G.i18n.t(k);

  const GAMES = [
    { id: 'memory', icon: '🧠', nameKey: 'gMemory', desc: 'instrMemory', color: '#FF6B6B' },
    { id: 'logic', icon: '🧩', nameKey: 'gLogic', desc: 'instrLogic', color: '#6C5CE7' },
    { id: 'math', icon: '➕', nameKey: 'gMath', desc: 'instrMath', color: '#4ECDC4' },
    { id: 'words', icon: '📝', nameKey: 'gWords', desc: 'instrWords', color: '#FDCB6E' },
    { id: 'creativity', icon: '🎨', nameKey: 'gCreativity', desc: 'instrCreativity', color: '#FD79A8' },
    { id: 'maze', icon: '🗺️', nameKey: 'gMaze', desc: 'instrMaze', color: '#00B894' },
    { id: 'attention', icon: '🔍', nameKey: 'gAttention', desc: 'instrAttention', color: '#f39c12' },
    { id: 'time', icon: '⏰', nameKey: 'gTime', desc: 'instrTime', color: '#3498db' }
  ];

  const MODES = ['easy', 'medium', 'hard', 'adaptive'];
const MODE_KEY = { easy: 'diffEasy', medium: 'diffMedium', hard: 'diffHard', adaptive: 'diffAdaptive' };

  function skillBadge(childId, gameId) {
    const score = childId ? P2G.ai.skillScore(childId, gameId) : null;
    const best = childId ? P2G.data.getBest(childId, gameId) : null;
    let html = '';
    if (score == null) html = '<span class="pill pill-new">✨</span>';
    else {
      const lvl = P2G.ai.classify(score);
      const cls = lvl === 'strong' ? 'pill-good' : lvl === 'average' ? 'pill-mid' : 'pill-low';
      html = `<span class="pill ${cls}" title="AI accuracy">${score}%</span>`;
    }
    if (best) html += `<span class="pill pill-best" title="Best">🏆 ${best.score}</span>`;
    return html;
  }

  function render() {
    const session = P2G.data.getSession();
    const parent = session && session.parentId ? P2G.data.findParentById(session.parentId) : null;
    const child = session && session.childId ? P2G.data.getChild(session.childId) : null;
    const isGuest = !child;
    const name = child ? child.name : t('chooseGame');

    const guestBanner = isGuest ? `
      <div class="guest-banner">
        👋 ${t('selectChildTitle')} ${session ? '' : '— ' + t('btnParent')}
        <div class="guest-actions">
          ${session ? `<button class="btn btn-soft btn-sm" onclick="P2G.app.go('manage')">👥 ${t('addChildBtn')}</button>` :
            `<button class="btn btn-primary btn-sm" onclick="P2G.app.go('register')">${t('btnStart')}</button>
             <button class="btn btn-soft btn-sm" onclick="P2G.app.go('login')">${t('loginBtn')}</button>`}
        </div>
        <p class="small muted">🎮 ${t('chooseGame')} — ${isGuest ? 'Guest' : ''}</p>
      </div>` : '';

    return `
    <section class="hub">
      <div class="hub-head">
        <h1>${t('welcomeChild')} ${child ? child.avatar + ' ' + child.name : '👶'} 👋</h1>
        <p class="muted">${t('chooseGame')}</p>
        ${child ? `<button class="btn btn-outline btn-sm" onclick="P2G.app.go('manage')">👥 ${t('selectChildTitle')}</button>` : ''}
      </div>
      ${guestBanner}

      <div class="hub-grid">
        ${GAMES.map(g => `
          <div class="game-tile" style="--tcol:${g.color}">
            <div class="tile-top">
              <span class="tile-icon">${g.icon}</span>
              <span class="tile-badges">${skillBadge(session && session.childId, g.id)}</span>
            </div>
            <h3>${t(g.nameKey)}</h3>
            <p class="small muted">${t(g.desc)}</p>
            <div class="mode-select" data-game="${g.id}">
              ${MODES.map(m => `
                <label class="mode-opt">
                  <input type="radio" name="mode-${g.id}" value="${m}" ${m === 'medium' ? 'checked' : ''}>
                  <span class="mode-chip ${m}">${t(MODE_KEY[m])}${m === 'adaptive' ? ' <em>🤖</em>' : ''}</span>
                </label>`).join('')}
            </div>
            <button class="btn btn-primary btn-block play-btn" data-game="${g.id}">▶ ${t('playBtn')}</button>
          </div>`).join('')}
      </div>
    </section>
    `;
  }

  function bind() {
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const session = P2G.data.getSession();
        if (!session || !session.childId) {
          P2G.fx && P2G.fx.play('click');
          P2G.toast('👶 Guest — ' + t('errNoChildren') + '. ' + t('btnParent'));
        }
        const game = btn.dataset.game;
        const mode = document.querySelector(`input[name="mode-${game}"]:checked`).value;
        const level = P2G.ai.levelFromMode(mode);
        P2G.app.go('game', { game, mode, level });
      });
    });
  }

  P2G.app.register('hub', function () {
    setTimeout(bind, 0);
    return render();
  });

  // ---- Game page dispatcher ----
  P2G.app.register('game', function (params) {
    const { game, mode, level } = params;
    const dispatcher = {
      memory: 'P2G.games.memory.start',
      logic: 'P2G.games.logic.start',
      math: 'P2G.games.math.start',
      words: 'P2G.games.words.start',
      creativity: 'P2G.games.creativity.start',
      maze: 'P2G.games.maze.start',
      attention: 'P2G.games.attention.start',
      time: 'P2G.games.time.start'
    };
    const fn = dispatcher[game];
    if (!fn) return '<p>404</p>';
    // render shell directly into the DOM, then return its markup so app.go reassign is a no-op
    P2G.players.renderShell({
      titleKey: 'g' + game.charAt(0).toUpperCase() + game.slice(1),
      gameId: game,
      state: P2G.players.startSession({ gameId: game, mode, startLevel: level }),
      innerHTML: '<div class="loading">⏳...</div>'
    });
    // set instruction
    const instr = document.getElementById('game-instr');
    if (instr) instr.innerHTML = `<span class="instr-icon">🎯</span> ${P2G.i18n.t('instr' + game.charAt(0).toUpperCase() + game.slice(1))}`;
    // expose state to game
    const st = P2G.players._state = {
      ...P2G.players.startSession({ gameId: game, mode, startLevel: level }),
      mode, game
    };
    // store on data-session for the specific game to use
    window._gameState = st;
    // dispatch after render (setTimeout to let DOM settle)
    setTimeout(() => { eval(fn)(); }, 10);
    return document.getElementById('main-content').innerHTML;
  });
})();