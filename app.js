/* ===== Play2Grow Core App (router + shared UI) ===== */
window.P2G = window.P2G || {};

P2G.app = {
  routes: {},
  current: null,
  register(name, fn) { this.routes[name] = fn; },
  async go(name, params) {
    // stop any running game interval / keyboard listener
    if (P2G.players && P2G.players.cleanupTimer) P2G.players.cleanupTimer();
    if (window._mazeKey) { document.removeEventListener('keydown', window._mazeKey); window._mazeKey = null; }
    P2G.current = { name, params: params || {} };
    const main = document.getElementById('main-content');
    // scroll top
    window.scrollTo(0, 0);
    const html = this.routes[name] ? await this.routes[name](params || {}) : '<p>404</p>';
    main.innerHTML = html;
    // post-render hooks defined by pages via data-render
    main.querySelectorAll('[data-render]').forEach(el => {
      const fn = window[el.getAttribute('data-render')];
      if (typeof fn === 'function') fn(el, params || {});
    });
    // bind back button
    main.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        const a = el.getAttribute('data-action');
        if (a.startsWith('go:')) P2G.app.go(a.split(':')[1]);
      });
    });
    this.refresh();
    P2G.nav.renderTopNav();
  },
  refresh() {
    P2G.i18n.applyLang();
  }
};

// ---- Navigation / top bar ----
P2G.nav = {
  renderTopNav() {
    const nav = document.getElementById('top-nav');
    const session = P2G.data.getSession();
    let html = '';
    const t = P2G.i18n.t;
    if (session) {
      html += `<a href="#games" class="nav-link" data-nav="games">${t('navGames')}</a>`;
      html += `<a href="#dashboard" class="nav-link" data-nav="dashboard">${t('navDashboard')}</a>`;
      html += `<a href="#logout" class="nav-link" data-nav="logout">${t('navLogout')}</a>`;
    } else {
      html += `<a href="#home" class="nav-link" data-nav="home">${t('navHome')}</a>`;
    }
    nav.innerHTML = html;
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const h = link.getAttribute('data-nav');
        if (h === 'logout') {
          P2G.data.clearSession();
          P2G.app.go('home');
        } else if (h === 'home') P2G.app.go('home');
        else if (h === 'games') P2G.app.go('hub');
        else if (h === 'dashboard') P2G.app.go('dashboard');
      });
    });
    // mark active
    const name = P2G.current && P2G.current.name;
    const map = { home: 'home', hub: 'games', dashboard: 'dashboard' };
    nav.querySelectorAll('.nav-link').forEach(l => {
      if (map[name] === l.getAttribute('data-nav')) l.classList.add('active');
    });
  }
};

// ---- Play as a selected child (used by child cards) ----
P2G.playAs = function (childId) {
  const session = P2G.data.getSession();
  if (!session || !session.parentId) { P2G.app.go('login'); return; }
  const child = P2G.data.getChild(childId);
  if (!child || child.parentId !== session.parentId) {
    P2G.toast('⚠️ ' + P2G.i18n.t('errNoChildren'));
    return;
  }
  P2G.data.setSession(session.parentId, childId);
  P2G.fx && P2G.fx.play('click');
  P2G.app.go('hub');
};

// ---- Toast helper ----
P2G.toast = function (msg) {
  let box = document.getElementById('toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-box';
    document.body.appendChild(box);
  }
  box.innerHTML = `<div class="toast">${msg}</div>`;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 2500);
};

// ---- Shared game session tracker (used by every game) ----
P2G.players = P2G.players || {};

// starts a game session: returns helpers, tracks timer
P2G.players.startSession = function ({ gameId, mode, startLevel }) {
  const state = {
    gameId, mode,
    level: startLevel,
    score: 0, errors: 0, attempts: 0, correctCount: 0,
    startTime: Date.now(),
    roundsCompleted: 0
  };
  return state;
};

P2G.players.cleanupTimer = function () {
  if (P2G.players._interval) { clearInterval(P2G.players._interval); P2G.players._interval = null; }
};

// Start a ticking timer that updates a given element id every second
P2G.players.startTimer = function (elId) {
  P2G.players.cleanupTimer();
  const el = document.getElementById(elId);
  let s = 0;
  const tick = () => {
    s++;
    if (el) el.textContent = P2G.i18n.t('time') + ': ' + s + 's';
  };
  tick();
  P2G.players._interval = setInterval(tick, 1000);
  return () => s;
};

// Finalize a session and save the performance record
P2G.players.finish = function (state, { levelLabel }) {
  P2G.players.cleanupTimer();
  const sec = Math.round((Date.now() - state.startTime) / 1000);
  const accuracy = state.attempts > 0
    ? Math.round((state.correctCount / state.attempts) * 100)
    : 0;
  const rec = {
    id: P2G.data.uid('perf'),
    childId: P2G.data.getSession() && P2G.data.getSession().childId,
    gameId: state.gameId,
    date: new Date().toISOString(),
    level: state.level,
    levelLabel: levelLabel || state.level,
    time: sec,
    errors: state.errors,
    attempts: state.attempts,
    accuracy,
    score: state.score,
    adaptive: state.mode === 'adaptive'
  };
  if (rec.childId) P2G.data.savePerf(rec);
  return rec;
};

