# 🚀 Play2Grow — AI Talent Discovery & Development Platform

> **مشروع تخرّج** | منصة ذكية لاكتشاف وتنمية مواهب الأطفال باستخدام الألعاب والذكاء الاصطناعي.
> Graduation project: an AI-powered platform that discovers and develops children's talents through games.

---

## 📌 المشكلة | The Problem
- الأطفال يقضون ساعات طويلة في ألعاب لا تنمّي أي مهارة.
- كثير من أولياء الأمور لا يعرفون نقاط القوة والضعف عند أطفالهم.
- Kids spend long hours on games that build no skills, and parents often don't know their child's strengths and weaknesses.

## 💡 الحل | The Solution
منصة تعليمية تفاعلية تعتمد على الألعاب والذكاء الاصطناعي. الطفل يلعب ألعابًا ممتعة تطوّر مهاراته، بينما يقوم الـ **AI** بتحليل أدائه وتوجيهه واكتشاف نقاط قوته وضعفه، مع تقارير أسبوعية لولي الأمر.

An interactive educational platform. The child plays fun skill-building games while an **AI Coach** analyzes performance, adapts difficulty live, discovers strengths/weaknesses, and shows parents a weekly report.

## 🎮 كيف تعمل | How It Works
```
ولي الأمر يسجّل الطفل  →  الطفل يلعب ألعابًا تعليمية  →  يُسجّل الأداء
(الوقت - الأخطاء - الدقة - عدد المحاولات)  →  AI يحلّل النتائج
→  يكتشف نقاط القوة والضعف  →  يقترح ألعابًا مناسبة  →  يتابع التطور أسبوعيًا
```

---

## 🎮 الألعاب | Games (8)
| # | اللعبة | المهارة | الوصف |
|---|--------|---------|--------|
| 1 | 🧠 Memory Game | الذاكرة | اقلب الكروت وابحث عن الأزواج |
| 2 | 🧩 Logic Puzzle | المنطق | أكمل التسلسل المنطقي |
| 3 | ➕ Math Adventure | الرياضيات | أجب عن الأسئلة بسرعة ودقة |
| 4 | 📝 Word Challenge | الكلمات | اختر الكلمة الصحيحة (عربي/إنجليزي) |
| 5 | 🎨 Creativity Game | الإبداع | لوّن بالتدرّج الرقمي (Paint-by-numbers) |
| 6 | 🗺️ Maze Game | حل المتاهات | حرّك الفأر إلى الجبنة |
| 7 | 🔍 Spot the Difference | الانتباه | ابحث عن الاختلافات في الصور |
| 8 | ⏰ Clock Reading | الوقت | اقرأ الساعة التناظرية |

كل لعبة توفّر 4 مستويات: **Easy / Medium / Hard / Adaptive AI**.

---

## 🤖 الذكاء الاصطناعي | The AI Coach
- **تحليل مهارات**: متوسّط مرجّح للدقة (الأحدث أوزن) - تصنيف: قوي (≥80) / متوسط (60-79) / ضعيف (<60).
- **Adaptive AI**: يغيّر مستوى اللعبة أثناء اللعب حسب الأداء دون تدخّل:
  - دقة ≥ 85% → رفع المستوى ⬆️
  - دقة ≤ 55% → خفض المستوى ⬇️
- **اقتراحات**: مهارة ضعيفة → تدريب بمستوى منخفض • مهارة قوية → تحدٍّ بمستوى مرتفع • غير مجرّبة → تجربة.
- **التقرير الأسبوعي**: مقارنة هذا الأسبوع بالأسبوع السابق + نسبة التطور.

## 👨‍👩‍👧 لوحة ولي الأمر | Parent Dashboard
- المستوى العام للطفل • نقاط القوة 💪 • نقاط الضعف 📉 • نسبة التطور 📈
- متوسط الدقة • الألعاب المقترحة • التقرير الأسبوعي • شارات الإنجازات 🏅 • تصدير التقرير PDF

---

## 🛠️ التقنيات | Tech Stack
- **HTML5 + CSS3 + Vanilla JavaScript** — بدون أي مكتبات خارجية، يعمل بمجرّد فتح `index.html`.
- **localStorage** — لحفظ الحسابات وأداء الأطفال (بدون سيرفر).
- **Web Audio API** — للمؤثرات الصوتية (قابلة للكتم).
- **Canvas API** — للمتاهة والساعة.
- ثنائية اللغة **عربي / إنجليزي** مع دعم RTL كامل، وتصميم Responsive.

## 📂 بنية المشروع | Structure
```
play2grow/
├── index.html               ← الشاشة الرئيسية
├── css/styles.css           ← كل الأنماط (بما فيها الطباعة للتصدير)
├── js/
│   ├── i18n.js              ← الترجمات (AR/EN)
│   ├── data.js              ← طبقة البيانات (localStorage)
│   ├── ai.js                ← محرّك AI Coach
│   ├── app.js               ← الراوتر + وحدات اللعب المشتركة
│   ├── sound.js             ← المؤثرات الصوتية
│   ├── main.js              ← نقطة الإقلاع
│   ├── pages/               ← landing, register, childselect, hub, dashboard
│   └── games/               ← memory, math, logic, words, creativity, maze, attention, time
└── docs/                    ← plan.md, documentation.md
```

## 🚀 التشغيل | Quick Start
1. افتح `index.html` بأي متصفّح حديث (Chrome / Edge / Firefox).
2. سجّل ولي أمر (أو العب مباشرة كضيف **Guest** — بدون حفظ للأداء).
3. أضف طفلًا بصورته الرمزية وعمره وصفّه.
4. اختر لعبة ومستوى (جرّب **Adaptive AI** 🤖).
5. راجع لوحة ولي الأمر والتقرير الأسبوعي، وصدّر التقرير **PDF**.

## ✅ اختبار | Testing
تمت التحقق آليًا عبر **Microsoft Edge Headless**:
- عرض جميع الصفحات • اقلاع الألعاب الثماني • محرّك AI (تصنيف المهارات + اقتراحات + تقرير أسبوعي + Adaptive).

---

Made with ❤️ for kids — مشروع تخرّج