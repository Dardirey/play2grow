/* ===== Manage children: add new child / select who plays ===== */
window.P2G = window.P2G || {};

(function () {
  const t = (k) => P2G.i18n.t(k);

  const CHILD_COLORS = ['#FFE66D', '#FF6B6B', '#4ECDC4', '#6C5CE7', '#FD79A8', '#FDCB6E', '#00B894', '#a29bfe', '#55efc4', '#fab1a0'];

  function color(i) { return CHILD_COLORS[i % CHILD_COLORS.length]; }

  function render() {
    const session = P2G.data.getSession();
    if (!session || !session.parentId) { P2G.app.go('login'); return ''; }
    const parent = P2G.data.findParentById(session.parentId);
    const kids = P2G.data.getChildren(session.parentId);
    const avatars = P2G.data.AVATARS;

    const kidCards = kids.length ? kids.map(k => `
      <div class="child-card">
        <div class="child-avatar" style="background:${k.color}">${k.avatar}</div>
        <div class="child-info">
          <b>${k.name}</b>
          <span>${k.age} ${t('childAgeLabel')} • ${t('childGradeLabel')}: ${k.grade}</span>
          <span class="muted small">${P2G.data.getPerfForChild(k.id).length} ${t('dashGamesPlayed').toLowerCase()}</span>
        </div>
        <button class="btn btn-primary" onclick="P2G.playAs('${k.id}')">🎮 ${t('playBtn')}</button>
      </div>`).join('') : `<p class="muted center">${t('errNoChildren')}</p>`;

    return `
    <div class="manage-wrap">
      <h2>👋 ${parent ? parent.name : ''}</h2>
      <p class="muted">${t('selectChildTitle')}</p>
      <div class="child-list">${kidCards}</div>

      <details class="add-child-details">
        <summary class="btn btn-secondary">➕ ${t('addChildBtn')}</summary>
        <div class="auth-card add-child-form" style="max-width:520px; margin-top:1rem;">
          <div class="stack-form">
            <label>${t('childNameLabel')}</label>
            <input id="child-name" type="text" required>
            <div class="form-row">
              <div><label>${t('childAgeLabel')}</label><input id="child-age" type="number" min="3" max="14" value="6" required></div>
              <div><label>${t('childGradeLabel')}</label><input id="child-grade" type="text" value="1" required></div>
            </div>
            <label>${t('childAvatarLabel')}</label>
            <div class="avatar-picker" id="avatar-picker">
              ${avatars.map((a, i) => `<span class="avatar-opt ${i === 0 ? 'selected' : ''}" data-av="${a}" data-color="${color(i)}" style="background:${color(i)}">${a}</span>`).join('')}
            </div>
            <button class="btn btn-primary btn-block" id="save-child">${t('addChildBtn')}</button>
          </div>
        </div>
      </details>
    </div>
    `;
  }

  function bind() {
    const picker = document.getElementById('avatar-picker');
    let chosen = { av: null, color: null };
    if (picker) {
      const first = picker.querySelector('.avatar-opt.selected');
      if (first) { chosen.av = first.dataset.av; chosen.color = first.dataset.color; }
      picker.querySelectorAll('.avatar-opt').forEach(el => {
        el.addEventListener('click', () => {
          picker.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
          chosen.av = el.dataset.av;
          chosen.color = el.dataset.color;
        });
      });
    }
    const btn = document.getElementById('save-child');
    if (btn) btn.addEventListener('click', () => {
      const session = P2G.data.getSession();
      const name = document.getElementById('child-name').value.trim();
      const age = document.getElementById('child-age').value;
      const grade = document.getElementById('child-grade').value.trim();
      if (!name) return P2G.toast(t('errFillFields'));
      if (!chosen.av) return P2G.toast(t('childAvatarLabel'));
      const child = {
        id: P2G.data.uid('child'), parentId: session.parentId,
        name, age: parseInt(age), grade, avatar: chosen.av, color: chosen.color,
        createdAt: new Date().toISOString()
      };
      P2G.data.saveChild(child);
      P2G.toast('✅ ' + child.name);
      P2G.app.go('manage');
    });
  }

  P2G.app.register('manage', function () {
    setTimeout(bind, 0);
    return render();
  });
})();