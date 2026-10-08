/* ===== Register / Login ===== */
window.P2G = window.P2G || {};

(function () {
  const t = (k) => P2G.i18n.t(k);

  function renderRegister() {
    return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>${t('regTitle')}</h2>
        <form id="reg-form" class="stack-form">
          <label>${t('regNameLabel')}</label>
          <input id="reg-name" type="text" placeholder="..." required>
          <label>${t('regEmailLabel')}</label>
          <input id="reg-email" type="email" required>
          <label>${t('regPassLabel')}</label>
          <input id="reg-pass" type="password" required>
          <button type="submit" class="btn btn-primary btn-block">${t('regBtn')}</button>
        </form>
        <p class="muted center">${t('regHaveAccount')} <a href="#login" onclick="P2G.app.go('login'); return false;">${t('loginTitle')}</a></p>
      </div>
    </div>
    `;
  }

  function renderLogin() {
    return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>${t('loginTitle')}</h2>
        <form id="login-form" class="stack-form">
          <label>${t('regEmailLabel')}</label>
          <input id="login-email" type="email" required>
          <label>${t('regPassLabel')}</label>
          <input id="login-pass" type="password" required>
          <button type="submit" class="btn btn-primary btn-block">${t('loginBtn')}</button>
        </form>
        <p class="muted center"><a href="#register" onclick="P2G.app.go('register'); return false;">${t('regTitle')}</a></p>
      </div>
    </div>
    `;
  }

  function bindRegister() {
    const form = document.getElementById('reg-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass = document.getElementById('reg-pass').value;
      if (!name || !email || !pass) return P2G.toast(t('errFillFields'));
      const exists = P2G.data.getParents().some(p => p.email.toLowerCase() === email.toLowerCase());
      if (exists) return P2G.toast(t('errEmailExists'));
      const parent = { id: P2G.data.uid('parent'), name, email, password: pass, childIds: [], createdAt: new Date().toISOString() };
      P2G.data.saveParent(parent);
      P2G.data.setSession(parent.id, null);
      P2G.toast(t('successRegister'));
      P2G.app.go('manage');
    });
  }

  function bindLogin() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value;
      const parent = P2G.data.findParent(email, pass);
      if (!parent) return P2G.toast(t('errLogin'));
      P2G.data.setSession(parent.id, null);
      P2G.toast('👋 ' + parent.name);
      P2G.app.go('manage');
    });
  }

  P2G.app.register('register', function () {
    setTimeout(bindRegister, 0);
    return renderRegister();
  });
  P2G.app.register('login', function () {
    setTimeout(bindLogin, 0);
    return renderLogin();
  });
})();