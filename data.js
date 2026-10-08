/* ===== Play2Grow Data Layer (localStorage) ===== */
window.P2G = window.P2G || {};

P2G.data = (() => {
  const KEYS = {
    parents: 'p2g_parents',
    children: 'p2g_children',
    perf: 'p2g_performance',
    session: 'p2g_session'
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // ---- Parents ----
  function getParents() { return read(KEYS.parents, []); }
  function saveParent(p) {
    const list = getParents();
    list.push(p);
    write(KEYS.parents, list);
  }
  function findParent(email, pass) {
    return getParents().find(p => p.email.toLowerCase() === (email || '').toLowerCase() && p.password === pass);
  }
  function findParentById(id) {
    return getParents().find(p => p.id === id);
  }
  function updateParent(p) {
    const list = getParents().map(x => x.id === p.id ? p : x);
    write(KEYS.parents, list);
  }

  // ---- Session ----
  function setSession(parentId, childId) { write(KEYS.session, { parentId, childId }); }
  function getSession() { return read(KEYS.session, null); }
  function clearSession() { localStorage.removeItem(KEYS.session); }

  // ---- Children ----
  function getChildren(parentId) {
    return read(KEYS.children, []).filter(c => c.parentId === parentId);
  }
  function getAllChildren() { return read(KEYS.children, []); }
  function getChild(id) { return getAllChildren().find(c => c.id === id); }
  function saveChild(c) {
    const list = getAllChildren();
    list.push(c);
    write(KEYS.children, list);
  }
  function updateChild(c) {
    const list = getAllChildren().map(x => x.id === c.id ? c : x);
    write(KEYS.children, list);
  }

  // ---- Performance records ----
  // record: { id, childId, gameId, date, level, levelLabel, time, errors, attempts, accuracy, score, adaptive }
  function getPerf() { return read(KEYS.perf, []); }
  function savePerf(rec) {
    const list = getPerf();
    list.push(rec);
    write(KEYS.perf, list);
  }
  function getPerfForChild(childId) {
    return getPerf().filter(p => p.childId === childId).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  function getPerfByGame(childId, gameId) {
    return getPerfForChild(childId).filter(p => p.gameId === gameId);
  }
  function getPerfInRange(childId, from, to) {
    const fromT = new Date(from).getTime();
    const toT = new Date(to).getTime();
    return getPerfForChild(childId).filter(p => {
      const t = new Date(p.date).getTime();
      return t >= fromT && t <= toT;
    });
  }

  // best performance record for a game
  function getBest(childId, gameId) {
    const list = getPerfByGame(childId, gameId);
    if (!list.length) return null;
    let best = list[0];
    list.forEach(p => {
      if (p.accuracy > best.accuracy || (p.accuracy === best.accuracy && p.score > best.score)) best = p;
    });
    return best;
  }

  // avatar options
  const AVATARS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🦁', '🐸', '🐨', '🐯'];

  return {
    uid, AVATARS,
    getParents, saveParent, findParent, findParentById, updateParent,
    setSession, getSession, clearSession,
    getChildren, getAllChildren, getChild, saveChild, updateChild,
    getPerf, savePerf, getPerfForChild, getPerfByGame, getPerfInRange, getBest
  };
})();