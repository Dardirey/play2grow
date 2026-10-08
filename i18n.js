/* ===== Play2Grow i18n ===== */
window.P2G = window.P2G || {};

P2G.i18n = (() => {
  const dict = {
    ar: {
      brand: 'Play2Grow',
      tagline: 'التعلّم باللعب',
      footerText: '🎓 مشروع التخرج — منصة لاكتشاف وتنمية مواهب الأطفال بالذكاء الاصطناعي',
      langSwitch: 'English',
      // Landing
      heroTitle: 'اكتشف موهبة طفلك وهو يلعب!',
      heroSub: 'ألعاب ذكية تطور المهارات، والذكاء الاصطناعي يدرب طفلك ويرشده خطوة بخطوة.',
      btnStart: '🚀 ابدأ الآن',
      btnParent: 'تسجيل ولي الأمر',
      howItWorks: 'كيف تعمل المنصة؟',
      step1Title: 'تسجيل الطفل',
      step1Desc: 'ولي الأمر يسجّل الطفل ببياناته الأساسية.',
      step2Title: 'يلعب و يتعلم',
      step2Desc: 'الطفل يلعب ألعابًا تعليمية ممتعة.',
      step3Title: 'AI يحلّل الأداء',
      step3Desc: 'نتحكّم في الوقت والأخطاء والدقة ونحلّلها.',
      step4Title: 'تابع التطور',
      step4Desc: 'نظرة أولياء الأمور على التقرير الأسبوعي والتنمية.',
      gamesTitle: 'الألعاب الموجودة',
      gamesSub: '٨ ألعاب — كل لعبة تطور مهارة مختلفة',
      aiFeatureTitle: 'مدرب ذكي (AI Coach)',
      aiFeatureDesc: 'اختر Easy أو Medium أو Hard، أو جرّب Adaptive AI الذي يغيّر مستوى اللعبة أثناء اللعب حسب أداء طفلك.',
      parentDashTitle: 'لوحة ولي الأمر',
      parentDashDesc: 'مستوى الطفل، نقاط القوة، نقاط الضعف، نسبة التطور، الألعاب المقترحة، والتقرير الأسبوعي.',
      // Nav
      navHome: 'الرئيسية',
      navGames: 'الألعاب',
      navDashboard: 'لوحة ولي الأمر',
      navLogout: 'تسجيل الخروج',
      // Register
      regTitle: 'تسجيل ولي الأمر',
      regNameLabel: 'اسم ولي الأمر',
      regEmailLabel: 'البريد الإلكتروني',
      regPassLabel: 'كلمة المرور',
      regBtn: 'تسجيل',
      regHaveAccount: 'لدي حساب',
      loginTitle: 'تسجيل الدخول',
      loginBtn: 'دخول',
      childNameLabel: 'اسم الطفل',
      childAgeLabel: 'العمر',
      childGradeLabel: 'الصف الدراسي',
      childAvatarLabel: 'اختر صورة',
      addChildBtn: 'إضافة طفل',
      parentDashBtn: 'لوحة ولي الأمر',
      // Games hub
      welcomeChild: 'أهلاً',
      chooseGame: 'اختر لعبتك!',
      chooseLevel: 'مستوى الصعوبة',
      levelEasy: 'Easy (سهل)',
      levelMedium: 'Medium (متوسط)',
      levelHard: 'Hard (صعب)',
      levelAdaptive: 'Adaptive AI (ذكي)',
      playBtn: 'العب',
      // Common game UI
      score: 'النقاط',
      time: 'الوقت',
      correct: 'إجابة صحيحة',
      wrong: 'إجابة خاطئة',
      accuracy: 'الدقة',
      pause: 'توقف',
      next: 'التالي',
      playAgain: 'العب مرة أخرى',
      gameComplete: 'أحسنت! 🎉',
      back: 'رجوع',
      // Categories for games
      catMemory: 'الذاكرة',
      catMath: 'الرياضيات',
      catLogic: 'المنطق',
      catWords: 'الكلمات',
      catCreativity: 'الإبداع',
      catMaze: 'المتاهات',
      catAttention: 'الانتباه',
      catTime: 'الوقت',
      // Game names
      gMemory: 'لعبة الذاكرة',
      gMath: 'مغامرة الرياضيات',
      gLogic: 'الألغاز المنطقية',
      gWords: 'تحدي الكلمات',
      gCreativity: 'لعبة الإبداع',
      gMaze: 'لعبة المتاهة',
      gAttention: 'كشف الاختلافات',
      gTime: 'قراءة الساعة',
      // AI Coach
      aiMessageHigh: 'رائع! أداؤك ممتاز، سأرفع مستوى اللعبة قليلًا 💪',
      aiMessageMid: 'جيد جدًا! لنواصل بنفس المستوى 😊',
      aiMessageLow: 'لا بأس! سأخفف المستوى قليلًا لنتدرب أكثر 🌱',
      aiLevelUp: '⬆️ رُفع المستوى!',
      aiLevelDown: '⬇️ خُفّض المستوى!',
      // Dashboard
      dashTitle: 'لوحة ولي الأمر — تقرير الطفل',
      dashSelectChild: 'اختر الطفل:',
      dashLevel: 'المستوى العام',
      dashStrengths: 'نقاط القوة 💪',
      dashWeaknesses: 'نقاط الضعف تحتاج تدريب 📉',
      dashProgress: 'نسبة التطور',
      dashGamesPlayed: 'الألعاب المنفذة',
      dashAvgAccuracy: 'متوسط الدقة',
      dashSuggested: 'الألعاب المقترحة',
      dashNoStrengths: 'لا توجد بيانات بعد — العب الألعاب أولًا!',
      dashWeekly: 'التقرير الأسبوعي',
      dashNoData: 'لا توجد بيانات أداء حتى الآن.',
      dashThisWeek: 'هذا الأسبوع',
      dashLastWeek: 'الأسبوع الماضي',
      dashDiff: 'الفرق',
      dashNew: 'جديد',
      dashOverall: 'نظرة شاملة',
      dashSkillMemory: 'الذاكرة',
      dashSkillMath: 'الرياضيات',
      dashSkillLogic: 'المنطق',
      dashSkillWords: 'الكلمات',
      dashSkillCreativity: 'الإبداع',
      dashSkillMaze: 'حل المتاهات',
      dashSkillAttention: 'الانتباه',
      dashSkillTime: 'الوقت',
      skillStrong: 'قوي',
      skillAverage: 'متوسط',
      skillWeak: 'يحتاج تطوير',
      // AI suggestions
      suggestPractice: 'تدرب على',
      suggestChallenge: 'تحدّى نفسك في',
      // Levels
      lv1: 'مستوى 1',
      lv2: 'مستوى 2',
      lv3: 'مستوى 3',
      lv4: 'مستوى 4',
      lv5: 'مستوى 5',
      // Last screen
      finalScore: 'النتيجة النهائية',
      playToHome: 'العودة للألعاب',
      // Child select
      selectChildTitle: 'من يلعب الآن؟',
      addNewChild: 'إضافة طفل جديد',
      // Toasts / misc
      errFillFields: 'الرجاء تعبئة جميع الحقول',
      errEmailExists: 'هذا البريد مسجّل مسبقًا',
      errLogin: 'البريد أو كلمة المرور غير صحيحة',
      errNoChildren: 'أضف طفلًا أولًا',
      successRegister: 'تمت الإضافة بنجاح!',
      // Difficulty labels in-game
      diffEasy: 'سهل',
      diffMedium: 'متوسط',
      diffHard: 'صعب',
      diffAdaptive: 'ذكي',
      // Game instructions
      instrMemory: 'اقلب الكروت وابحث عن الأزواج المتطابقة!',
      instrMath: 'أجب على الأسئلة الرياضية بسرعة ودقة!',
      instrLogic: 'أكمل التسلسل المنطقي الصحيح!',
      instrWords: 'اختر الكلمة الصحيحة للصورة!',
      instrCreativity: 'لوّن المناطق بالألوان الصحيحة حسب الأرقام!',
      instrMaze: 'حرّك الفأر للوصول إلى الجبنة!',
      instrAttention: 'تأمل الصورتين واكتشف الاختلافات!',
      instrTime: 'اقرأ الوقت الظاهر على الساعة!',
      diffOriginal: 'الأصلية',
      diffModified: 'المعدّلة',
      findLeft: 'المتبقي من الاختلافات',
      done: 'انتهيت!',
      fillColor: 'اختر لونًا ثم اضغط على المنطقة',
      exportPdf: 'تصدير التقرير PDF',
      printTitle: 'تقرير تطور الطفل',
      achievements: 'الإنجازات',
      achFirst: 'خطوة أولى',
      achExplorer: 'مستكشف المتاهات',
      achSharp: 'عين حادة',
      achSpeed: 'سريع البرق',
      achPerfect: 'مثالي',
      achAdapt: 'معرّف AI',
      // Dashboard empty
      emptyGraph: 'لا توجد بيانات كافية',
      // Common
      ok: 'حسنًا',
      cancel: 'إلغاء',
      confirm: 'تأكيد'
    },
    en: {
      brand: 'Play2Grow',
      tagline: 'Learn through play',
      footerText: '🎓 Graduation project — AI Talent Discovery & Development Platform',
      langSwitch: 'العربية',
      // Landing
      heroTitle: 'Discover your child’s talent while playing!',
      heroSub: 'Smart games that build skills — an AI coach trains and guides your child step by step.',
      btnStart: '🚀 Start now',
      btnParent: 'Parent sign up',
      howItWorks: 'How does it work?',
      step1Title: 'Register your child',
      step1Desc: 'Parent registers the child with basic info.',
      step2Title: 'They play & learn',
      step2Desc: 'The child plays fun educational games.',
      step3Title: 'AI analyzes performance',
      step3Desc: 'We track time, mistakes and accuracy and analyze them.',
      step4Title: 'Watch progress',
      step4Desc: 'Parents see the weekly report and development.',
      gamesTitle: 'Available games',
      gamesSub: '8 games — each one builds a different skill',
      aiFeatureTitle: 'Smart AI Coach',
      aiFeatureDesc: 'Pick Easy, Medium or Hard — or try Adaptive AI that changes difficulty live based on your child’s performance.',
      parentDashTitle: 'Parent Dashboard',
      parentDashDesc: 'Child level, strengths, weaknesses, development %, suggested games and a weekly report.',
      // Nav
      navHome: 'Home',
      navGames: 'Games',
      navDashboard: 'Parent Dashboard',
      navLogout: 'Log out',
      // Register
      regTitle: 'Parent sign up',
      regNameLabel: 'Parent name',
      regEmailLabel: 'Email',
      regPassLabel: 'Password',
      regBtn: 'Sign up',
      regHaveAccount: 'I have an account',
      loginTitle: 'Log in',
      loginBtn: 'Log in',
      childNameLabel: 'Child name',
      childAgeLabel: 'Age',
      childGradeLabel: 'Grade',
      childAvatarLabel: 'Pick an avatar',
      addChildBtn: 'Add child',
      parentDashBtn: 'Parent dashboard',
      // Games hub
      welcomeChild: 'Welcome',
      chooseGame: 'Pick your game!',
      chooseLevel: 'Difficulty level',
      levelEasy: 'Easy',
      levelMedium: 'Medium',
      levelHard: 'Hard',
      levelAdaptive: 'Adaptive AI',
      playBtn: 'Play',
      // Common game UI
      score: 'Score',
      time: 'Time',
      correct: 'Correct',
      wrong: 'Wrong',
      accuracy: 'Accuracy',
      pause: 'Pause',
      next: 'Next',
      playAgain: 'Play again',
      gameComplete: 'Great job! 🎉',
      back: 'Back',
      // Categories for games
      catMemory: 'Memory',
      catMath: 'Math',
      catLogic: 'Logic',
      catWords: 'Words',
      catCreativity: 'Creativity',
      catMaze: 'Mazes',
      catAttention: 'Attention',
      catTime: 'Time',
      // Game names
      gMemory: 'Memory Game',
      gMath: 'Math Adventure',
      gLogic: 'Logic Puzzle',
      gWords: 'Word Challenge',
      gCreativity: 'Creativity Game',
      gMaze: 'Maze Game',
      gAttention: 'Spot the Difference',
      gTime: 'Clock Reading',
      // AI Coach
      aiMessageHigh: 'Great! Excellent performance — raising the level a bit 💪',
      aiMessageMid: 'Very good! Keeping the same level 😊',
      aiMessageLow: 'No problem! Lowering the level a bit so we can train 🌱',
      aiLevelUp: '⬆️ Level raised!',
      aiLevelDown: '⬇️ Level lowered!',
      // Dashboard
      dashTitle: 'Parent Dashboard — Child Report',
      dashSelectChild: 'Choose child:',
      dashLevel: 'Overall level',
      dashStrengths: 'Strengths 💪',
      dashWeaknesses: 'Weaknesses — need practice 📉',
      dashProgress: 'Development %',
      dashGamesPlayed: 'Games played',
      dashAvgAccuracy: 'Average accuracy',
      dashSuggested: 'Suggested games',
      dashNoStrengths: 'No data yet — play some games first!',
      dashWeekly: 'Weekly report',
      dashNoData: 'No performance data yet.',
      dashThisWeek: 'This week',
      dashLastWeek: 'Last week',
      dashDiff: 'Difference',
      dashNew: 'New',
      dashOverall: 'Overall view',
      dashSkillMemory: 'Memory',
      dashSkillMath: 'Math',
      dashSkillLogic: 'Logic',
      dashSkillWords: 'Words',
      dashSkillCreativity: 'Creativity',
      dashSkillMaze: 'Maze solving',
      dashSkillAttention: 'Attention',
      dashSkillTime: 'Time',
      skillStrong: 'Strong',
      skillAverage: 'Average',
      skillWeak: 'Needs work',
      // AI suggestions
      suggestPractice: 'Practice',
      suggestChallenge: 'Challenge yourself in',
      // Levels
      lv1: 'Level 1',
      lv2: 'Level 2',
      lv3: 'Level 3',
      lv4: 'Level 4',
      lv5: 'Level 5',
      // Last screen
      finalScore: 'Final score',
      playToHome: 'Back to games',
      // Child select
      selectChildTitle: 'Who is playing?',
      addNewChild: 'Add new child',
      // Toasts / misc
      errFillFields: 'Please fill in all fields',
      errEmailExists: 'This email is already registered',
      errLogin: 'Wrong email or password',
      errNoChildren: 'Add a child first',
      successRegister: 'Saved successfully!',
      // Difficulty labels in-game
      diffEasy: 'Easy',
      diffMedium: 'Medium',
      diffHard: 'Hard',
      diffAdaptive: 'Smart',
      // Game instructions
      instrMemory: 'Flip the cards and find the matching pairs!',
      instrMath: 'Answer the math questions fast and accurately!',
      instrLogic: 'Complete the correct logic sequence!',
      instrWords: 'Pick the correct word for the picture!',
      instrCreativity: 'Color the areas with the right colors by number!',
      instrMaze: 'Move the mouse to reach the cheese!',
      instrAttention: 'Look at both pictures and find the differences!',
      instrTime: 'Read the time shown on the clock!',
      diffOriginal: 'Original',
      diffModified: 'Modified',
      findLeft: 'Differences left',
      done: 'Done!',
      fillColor: 'Pick a color then tap an area',
      exportPdf: 'Export report PDF',
      printTitle: 'Child Progress Report',
      achievements: 'Achievements',
      achFirst: 'First Step',
      achExplorer: 'Maze Explorer',
      achSharp: 'Sharp Eyes',
      achSpeed: 'Lightning Fast',
      achPerfect: 'Perfect!',
      achAdapt: 'AI Explorer',
      // Dashboard empty
      emptyGraph: 'Not enough data',
      // Common
      ok: 'OK',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  };

  let lang = localStorage.getItem('p2g_lang') || 'ar';

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = '🌍 ' + (lang === 'ar' ? 'English' : 'العربية');
    const sbtn = document.getElementById('sound-toggle');
    if (sbtn && P2G.fx) sbtn.textContent = P2G.fx.isEnabled() ? '🔊' : '🔇';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (dict[lang][k]) el.textContent = dict[lang][k];
    });
  }

  function t(key) {
    return (dict[lang] && dict[lang][key]) || (dict.en[key]) || key;
  }

  function toggle() {
    lang = lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('p2g_lang', lang);
    applyLang();
    // re-render the current page so baked-in labels switch language
    // (skip during an active game to avoid losing progress)
    if (P2G.current && P2G.current.name !== 'game') {
      P2G.app.go(P2G.current.name, P2G.current.params);
    }
    P2G.nav.renderTopNav();
  }

  function getLang() { return lang; }

  return { t, toggle, applyLang, getLang, dict };
})();