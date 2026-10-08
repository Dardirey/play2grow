/* ===== Parent Dashboard ===== */
window.P2G = window.P2G || {};

(function () {
  const t = (k) => P2G.i18n.t(k);

  const SKILL_META = {
    memory: { name: 'dashSkillMemory', icon: '🧠', color: '#FF6B6B' },
    math: { name: 'dashSkillMath', icon: '➕', color: '#4ECDC4' },
    logic: { name: 'dashSkillLogic', icon: '🧩', color: '#6C5CE7' },
    words: { name: 'dashSkillWords', icon: '📝', color: '#FDCB6E' },
    creativity: { name: 'dashSkillCreativity', icon: '🎨', color: '#FD79A8' },
    maze: { name: 'dashSkillMaze', icon: '🗺️', color: '#00B894' },
    attention: { name: 'dashSkillAttention', icon: '🔍', color: '#f39c12' },
    time: { name: 'dashSkillTime', icon: '⏰', color: '#3498db' }
  };

  // ---- Achievements ----
  function achievements(childId) {
    const perfs = P2G.data.getPerfForChild(childId);
    const out = [];
    if (perfs.length >= 1) out.push({ key: 'achFirst', got: true });
    else out.push({ key: 'achFirst', got: false });
    if (perfs.filter(p => p.gameId === 'maze').length >= 2) out.push({ key: 'achExplorer', got: true });
    else out.push({ key: 'achExplorer', got: false });
    if (perfs.filter(p => p.gameId === 'attention').length >= 2) out.push({ key: 'achSharp', got: true });
    else out.push({ key: 'achSharp', got: false });
    const fast = perfs.filter(p => p.accuracy >= 80 && p.time <= 25).length >= 2;
    out.push(fast ? { key: 'achSpeed', got: true } : { key: 'achSpeed', got: false });
    if (perfs.some(p => p.accuracy >= 95)) out.push({ key: 'achPerfect', got: true });
    else out.push({ key: 'achPerfect', got: false });
    if (perfs.some(p => p.adaptive)) out.push({ key: 'achAdapt', got: true });
    else out.push({ key: 'achAdapt', got: false });
    return out;
  }

  // ---- PDF / print export ----
  function buildPrintReport(childId, childName) {
    const t = P2G.i18n.t;
    const profile = P2G.ai.profileForChild(childId);
    const weekly = P2G.ai.weeklyReport(childId);
    const overall = P2G.ai.overallLevel(profile);
    const perfs = P2G.data.getPerfForChild(childId);
    const avgAcc = perfs.length ? Math.round(perfs.reduce((a, p) => a + p.accuracy, 0) / perfs.length) : 0;
    const dev = P2G.ai.developmentPercent(childId);

    const skillRows = profile.skills.map(s => {
      const meta = SKILL_META[s.gameId];
      return `<tr><td>${meta.icon} ${t(meta.name)}</td><td>${s.score == null ? '—' : s.score + '%'}</td><td>${s.level ? t('skill' + s.level.charAt(0).toUpperCase() + s.level.slice(1)) : '—'}</td></tr>`;
    }).join('');

    return `
    <div class="print-report">
      <h1>${t('printTitle')} — ${childName}</h1>
      <div class="pr-row"><span>${t('dashLevel')}</span><b>${overall.label}</b></div>
      <div class="pr-row"><span>${t('dashGamesPlayed')}</span><b>${perfs.length}</b></div>
      <div class="pr-row"><span>${t('dashAvgAccuracy')}</span><b>${avgAcc}%</b></div>
      <div class="pr-row"><span>${t('dashProgress')}</span><b>${dev == null ? '—' : '+' + dev + '%'}</b></div>
      <h3>${t('dashOverall')}</h3>
      <table><thead><tr><th>${t('step2Title')}</th><th>${t('dashLevel')}</th><th>${t('dashOverall')}</th></tr></thead><tbody>${skillRows}</tbody></table>
      <h3>${t('dashWeekly')}</h3>
      <table><thead><tr><th>${t('step2Title')}</th><th>${t('dashLastWeek')}</th><th>${t('dashThisWeek')}</th><th>${t('dashDiff')}</th></tr></thead><tbody>
        ${Object.keys(weekly.perGame).map(g => {
          const d = weekly.perGame[g];
          if (!d) return '';
          const diff = (d.thisAcc != null && d.lastAcc != null) ? ((d.thisAcc - d.lastAcc) > 0 ? '+' : '') + (d.thisAcc - d.lastAcc) + '%' : (d.thisAcc != null ? t('dashNew') : '—');
          return `<tr><td>${SKILL_META[g].icon} ${t(SKILL_META[g].name)}</td><td>${d.lastAcc != null ? d.lastAcc + '%' : '—'}</td><td>${d.thisAcc != null ? d.thisAcc + '%' : '—'}</td><td>${diff}</td></tr>`;
        }).join('') || `<tr><td colspan="4">${t('dashNoData')}</td></tr>`}
      </tbody></table>
      <p style="margin-top:20px;color:#888">Play2Grow 🚀 — ${new Date().toLocaleDateString()}</p>
    </div>`;
  }

  P2G.exportReport = function (childId) {
    const child = P2G.data.getChild(childId);
    if (!child) return;
    const w = window.open('', '_blank', 'width=800,height=600');
    w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${P2G.i18n.t('printTitle')}</title></head><body>${buildPrintReport(childId, child.name)}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  function render() {
    const session = P2G.data.getSession();
    if (!session) { P2G.app.go('login'); return ''; }
    const kids = P2G.data.getChildren(session.parentId);
    if (!kids.length) { P2G.app.go('manage'); return ''; }

    // selected child
    const selId = (session.childId && P2G.data.getChild(session.childId) && P2G.data.getChild(session.childId).parentId === session.parentId)
      ? session.childId : kids[0].id;
    const child = P2G.data.getChild(selId);

    const profile = P2G.ai.profileForChild(child.id);
    const strengths = profile.skills.filter(s => s.level === 'strong');
    const weaknesses = profile.skills.filter(s => s.level === 'weak');
    const none = profile.skills.filter(s => s.score == null);
    const recs = P2G.ai.recommendGames(profile);
    const overall = P2G.ai.overallLevel(profile);
    const dev = P2G.ai.developmentPercent(child.id);
    const weekly = P2G.ai.weeklyReport(child.id);
    const ach = achievements(child.id);

    const perfs = P2G.data.getPerfForChild(child.id);
    const avgAcc = perfs.length ? Math.round(perfs.reduce((a, p) => a + p.accuracy, 0) / perfs.length) : 0;

    // skills bars
    const skillBars = profile.skills.map(s => {
      const meta = SKILL_META[s.gameId];
      const pct = s.score == null ? 0 : s.score;
      return `
        <div class="skill-row">
          <span class="skill-icon">${meta.icon}</span>
          <div class="skill-name">${t(meta.name)}</div>
          <div class="skill-bar"><div class="skill-fill ${s.level || 'new'}" style="width:${pct}%;background:${meta.color}"></div></div>
          <span class="skill-val">${s.score == null ? '—' : s.score + '%'}</span>
          <span class="skill-tag ${s.level || 'tag-new'}">${s.level ? t('skill' + s.level.charAt(0).toUpperCase() + s.level.slice(1)) : '✨'}</span>
        </div>`;
    }).join('');

    // strength / weakness chips
    const strChips = strengths.length
      ? strengths.map(s => `<span class="tag tag-good">${SKILL_META[s.gameId].icon} ${t(SKILL_META[s.gameId].name)}</span>`).join('')
      : `<p class="muted small">${t('dashNoStrengths')}</p>`;
    const wkNess = weaknesses.length
      ? weaknesses.map(s => `<span class="tag tag-low">${SKILL_META[s.gameId].icon} ${t(SKILL_META[s.gameId].name)}</span>`).join('')
      : `<p class="muted small">${none.length ? '✨' + t('dashNoStrengths') : t('skillStrong')}</p>`;

    const sug = recs.length ? recs.map(r => {
      const meta = SKILL_META[r.gameId];
      const label = r.type === 'practice' ? t('suggestPractice') : r.type === 'challenge' ? t('suggestChallenge') : t('chooseGame');
      return `<div class="sug-item"><span>${meta.icon}</span><b>${t(meta.name)}</b><span class="muted">${label} — ${t('lv' + r.level)}</span></div>`;
    }).join('') : `<p class="muted">${t('dashNoStrengths')}</p>`;

    // weekly table
    const weekRows = Object.keys(weekly.perGame).map(g => {
      const d = weekly.perGame[g];
      if (!d) return '';
      const meta = SKILL_META[g];
      const diff = (d.thisAcc != null && d.lastAcc != null)
        ? (d.thisAcc - d.lastAcc) : (d.thisAcc != null ? t('dashNew') : '—');
      const diffCls = typeof diff === 'number' ? (diff >= 0 ? 'pos' : 'neg') : 'new';
      return `<tr>
        <td>${meta.icon} ${t(meta.name)}</td>
        <td>${d.lastAcc != null ? d.lastAcc + '%' : '—'}</td>
        <td>${d.thisAcc != null ? d.thisAcc + '%' : '—'}</td>
        <td class="${diffCls}">${typeof diff === 'number' ? (diff > 0 ? '+' : '') + diff + '%' : diff}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="4" class="muted">${t('dashNoData')}</td></tr>`;

    const overallAcc = weekly.thisAcc != null ? weekly.thisAcc : avgAcc;

    return `
    <section class="dash">
      <div class="dash-head">
        <h1>${t('dashTitle')}</h1>
        <div class="dash-head-actions">
          <select id="dash-child" class="select">
            ${kids.map(k => `<option value="${k.id}" ${k.id === selId ? 'selected' : ''}>${k.avatar} ${k.name}</option>`).join('')}
          </select>
          <button class="btn btn-export" onclick="P2G.exportReport('${selId}')">🖨️ ${t('exportPdf')}</button>
        </div>
      </div>

      <div class="dash-cards">
        <div class="dash-card card-level"><span class="dc-icon">🏅</span><div><span class="dc-label">${t('dashLevel')}</span><b>${overall.label}</b></div></div>
        <div class="dash-card"><span class="dc-icon">📈</span><div><span class="dc-label">${t('dashProgress')}</span><b>${dev == null ? '—' : '+' + dev + '%'}</b></div></div>
        <div class="dash-card"><span class="dc-icon">🎮</span><div><span class="dc-label">${t('dashGamesPlayed')}</span><b>${perfs.length}</b></div></div>
        <div class="dash-card"><span class="dc-icon">🎯</span><div><span class="dc-label">${t('dashAvgAccuracy')}</span><b>${overallAcc}%</b></div></div>
      </div>

      <div class="dash-grid2">
        <div class="panel">
          <h3>${t('dashOverall')}</h3>
          ${skillBars}
        </div>
        <div class="panel">
          <h3>${t('dashStrengths')}</h3>
          <div class="chips">${strChips}</div>
          <h3 style="margin-top:1rem">${t('dashWeaknesses')}</h3>
          <div class="chips">${wkNess}</div>
        </div>
      </div>

      <div class="panel">
        <h3>🏅 ${t('achievements')}</h3>
        <div class="ach-row">
          ${ach.map(a => `<span class="ach ${a.got ? '' : 'locked'}"><span class="ach-ico">${a.got ? '✅' : '🔒'}</span>${t(a.key)}</span>`).join('')}
        </div>
      </div>

      <div class="panel">
        <h3>💡 ${t('dashSuggested')}</h3>
        <div class="sug-grid">${sug}</div>
      </div>

      <div class="panel">
        <h3>📅 ${t('dashWeekly')}</h3>
        <table class="week-table">
          <thead><tr>
            <th>${t('step2Title')}</th>
            <th>${t('dashLastWeek')}</th>
            <th>${t('dashThisWeek')}</th>
            <th>${t('dashDiff')}</th>
          </tr></thead>
          <tbody>${weekRows}</tbody>
        </table>
      </div>
    </section>
    `;
  }

  function bind() {
    const sel = document.getElementById('dash-child');
    if (sel) sel.addEventListener('change', function () {
      const session = P2G.data.getSession();
      session.childId = this.value;
      P2G.data.setSession(session.parentId, session.childId);
      P2G.app.go('dashboard');
    });
  }

  P2G.app.register('dashboard', function () {
    setTimeout(bind, 0);
    return render();
  });
})();