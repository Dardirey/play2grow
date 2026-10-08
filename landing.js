/* ===== Landing Page ===== */
window.P2G = window.P2G || {};

(function () {
  const t = (k) => P2G.i18n.t(k);

  const GAME_META = [
    { id: 'memory', icon: '🧠', nameKey: 'gMemory', catKey: 'catMemory', color: '#FF6B6B' },
    { id: 'logic', icon: '🧩', nameKey: 'gLogic', catKey: 'catLogic', color: '#6C5CE7' },
    { id: 'math', icon: '➕', nameKey: 'gMath', catKey: 'catMath', color: '#4ECDC4' },
    { id: 'words', icon: '📝', nameKey: 'gWords', catKey: 'catWords', color: '#FDCB6E' },
    { id: 'creativity', icon: '🎨', nameKey: 'gCreativity', catKey: 'catCreativity', color: '#FD79A8' },
    { id: 'maze', icon: '🗺️', nameKey: 'gMaze', catKey: 'catMaze', color: '#00B894' },
    { id: 'attention', icon: '🔍', nameKey: 'gAttention', catKey: 'catAttention', color: '#f39c12' },
    { id: 'time', icon: '⏰', nameKey: 'gTime', catKey: 'catTime', color: '#3498db' }
  ];

  function render() {
    return `
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">${t('heroTitle')}</h1>
        <p class="hero-sub">${t('heroSub')}</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" data-action="go:register">${t('btnStart')}</button>
          <button class="btn btn-outline btn-lg" data-action="go:login">${t('btnParent')}</button>
        </div>
      </div>
      <div class="hero-art">
        <span style="font-size:6rem">👶✨</span>
        <span style="font-size:4rem">🤖</span>
        <span style="font-size:5rem">🎮</span>
      </div>
    </section>

    <section class="how-it-works">
      <h2 class="section-title">${t('howItWorks')}</h2>
      <div class="steps">
        <div class="step"><span class="step-num">1</span><div class="step-icon">📝</div><h3>${t('step1Title')}</h3><p>${t('step1Desc')}</p></div>
        <div class="step"><span class="step-num">2</span><div class="step-icon">🎮</div><h3>${t('step2Title')}</h3><p>${t('step2Desc')}</p></div>
        <div class="step"><span class="step-num">3</span><div class="step-icon">🤖</div><h3>${t('step3Title')}</h3><p>${t('step3Desc')}</p></div>
        <div class="step"><span class="step-num">4</span><div class="step-icon">📈</div><h3>${t('step4Title')}</h3><p>${t('step4Desc')}</p></div>
      </div>
    </section>

    <section class="games-preview">
      <h2 class="section-title">${t('gamesTitle')}</h2>
      <p class="section-sub">${t('gamesSub')}</p>
      <div class="preview-grid">
        ${GAME_META.map(g => `
          <div class="preview-card" style="--gcol:${g.color}">
            <div class="preview-icon">${g.icon}</div>
            <h4>${t(g.nameKey)}</h4>
            <span class="pill">${t(g.catKey)}</span>
          </div>`).join('')}
      </div>
    </section>

    <section class="ai-feature">
      <div class="ai-feature-card">
        <div class="ai-robot">🤖</div>
        <div>
          <h2>${t('aiFeatureTitle')}</h2>
          <p>${t('aiFeatureDesc')}</p>
          <div class="mode-demo">
            <span class="mode-tag easy">Easy</span>
            <span class="mode-tag medium">Medium</span>
            <span class="mode-tag hard">Hard</span>
            <span class="mode-tag adaptive">Adaptive AI</span>
          </div>
        </div>
      </div>
    </section>

    <section class="parent-cta">
      <h2>${t('parentDashTitle')}</h2>
      <p>${t('parentDashDesc')}</p>
      <button class="btn btn-primary btn-lg" data-action="go:register">${t('btnStart')}</button>
    </section>
    `;
  }

  P2G.app.register('home', render);
})();