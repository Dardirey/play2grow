/* ===== Play2Grow AI Coach Engine ===== */
/*
  The AI is a rule-based intelligent coach that:
  1. Computes a skill profile per child from performance records.
  2. Adapts game difficulty in real time ("Adaptive AI" mode).
  3. Detects strengths / weaknesses and suggests games.
  4. Generates a weekly report for the parent.
*/
window.P2G = window.P2G || {};

P2G.ai = (() => {

  // Skill score = accuracy-weighted recency. Recent performances count more.
  function skillScore(childId, gameId) {
    const perfs = P2G.data.getPerfByGame(childId, gameId);
    if (perfs.length === 0) return null;

    // score per record: accuracy (+ time bonus)
    const sc = perfs.map(p => {
      const accW = (p.accuracy || 0) / 100;
      // time bonus: 10 if fast (<=10s per q), 0 if slow. normalized 0-10
      const timeBonus = 10 * Math.max(0, 1 - ((p.time || 0) / 60));
      return accW * 90 + timeBonus;
    });

    // recency weighting (exponential)
    const n = sc.length;
    let sum = 0, wsum = 0;
    sc.forEach((v, i) => {
      const w = Math.pow(0.85, n - 1 - i); // recent = higher weight
      sum += v * w;
      wsum += w;
    });
    return Math.round(sum / wsum);
  }

  function classify(score) {
    if (score == null) return null;
    if (score >= 80) return 'strong';
    if (score >= 60) return 'average';
    return 'weak';
  }

  function profileForChild(childId) {
    const skills = ['memory', 'math', 'logic', 'words', 'creativity', 'maze', 'attention', 'time'];
    return {
      childId,
      skills: skills.map(g => ({
        gameId: g,
        score: skillScore(childId, g),
        level: classify(skillScore(childId, g))
      }))
    };
  }

  // ----- Adaptive difficulty -----
  // Difficulty is an integer level 1..5.
  // Map: user picks easy(1-2)/medium(3)/hard(4-5); adaptive starts at 3 and drifts.
  function levelFromMode(mode) {
    switch (mode) {
      case 'easy': return 1;
      case 'medium': return 3;
      case 'hard': return 5;
      case 'adaptive': return 3;
      default: return 3;
    }
  }

  // After a completed round, produce new level for adaptive mode only.
  function adaptLevel(oldLevel, accuracy) {
    if (accuracy >= 85) return Math.min(5, oldLevel + 1);
    if (accuracy <= 55) return Math.max(1, oldLevel - 1);
    return oldLevel;
  }

  function adaptiveSummary(messageKey, levelChanged, newLevel) {
    return {
      message: messageKey,
      levelChanged,
      newLevel,
      mode: 'adaptive'
    };
  }

  // ----- Recommendations -----
  function recommendGames(profile) {
    const recs = [];
    // weak skills -> practice the game at lower level
    profile.skills.filter(s => s.level === 'weak').forEach(s => {
      recs.push({ gameId: s.gameId, type: 'practice', level: 1 });
    });
    // strong skills -> challenge at higher level
    profile.skills.filter(s => s.level === 'strong').forEach(s => {
      recs.push({ gameId: s.gameId, type: 'challenge', level: 5 });
    });
    // never played / no data -> try out
    profile.skills.filter(s => s.score == null).forEach(s => {
      recs.push({ gameId: s.gameId, type: 'try', level: 1 });
    });
    return recs.slice(0, 6);
  }

  // ----- Overall level -----
  function overallLevel(profile) {
    const scores = profile.skills.map(s => s.score).filter(s => s != null);
    if (scores.length === 0) return { label: '—', value: null };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg >= 85) return { label: 'متقدم / Advanced', value: 'advanced' };
    if (avg >= 70) return { label: 'جيد جدًا / Very Good', value: 'verygood' };
    if (avg >= 55) return { label: 'جيد / Good', value: 'good' };
    return { label: 'مبتدئ / Beginner', value: 'beginner' };
  }

  // ----- Weekly report -----
  // Split performance into this week vs previous week.
  function weeklyReport(childId) {
    const now = new Date();
    const startThis = new Date(now); startThis.setHours(0,0,0,0); startThis.setDate(startThis.getDate() - startThis.getDay()); // start of week (Sun)
    const startLast = new Date(startThis); startLast.setDate(startLast.getDate() - 7);
    const endLast = new Date(startThis); endLast.setDate(endLast.getDate() - 1); endLast.setHours(23,59,59,999);

    const thisWeek = P2G.data.getPerfInRange(childId, startThis, new Date());
    const lastWeek = P2G.data.getPerfInRange(childId, startLast, endLast);

    const avgAcc = list => list.length ? Math.round(list.reduce((a, b) => a + b.accuracy, 0) / list.length) : null;
    const avgTime = list => list.length ? Math.round(list.reduce((a, b) => a + b.time, 0) / list.length) : null;

    const thisAcc = avgAcc(thisWeek);
    const lastAcc = avgAcc(lastWeek);
    const thisTime = avgTime(thisWeek);
    const lastTime = avgTime(lastWeek);

    let diff = null;
    if (thisAcc != null && lastAcc != null) diff = thisAcc - lastAcc;
    else if (thisAcc != null && lastAcc == null) diff = null; // new week

    // per-game improvement
    const games = ['memory', 'math', 'logic', 'words', 'creativity', 'maze', 'attention', 'time'];
    const perGame = {};
    games.forEach(g => {
      const tw = thisWeek.filter(p => p.gameId === g);
      const lw = lastWeek.filter(p => p.gameId === g);
      const a = avgAcc(tw), b = avgAcc(lw);
      if (a != null || b != null) perGame[g] = { thisAcc: a, lastAcc: b, played: tw.length };
    });

    return {
      thisWeek, lastWeek,
      thisAcc, lastAcc, thisTime, lastTime, diff,
      perGame,
      thisCount: thisWeek.length,
      lastCount: lastWeek.length
    };
  }

  // Development percentage: compare current avg accuracy to first ever avg accuracy
  function developmentPercent(childId) {
    const perfs = P2G.data.getPerfForChild(childId);
    if (perfs.length < 2) return null;
    const firstHalf = perfs.slice(0, Math.ceil(perfs.length / 2));
    const secondHalf = perfs.slice(Math.ceil(perfs.length / 2));
    const a1 = firstHalf.reduce((s, p) => s + p.accuracy, 0) / firstHalf.length;
    const a2 = secondHalf.reduce((s, p) => s + p.accuracy, 0) / secondHalf.length;
    // % improvement relative to base, min 0
    return Math.max(0, Math.round(((a2 - a1) / (a1 || 1)) * 100));
  }

  return {
    skillScore, classify, profileForChild,
    levelFromMode, adaptLevel,
    recommendGames, overallLevel, weeklyReport, developmentPercent
  };
})();