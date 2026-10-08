/* ===== Word Challenge ===== */
window.P2G = window.P2G || {};
P2G.games = P2G.games || {};

P2G.games.words = (() => {
  const MAX_QUESTIONS = 8;
  const BANK = {
    ar: [
      { w: 'قِطّ', e: '🐱' }, { w: 'كَلْب', e: '🐶' }, { w: 'شَمْس', e: '☀️' },
      { w: 'قَمَر', e: '🌙' }, { w: 'بَيْت', e: '🏠' }, { w: 'كُرَة', e: '⚽' },
      { w: 'وَرْدَة', e: '🌹' }, { w: 'سَيَّارَة', e: '🚗' }, { w: 'سَمَكَة', e: '🐟' },
      { w: 'نَجْمَة', e: '⭐' }, { w: 'سَحَابَة', e: '☁️' }, { w: 'مَطَر', e: '🌧️' }
    ],
    en: [
      { w: 'cat', e: '🐱' }, { w: 'dog', e: '🐶' }, { w: 'sun', e: '☀️' },
      { w: 'moon', e: '🌙' }, { w: 'house', e: '🏠' }, { w: 'ball', e: '⚽' },
      { w: 'rose', e: '🌹' }, { w: 'car', e: '🚗' }, { w: 'fish', e: '🐟' },
      { w: 'star', e: '⭐' }, { w: 'cloud', e: '☁️' }, { w: 'rain', e: '🌧️' }
    ]
  };
  let q = 0, ans = '', busy = false;

  function start() {
    q = 0; ans = ''; busy = false;
    window._gameState.roundsCompleted = 0;
    nextQ();
  }

  function maxLen(level) {
    return level <= 1 ? 3 : level === 2 ? 4 : level === 3 ? 5 : level === 4 ? 6 : 9;
  }

  function nextQ() {
    const st = window._gameState;
    q++;
    if (q > MAX_QUESTIONS) return finish();
    st.roundsCompleted = q;

    const lang = P2G.i18n.getLang();
    const pool = BANK[lang] || BANK.en;
    const limited = pool.filter(x => x.w.length <= maxLen(st.level));
    const src = limited.length >= 2 ? limited : pool;

    const target = src[Math.floor(Math.random() * src.length)];
    ans = target.w;
    const opts = options(src, target);

    const body = document.getElementById('game-body');
    body.innerHTML = `
      <div class="word-pic">${target.e}</div>
      <div class="word-question">${P2G.i18n.t('instrWords')}</div>
      <div class="answer-grid ${lang === 'ar' ? 'dir-rtl' : ''}">
        ${opts.map(o => `<button class="answer-btn word-opt ${lang === 'ar' ? 'ar-word' : 'en-word'}" onclick="P2G.games.words.answer(this, '${o.replace(/'/g, "\\'")}')">${o}</button>`).join('')}
      </div>
      <div class="q-progress">${q} / ${MAX_QUESTIONS}</div>
    `;
  }

  function options(src, target) {
    const set = new Set([target.w]);
    const others = src.filter(x => x.w !== target.w);
    while (set.size < 4 && others.length) {
      const o = others[Math.floor(Math.random() * others.length)];
      if (!set.has(o.w)) set.add(o.w);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  function answer(btn, val) {
    const st = window._gameState;
    if (busy) return;
    busy = true;
    const btns = document.querySelectorAll('.word-opt');
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
    const oldLv = st.level; const newLv = P2G.ai.adaptLevel(oldLv, recent);
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