// Renders a standard game shell with header + score chips + provided inner area
P2G.players.renderShell = function ({ titleKey, gameId, state, innerHTML, backAction }) {
  const t = P2G.i18n.t;
  const MAIN = document.getElementById('main-content');
  MAIN.innerHTML = `
    <div class="game-shell" data-shell="1">
      <div class="game-topbar">
        <button class="btn btn-soft" data-action="go:hub">← ${t('back')}</button>
        <h2 class="game-title">${titleKey ? t(titleKey) : ''}</h2>
        <div class="game-chips">
          <span class="chip chip-score">${t('score')}: <b id="chip-score">${state.score}</b></span>
          <span class="chip" id="chip-timer">${t('time')}: 0s</span>
          <span class="chip chip-acc">${t('accuracy')}: <b id="chip-acc">${state.attempts ? Math.round(state.correctCount / state.attempts * 100) : 0}%</b></span>
        </div>
      </div>
      <div id="game-instr" class="game-instr"></div>
      <div id="game-body">${innerHTML || ''}</div>
      <div id="game-ai" class="ai-banner"></div>
    </div>
  `;
  P2G.players._shell = MAIN;
  // start timer
  P2G.players.startTimer('chip-timer');
  return MAIN;
};

// Update chips
P2G.players.updateChips = function (state) {
  const t = P2G.i18n.t;
  const acc = document.getElementById('chip-acc');
  const sc = document.getElementById('chip-score');
  if (acc) acc.textContent = state.attempts ? Math.round(state.correctCount / state.attempts * 100) + '%' : '0%';
  if (sc) sc.textContent = state.score;
};

// Show AI coach banner
P2G.players.showAI = function ({ msgKey, leveled }) {
  const box = document.getElementById('game-ai');
  if (!box) return;
  const t = P2G.i18n.t;
  const lvl = leveled
    ? `<span class="ai-level ${leveled.up ? 'up' : 'down'}">${leveled.up ? t('aiLevelUp') : t('aiLevelDown')} (${t('lv' + leveled.newLevel)})</span>`
    : '';
  box.innerHTML = `<div class="ai-bubble">🤖 <span>${t(msgKey)}</span> ${lvl}</div>`;
  if (leveled && leveled.up) P2G.fx && P2G.fx.play('levelUp');
  else if (leveled && leveled.down) P2G.fx && P2G.fx.play('levelDown');
};

// Show final success screen
P2G.players.showResult = function (state, rec) {
  const t = P2G.i18n.t;
  const body = document.getElementById('game-body');
  const acc = rec.accuracy;
  const emoji = acc >= 85 ? '🏆' : acc >= 60 ? '🎉' : '💪';
  P2G.fx && P2G.fx.play('win');
  // AI analysis summary based on accuracy
  const aiMsgKey = acc >= 85 ? 'aiMessageHigh' : acc >= 60 ? 'aiMessageMid' : 'aiMessageLow';
  body.innerHTML = `
    <div class="result-card">
      <div class="result-emoji">${emoji}</div>
      <h3>${t('gameComplete')}</h3>
      <div class="result-stats">
        <div><span class="rs-label">${t('finalScore')}</span><span class="rs-val">${state.score}</span></div>
        <div><span class="rs-label">${t('accuracy')}</span><span class="rs-val">${acc}%</span></div>
        <div><span class="rs-label">${t('time')}</span><span class="rs-val">${rec.time}s</span></div>
        <div><span class="rs-label">${t('correct')}</span><span class="rs-val">${state.correctCount}</span></div>
        <div><span class="rs-label">${t('wrong')}</span><span class="rs-val">${state.errors}</span></div>
      </div>
      <div class="ai-final ai-bubble">🤖 ${aiMsgKey === 'aiMessageHigh' ? t('aiMessageHigh') : aiMsgKey === 'aiMessageMid' ? t('aiMessageMid') : t('aiMessageLow')}</div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="P2G.app.go('hub')">${t('playToHome')}</button>
      </div>
    </div>
  `;
};

// ---- Helpers: level labels ----
P2G.levelLabel = function (lv) {
  const t = P2G.i18n.t;
  return t('lv' + Math.max(1, Math.min(5, lv)));
};

P2G.modeLabel = function (mode) {
  return P2G.i18n.t('level' + mode.charAt(0).toUpperCase() + mode.slice(1));
};

/* ---- App boot ----
   Route table filled by pages/<page>.js files:
   P2G.app.register('home', renderLandingFn) etc.
*/
document.addEventListener('DOMContentLoaded', () => {
  P2G.i18n.applyLang();
  const h = location.hash.replace('#', '');
  const map = { games: 'hub', dashboard: 'dashboard', login: 'login', register: 'register', home: 'home', manage: 'manage' };
  const route = map[h];
  if (route) P2G.app.go(route); else P2G.app.go('home');
});