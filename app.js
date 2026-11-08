/* ==========================================================================
   页间 PAGE LAB — interactions
   Shared navigation + catalog filters + the live code playground.
   ========================================================================== */

(() => {
  "use strict";

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector(".sr-only").textContent = "打开导航";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.querySelector(".sr-only").textContent = isOpen ? "关闭导航" : "打开导航";
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
      if (event.matches) closeNav();
    });
  }

  /* ------------------------------------------------------------------------
     Exercise catalog: count + query-string filter
     ------------------------------------------------------------------------ */

  const catalog = document.querySelector(".catalog-body");

  if (catalog) {
    const filters = [...catalog.querySelectorAll(".filter-radio")];
    const countTarget = catalog.querySelector("[data-result-count]");
    const counts = {
      all: 6,
      basics: 1,
      flex: 2,
      grid: 2,
      visual: 1
    };

    const updateCount = () => {
      const checked = filters.find((radio) => radio.checked);
      if (checked && countTarget) countTarget.textContent = String(counts[checked.value] || 0);
    };

    const applyQueryFilter = () => {
      const requested = new URLSearchParams(window.location.search).get("cat");
      if (!requested) return;
      const match = filters.find((radio) => radio.value === requested);
      if (match) match.checked = true;
    };

    applyQueryFilter();
    updateCount();

    filters.forEach((radio) => {
      radio.addEventListener("change", () => {
        updateCount();
        if (!radio.checked) return;

        const url = new URL(window.location.href);
        if (radio.value === "all") url.searchParams.delete("cat");
        else url.searchParams.set("cat", radio.value);
        try {
          window.history.replaceState({}, "", url);
        } catch {
          /* file:// previews can block history updates */
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Playground
     ------------------------------------------------------------------------ */

  const playground = document.querySelector(".studio");

  if (!playground) return;

  const htmlEditor = document.querySelector("#htmlEditor");
  const cssEditor = document.querySelector("#cssEditor");
  const previewFrame = document.querySelector("#previewFrame");
  const lineNumbers = document.querySelector("#lineNumbers");
  const tabHtml = document.querySelector("#tab-html");
  const tabCss = document.querySelector("#tab-css");
  const editorStatus = document.querySelector("#editorStatus");
  const editorDoc = document.querySelector("#editorDoc");
  const savedStatus = document.querySelector("#savedStatus");
  const solutionBtn = document.querySelector("#solutionBtn");
  const resetBtn = document.querySelector("#resetBtn");
  const openPreview = document.querySelector("#openPreview");
  const previewNote = document.querySelector("#previewNote");
  const challengeTitle = document.querySelector("#challengeTitle");
  const challengeNumber = document.querySelector("#challengeNumber");
  const challengeIntro = document.querySelector("#challengeIntro");
  const challengeCategory = document.querySelector("#challengeCategory");
  const challengeTime = document.querySelector("#challengeTime");
  const challengeLevel = document.querySelector("#challengeLevel");
  const challengeChecklist = document.querySelector("#challengeChecklist");
  const challengeHint = document.querySelector("#challengeHint");
  const hintBox = document.querySelector("#hintBox");
  const challengePills = [...document.querySelectorAll(".challenge-pill")];

  if (!htmlEditor || !cssEditor || !previewFrame) return;

  const STORAGE_KEY = "pagelab:drafts:v1";

  const challenges = {
    card: {
      number: "练习 01",
      title: "把一张名片，排出呼吸感",
      intro: "用字号、字重和留白，建立清晰的三级文字层级。",
      category: "基础排版",
      time: "20 min",
      level: 1,
      list: [
        "用字号和字重区分标题、身份与联系方式",
        "让卡片内部有足够、但不松散的留白",
        "用一条分隔线建立安静的信息层次"
      ],
      hint: "先给 .namecard 更大的 padding，再把 .eyebrow 和 h1 之间的 margin 拉开。字号差距越大，层级越清楚。",
      html: `<article class="namecard">
  <p class="eyebrow">INDEPENDENT DESIGNER</p>
  <h1>林一 <span>Lin Yi</span></h1>
  <p class="role">视觉设计师 / 上海</p>
  <div class="rule"></div>
  <p class="contact">hi@linyi.design</p>
</article>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #e9e3d7;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.namecard {
  width: min(420px, 88vw);
  padding: 30px;
  border: 2px solid #1c1f18;
  background: #fffdf8;
}

/* 从这里开始： */
.eyebrow { }
h1 { }
h1 span { }
.role { }
.rule { }
.contact { }`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #e9e3d7;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.namecard {
  width: min(420px, 88vw);
  padding: 42px;
  border: 2px solid #1c1f18;
  background: #fffdf8;
  box-shadow: 10px 10px 0 #1c1f18;
}

.eyebrow {
  margin: 0 0 62px;
  color: #77796d;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
}

h1 {
  margin: 0;
  font-size: 52px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

h1 span {
  display: block;
  margin-top: 11px;
  color: #ff7448;
  font-family: Georgia, serif;
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.role {
  margin: 18px 0 0;
  color: #727468;
  font-size: 13px;
}

.rule {
  height: 1px;
  margin: 32px 0 18px;
  background: #d9d3c5;
}

.contact {
  margin: 0;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 12px;
}`
    },

    pricing: {
      number: "练习 02",
      title: "三档价格卡，排成一行",
      intro: "让卡片等宽同高，把按钮稳稳地按在底部。",
      category: "Flexbox",
      time: "25 min",
      level: 1,
      list: [
        "让 .plans 里的三张卡片排成一行",
        "让三张卡片等宽、同高，并用 gap 控制间距",
        "把 CTA 按钮推到底部，窄屏时自动换行"
      ],
      hint: "给 .plans 加上 display: flex、gap 和 align-items: stretch，再给 .plan 加上 flex: 1。按钮想贴底，就让卡片成为纵向 flex，然后给按钮 margin-top: auto。",
      html: `<main class="pricing">
  <header class="pricing-head">
    <p class="eyebrow">MEMBERSHIP / 2026</p>
    <h1>选一个，<br>开始做东西。</h1>
  </header>

  <section class="plans">
    <article class="plan">
      <span class="tag">随用随停</span>
      <h2>轻量</h2>
      <p class="price">¥0<span>/月</span></p>
      <ul>
        <li>3 个基础练习</li>
        <li>本地实时预览</li>
        <li>社区草稿</li>
      </ul>
      <a href="#">从这里开始</a>
    </article>

    <article class="plan featured">
      <span class="tag">最多人选择</span>
      <h2>进阶</h2>
      <p class="price">¥39<span>/月</span></p>
      <ul>
        <li>全部 6 个练习</li>
        <li>参考答案</li>
        <li>离线草稿本</li>
      </ul>
      <a href="#">选择进阶</a>
    </article>

    <article class="plan">
      <span class="tag">一起练习</span>
      <h2>小队</h2>
      <p class="price">¥99<span>/月</span></p>
      <ul>
        <li>最多 5 位成员</li>
        <li>共享练习进度</li>
        <li>每周点评</li>
      </ul>
      <a href="#">邀请伙伴</a>
    </article>
  </section>
</main>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 42px 24px;
  min-height: 100vh;
  background: #f0ebe0;
  color: #1c1f18;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.pricing {
  width: min(920px, 100%);
  margin: 0 auto;
}

.eyebrow {
  margin: 0;
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
}

h1 {
  margin: 13px 0 0;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
}

.plans {
  margin-top: 36px;
  /* TODO：让三张卡排成一行，并保持等宽同高 */
}

.plan {
  display: flex;
  flex-direction: column;
  padding: 23px;
  border: 1.5px solid #1c1f18;
  background: #fffdf8;
}

.plan.featured {
  background: #1c1f18;
  color: #f2ede2;
}

.tag {
  align-self: flex-start;
  padding: 3px 6px;
  border: 1px solid currentColor;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 7px;
  opacity: 0.65;
}

.plan h2 {
  margin: 26px 0 0;
  font-size: 21px;
  letter-spacing: -0.04em;
}

.price {
  margin: 9px 0 0;
  font-family: Georgia, serif;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.05em;
  white-space: nowrap;
}

.price span {
  margin-left: 3px;
  font-family: "PingFang SC", sans-serif;
  font-size: 10px;
  letter-spacing: 0;
}

.plan ul {
  margin: 25px 0 28px;
  padding: 0;
  list-style: none;
}

.plan li {
  padding: 8px 0;
  border-top: 1px solid rgba(127, 127, 127, 0.3);
  font-size: 11px;
}

.plan a {
  margin-top: auto;
  padding: 10px;
  border: 1px solid currentColor;
  color: inherit;
  font-size: 10px;
  text-align: center;
  text-decoration: none;
}

.plan.featured a {
  border-color: #dcff63;
  background: #dcff63;
  color: #1c1f18;
}

/* TODO：
   1. 让卡片等宽
   2. 用 gap 留出间距
   3. 窄屏时纵向排列
*/`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 42px 24px;
  min-height: 100vh;
  background: #f0ebe0;
  color: #1c1f18;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.pricing {
  width: min(920px, 100%);
  margin: 0 auto;
}

.eyebrow {
  margin: 0;
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
}

h1 {
  margin: 13px 0 0;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
}

.plans {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-top: 36px;
}

.plan {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 23px;
  border: 1.5px solid #1c1f18;
  background: #fffdf8;
}

.plan.featured {
  background: #1c1f18;
  color: #f2ede2;
}

.tag {
  align-self: flex-start;
  padding: 3px 6px;
  border: 1px solid currentColor;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 7px;
  opacity: 0.65;
}

.plan h2 {
  margin: 26px 0 0;
  font-size: 21px;
  letter-spacing: -0.04em;
}

.price {
  margin: 9px 0 0;
  font-family: Georgia, serif;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.05em;
  white-space: nowrap;
}

.price span {
  margin-left: 3px;
  font-family: "PingFang SC", sans-serif;
  font-size: 10px;
  letter-spacing: 0;
}

.plan ul {
  margin: 25px 0 28px;
  padding: 0;
  list-style: none;
}

.plan li {
  padding: 8px 0;
  border-top: 1px solid rgba(127, 127, 127, 0.3);
  font-size: 11px;
}

.plan a {
  margin-top: auto;
  padding: 10px;
  border: 1px solid currentColor;
  color: inherit;
  font-size: 10px;
  text-align: center;
  text-decoration: none;
}

.plan.featured a {
  border-color: #dcff63;
  background: #dcff63;
  color: #1c1f18;
}

@media (max-width: 430px) {
  .plans {
    flex-direction: column;
  }
}`
    },

    gallery: {
      number: "练习 03",
      title: "用 Grid，拼一本周末相册",
      intro: "让照片跨越行列，在规整里做一点不规整。",
      category: "CSS Grid",
      time: "30 min",
      level: 2,
      list: [
        "把画廊从三列改成四列",
        "让第一张照片同时跨越两列和两行",
        "让第五、第六张照片各跨越两列，形成节奏",
        "保留统一的 gap 和图片裁切"
      ],
      hint: "先设置 grid-template-columns: repeat(4, 1fr)。跨列用 grid-column: span 2，跨行用 grid-row: span 2。记得把图片高度设成 100%，它才会填满格子。",
      html: `<div class="gallery">
  <figure class="shot shot-1">
    <div class="photo"></div>
    <figcaption>MORNING / 07:24</figcaption>
  </figure>
  <figure class="shot shot-2">
    <div class="photo"></div>
    <figcaption>WINDOW</figcaption>
  </figure>
  <figure class="shot shot-3">
    <div class="photo"></div>
    <figcaption>BLUE HOUR</figcaption>
  </figure>
  <figure class="shot shot-4">
    <div class="photo"></div>
    <figcaption>LEMON</figcaption>
  </figure>
  <figure class="shot shot-5">
    <div class="photo"></div>
    <figcaption>LONG WAY HOME / 18:40</figcaption>
  </figure>
  <figure class="shot shot-6">
    <div class="photo"></div>
    <figcaption>GREEN ROOM</figcaption>
  </figure>
</div>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  padding: 32px 22px;
  background: #f2ede2;
  color: #1c1f18;
  font-family: ui-monospace, monospace;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  width: min(760px, 100%);
  margin: 0 auto;
  /* TODO：挑战改为四列，并用 span 打破规整 */
}

.shot {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1.5px solid #1c1f18;
  background: #fffdf8;
}

.photo {
  height: 130px;
  transition: transform 300ms ease;
}

.shot:hover .photo {
  transform: scale(1.04);
}

.shot-1 .photo {
  background:
    radial-gradient(circle at 32% 33%, #ff7448 0 16%, transparent 17%),
    linear-gradient(150deg, #f5c6d7, #ffe1b8 70%);
}

.shot-2 .photo {
  background:
    radial-gradient(circle at 60% 35%, #dcff63 0 12%, transparent 13%),
    linear-gradient(145deg, #1c1f18, #3d483b);
}

.shot-3 .photo {
  background:
    linear-gradient(35deg, transparent 48%, rgba(255, 255, 255, 0.35) 49% 51%, transparent 52%),
    #3157ff;
}

.shot-4 .photo {
  background:
    radial-gradient(circle at 70% 30%, #fff 0 12%, transparent 13%),
    #dcff63;
}

.shot-5 .photo {
  background:
    radial-gradient(ellipse at 50% 110%, #562000 0 28%, transparent 29%),
    linear-gradient(150deg, #ffb26e, #ff7448 58%, #a63218);
}

.shot-6 .photo {
  background:
    linear-gradient(90deg, transparent 48%, rgba(28, 31, 24, 0.18) 49% 51%, transparent 52%),
    #b9d4af;
}

figcaption {
  position: absolute;
  right: 8px;
  bottom: 7px;
  left: 8px;
  color: #1c1f18;
  font-size: 7px;
  letter-spacing: 0.08em;
  line-height: 1.4;
}

.shot-2 figcaption,
.shot-3 figcaption {
  color: #f2ede2;
}`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  padding: 32px 22px;
  background: #f2ede2;
  color: #1c1f18;
  font-family: ui-monospace, monospace;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 102px;
  gap: 9px;
  width: min(760px, 100%);
  margin: 0 auto;
}

.shot {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1.5px solid #1c1f18;
  background: #fffdf8;
}

.photo {
  width: 100%;
  height: 100%;
  transition: transform 300ms ease;
}

.shot:hover .photo {
  transform: scale(1.04);
}

.shot-1 {
  grid-column: span 2;
  grid-row: span 2;
}

.shot-5 {
  grid-column: span 2;
}

.shot-6 {
  grid-column: span 2;
}

.shot-1 .photo {
  background:
    radial-gradient(circle at 32% 33%, #ff7448 0 16%, transparent 17%),
    linear-gradient(150deg, #f5c6d7, #ffe1b8 70%);
}

.shot-2 .photo {
  background:
    radial-gradient(circle at 60% 35%, #dcff63 0 12%, transparent 13%),
    linear-gradient(145deg, #1c1f18, #3d483b);
}

.shot-3 .photo {
  background:
    linear-gradient(35deg, transparent 48%, rgba(255, 255, 255, 0.35) 49% 51%, transparent 52%),
    #3157ff;
}

.shot-4 .photo {
  background:
    radial-gradient(circle at 70% 30%, #fff 0 12%, transparent 13%),
    #dcff63;
}

.shot-5 .photo {
  background:
    radial-gradient(ellipse at 50% 110%, #562000 0 28%, transparent 29%),
    linear-gradient(150deg, #ffb26e, #ff7448 58%, #a63218);
}

.shot-6 .photo {
  background:
    linear-gradient(90deg, transparent 48%, rgba(28, 31, 24, 0.18) 49% 51%, transparent 52%),
    #b9d4af;
}

figcaption {
  position: absolute;
  right: 8px;
  bottom: 7px;
  left: 8px;
  color: #1c1f18;
  font-size: 7px;
  letter-spacing: 0.08em;
  line-height: 1.4;
}

.shot-1 figcaption {
  font-size: 8px;
}

.shot-2 figcaption,
.shot-3 figcaption {
  color: #f2ede2;
}`
    },

    button: {
      number: "练习 04",
      title: "做一枚会回应的按钮",
      intro: "用渐变、位移和一层光，让 hover 有恰到好处的反馈。",
      category: "视觉细节",
      time: "18 min",
      level: 1,
      list: [
        "给按钮加上从青柠到暖橙的渐变",
        "用 transition 让位移和阴影变柔和",
        "用伪元素做一道扫过的光",
        "保留清楚的 focus-visible 状态"
      ],
      hint: "按钮本身是 relative，伪元素用 absolute。让一束斜向的白色渐变从左侧外面开始，hover 时移动到右侧外面。overflow: hidden 可以裁掉多余的光。",
      html: `<main class="stage">
  <p class="eyebrow">A BUTTON WITH A PULSE</p>
  <button class="spark-button" type="button">
    <span>开始创作</span>
    <i>↗</i>
  </button>
  <p class="hint">Hover / focus me</p>
</main>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 38%, #2a3022 0, #141711 52%, #0d0f0b 100%);
  color: #f2ede2;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.stage {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px;
}

.eyebrow {
  color: rgba(242, 237, 226, 0.45);
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.14em;
}

.spark-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 17px 27px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 999px;
  background: #f2ede2;
  color: #1c1f18;
  font-size: 13px;
  font-weight: 650;
  /* TODO：渐变、阴影、transition */
}

.spark-button i {
  font-size: 15px;
  font-style: normal;
}

.spark-button::before {
  position: absolute;
  content: "";
  /* TODO：做一道会扫过去的光 */
}

.spark-button:hover {
  /* TODO：让按钮轻轻浮起来 */
}

.spark-button:focus-visible {
  outline: 2px solid #dcff63;
  outline-offset: 5px;
}

.hint {
  color: rgba(242, 237, 226, 0.28);
  font-family: ui-monospace, monospace;
  font-size: 8px;
}`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 38%, #2a3022 0, #141711 52%, #0d0f0b 100%);
  color: #f2ede2;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.stage {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px;
}

.eyebrow {
  color: rgba(242, 237, 226, 0.45);
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.14em;
}

.spark-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 17px 27px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 999px;
  background: linear-gradient(100deg, #dcff63 0%, #b8f4a5 48%, #ffcf8a 100%);
  box-shadow: 0 0 0 0 rgba(220, 255, 99, 0), 0 16px 42px rgba(0, 0, 0, 0.28);
  color: #1c1f18;
  font-size: 13px;
  font-weight: 650;
  transition: transform 240ms ease, box-shadow 240ms ease;
}

.spark-button i {
  font-size: 15px;
  font-style: normal;
  transition: transform 240ms ease;
}

.spark-button::before {
  position: absolute;
  top: -55%;
  left: -80%;
  width: 54%;
  height: 210%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  content: "";
  transform: rotate(18deg);
  transition: left 560ms ease;
}

.spark-button:hover {
  box-shadow: 0 0 42px rgba(220, 255, 99, 0.28), 0 22px 52px rgba(0, 0, 0, 0.32);
  transform: translateY(-4px) scale(1.02);
}

.spark-button:hover::before {
  left: 135%;
}

.spark-button:hover i {
  transform: translate(3px, -3px);
}

.spark-button:focus-visible {
  outline: 2px solid #dcff63;
  outline-offset: 5px;
}

.hint {
  color: rgba(242, 237, 226, 0.28);
  font-family: ui-monospace, monospace;
  font-size: 8px;
}`
    },

    sidebar: {
      number: "练习 05",
      title: "搭一个不塌的侧边栏",
      intro: "两栏、满高、底部对齐，这些都可以交给 Flexbox。",
      category: "Flexbox",
      time: "28 min",
      level: 2,
      list: [
        "用 Flexbox 把侧边栏和主内容排成两栏",
        "让侧边栏拉满整屏高度",
        "用 margin-top: auto 把用户卡片推到最底部",
        "在 620px 以下改成上下布局"
      ],
      hint: "给 .app 设置 display: flex 和 min-height: 100vh。侧边栏本身也做一个纵向 flex，导航放上面、用户信息放底部，就能用 margin-top: auto 把它推开。",
      html: `<div class="app">
  <aside class="sidebar">
    <a class="logo" href="#">P.</a>
    <nav class="side-nav" aria-label="示例导航">
      <a class="is-active" href="#">Overview</a>
      <a href="#">Projects</a>
      <a href="#">Notes</a>
      <a href="#">Settings</a>
    </nav>
    <div class="user">
      <span class="avatar">Y</span>
      <span class="user-copy"><strong>Yiran</strong><small>Pro plan</small></span>
    </div>
  </aside>

  <main class="content">
    <p class="eyebrow">DASHBOARD / MONDAY</p>
    <h1>Good morning,<br>Yiran.</h1>
    <p class="lede">你已经连续练习 12 天了。要不要从一个简单的按钮开始？</p>
    <div class="card-row">
      <article class="stat-card"><span>STREAK</span><strong>12</strong><small>days</small></article>
      <article class="stat-card"><span>EXERCISES</span><strong>04</strong><small>done</small></article>
      <article class="stat-card"><span>NEXT UP</span><strong>05</strong><small>sidebar</small></article>
    </div>
  </main>
</div>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: #e9e3d7;
  color: #1c1f18;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.app {
  min-height: 100vh;
  /* TODO：用 flex 搭出左右两栏 */
}

.sidebar {
  padding: 25px 17px;
  background: #1c1f18;
  color: #f2ede2;
  /* TODO：做成纵向弹性布局，让用户信息沉到底部 */
}

.logo {
  color: inherit;
  font-family: Georgia, serif;
  font-size: 24px;
  font-style: italic;
  text-decoration: none;
}

.side-nav {
  margin-top: 35px;
  /* TODO：纵向排列，并留出一点间距 */
}

.side-nav a {
  display: block;
  padding: 9px 11px;
  border-radius: 6px;
  color: rgba(242, 237, 226, 0.55);
  font-size: 11px;
  text-decoration: none;
}

.side-nav a.is-active {
  background: #dcff63;
  color: #1c1f18;
}

.user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-top: 15px;
  border-top: 1px solid rgba(242, 237, 226, 0.16);
  /* TODO：用 margin-top: auto 推到侧边栏底部 */
}

.avatar {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  background: #ff7448;
  color: #1c1f18;
  font-family: Georgia, serif;
  font-size: 13px;
  font-style: italic;
}

.user-copy {
  display: flex;
  flex-direction: column;
  font-size: 10px;
  line-height: 1.5;
}

.user-copy small {
  color: rgba(242, 237, 226, 0.42);
  font-size: 7px;
}

.content {
  min-width: 0;
  padding: 36px;
  /* TODO：让主内容占满剩余宽度 */
}

.eyebrow {
  margin: 0;
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.12em;
}

h1 {
  margin: 16px 0 0;
  font-family: Georgia, serif;
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.lede {
  max-width: 370px;
  margin-top: 17px;
  color: #727468;
  font-size: 11px;
  line-height: 1.7;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 31px;
}

.stat-card {
  display: flex;
  min-width: 100px;
  flex: 1;
  flex-direction: column;
  padding: 13px;
  border: 1px solid #1c1f18;
  background: #fffdf8;
}

.stat-card span {
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 6px;
  letter-spacing: 0.09em;
}

.stat-card strong {
  margin-top: 12px;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
}

.stat-card small {
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 7px;
}`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: #e9e3d7;
  color: #1c1f18;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  display: flex;
  width: 175px;
  flex: 0 0 175px;
  flex-direction: column;
  padding: 25px 17px;
  background: #1c1f18;
  color: #f2ede2;
}

.logo {
  color: inherit;
  font-family: Georgia, serif;
  font-size: 24px;
  font-style: italic;
  text-decoration: none;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 35px;
}

.side-nav a {
  display: block;
  padding: 9px 11px;
  border-radius: 6px;
  color: rgba(242, 237, 226, 0.55);
  font-size: 11px;
  text-decoration: none;
}

.side-nav a.is-active {
  background: #dcff63;
  color: #1c1f18;
}

.user {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid rgba(242, 237, 226, 0.16);
}

.avatar {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  background: #ff7448;
  color: #1c1f18;
  font-family: Georgia, serif;
  font-size: 13px;
  font-style: italic;
}

.user-copy {
  display: flex;
  flex-direction: column;
  font-size: 10px;
  line-height: 1.5;
}

.user-copy small {
  color: rgba(242, 237, 226, 0.42);
  font-size: 7px;
}

.content {
  min-width: 0;
  flex: 1;
  padding: 28px 24px;
}

.eyebrow {
  margin: 0;
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.12em;
}

h1 {
  margin: 16px 0 0;
  font-family: Georgia, serif;
  font-size: clamp(2rem, 5vw, 4.2rem);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.lede {
  max-width: 370px;
  margin-top: 17px;
  color: #727468;
  font-size: 11px;
  line-height: 1.7;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 31px;
}

.stat-card {
  display: flex;
  min-width: 100px;
  flex: 1;
  flex-direction: column;
  padding: 13px;
  border: 1px solid #1c1f18;
  background: #fffdf8;
}

.stat-card span {
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 6px;
  letter-spacing: 0.09em;
}

.stat-card strong {
  margin-top: 12px;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
}

.stat-card small {
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 7px;
}

@media (max-width: 430px) {
  .app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex: none;
  }

  .side-nav {
    flex-direction: row;
    overflow-x: auto;
    margin-top: 20px;
  }

  .user {
    margin-top: 20px;
  }

  .content {
    padding: 25px;
  }
}`
    },

    poster: {
      number: "练习 06",
      title: "做一张会呼吸的海报",
      intro: "用叠层、渐变和可控的字号，把文字变成画面。",
      category: "CSS Grid",
      time: "35 min",
      level: 3,
      list: [
        "用多层渐变替换纯色背景",
        "用 clamp() 放大主标题",
        "让圆形和网格成为有层次的装饰",
        "用 Flexbox 把底部信息稳定地放下"
      ],
      hint: "背景可以同时叠 radial-gradient 和 linear-gradient。主标题放在 flex 纵向布局里，用 margin-top: auto 推到底部。装饰圆用 absolute 定位，记得给海报设置 overflow: hidden。",
      html: `<main class="poster">
  <span class="poster-kicker">PAGE LAB PRESENTS / 2026</span>
  <div class="poster-title">MAKE<br><em>ROOM</em></div>
  <div class="poster-orb"></div>
  <p class="poster-side">A SMALL MANIFESTO<br>ON SPACE, TYPE &amp; TIME</p>
  <div class="poster-foot">
    <span>08.11 — 08.31</span>
    <span>SHANGHAI</span>
  </div>
  <span class="poster-star">✳</span>
</main>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 26px;
  background: #d9d2c2;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.poster {
  position: relative;
  display: flex;
  width: min(500px, 100%);
  aspect-ratio: 4 / 5;
  flex-direction: column;
  padding: 30px;
  overflow: hidden;
  border: 2px solid #1c1f18;
  background: #1c1f18;
  color: #f2ede2;
  isolation: isolate;
}

.poster-kicker {
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.09em;
  /* TODO：让它成为安静的小字 */
}

.poster-title {
  /* TODO：让标题成为画面的主角，并推到下方 */
  font-weight: 900;
  line-height: 0.78;
  letter-spacing: -0.09em;
}

.poster-title em {
  font-family: Georgia, serif;
  font-weight: 400;
}

.poster-orb {
  position: absolute;
  /* TODO：放一个半透明的圆在文字后面 */
}

.poster-side {
  /* TODO：把这段小字放到海报右侧 */
}

.poster-foot {
  /* TODO：让日期和城市分居两端 */
  padding-top: 20px;
  border-top: 1px solid currentColor;
  font-family: ui-monospace, monospace;
  font-size: 8px;
}

.poster-star {
  position: absolute;
  right: 28px;
  bottom: 60px;
  font-size: 31px;
  line-height: 1;
}`,
      solutionCss: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 26px;
  background: #d9d2c2;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.poster {
  position: relative;
  display: flex;
  width: min(500px, 100%);
  aspect-ratio: 4 / 5;
  flex-direction: column;
  padding: 30px;
  overflow: hidden;
  border: 2px solid #1c1f18;
  background:
    radial-gradient(circle at 72% 28%, rgba(255, 255, 255, 0.96), transparent 32%),
    linear-gradient(145deg, #eaff8d 0%, #ffc56e 40%, #ff7448 68%, #3157ff 130%);
  color: #1c1f18;
  isolation: isolate;
}

.poster::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(28, 31, 24, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(28, 31, 24, 0.12) 1px, transparent 1px);
  background-size: 38px 38px;
  content: "";
  mix-blend-mode: multiply;
  opacity: 0.55;
}

.poster-kicker {
  font-family: ui-monospace, monospace;
  font-size: 8px;
  letter-spacing: 0.09em;
}

.poster-title {
  margin-top: auto;
  font-size: clamp(3.8rem, 7vw, 6.2rem);
  font-weight: 900;
  line-height: 0.78;
  letter-spacing: -0.09em;
}

.poster-title em {
  font-family: Georgia, serif;
  font-weight: 400;
}

.poster-orb {
  position: absolute;
  top: 29%;
  left: 8%;
  z-index: -1;
  width: 58%;
  aspect-ratio: 1;
  border: 1px solid rgba(28, 31, 24, 0.45);
  border-radius: 50%;
  background: radial-gradient(circle at 38% 34%, #fff 0, rgba(255, 255, 255, 0.34) 26%, rgba(220, 255, 99, 0.22) 60%, transparent 72%);
}

.poster-side {
  position: absolute;
  top: 94px;
  right: 22px;
  margin: 0;
  font-family: ui-monospace, monospace;
  font-size: 7px;
  letter-spacing: 0.06em;
  line-height: 1.6;
  text-align: right;
  transform: rotate(90deg) translateX(100%);
  transform-origin: right top;
}

.poster-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 26px;
  padding-top: 10px;
  border-top: 1px solid currentColor;
  font-family: ui-monospace, monospace;
  font-size: 8px;
  font-weight: 600;
}

.poster-star {
  position: absolute;
  right: 28px;
  bottom: 60px;
  font-size: 31px;
  line-height: 1;
}`
    },

    free: {
      number: "自由创作",
      title: "一张完全空白的画布",
      intro: "没有题目，也没有参考答案。写你想写的，调你想调的。",
      category: "Free play",
      time: "不限时",
      level: 0,
      list: [
        "改掉标题文字，让它变成你自己的",
        "加一个背景色或渐变",
        "用 Flexbox 或 Grid 组织内容",
        "把预览窗口缩窄，检查它是否还好看"
      ],
      hint: "可以先写结构，再一条一条加样式。如果不知道从哪里开始，试着给 body 加一个背景色，再给 h1 换一个更大的字号。",
      html: `<main class="page">
  <p class="eyebrow">YOUR BLANK PAGE</p>
  <h1>Hello,<br>页间。</h1>
  <p class="lede">从这里开始你的页面。改一改文字，加一点颜色，再让留白慢慢长出来。</p>
  <a class="link" href="#">一个链接 →</a>
</main>`,
      css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: #f2ede2;
  color: #1c1f18;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  padding: 42px;
}

.eyebrow {
  margin: 0;
  color: #727468;
  font-family: ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
}

h1 {
  margin: 18px 0 0;
  font-size: clamp(3.4rem, 9vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
}

.lede {
  max-width: 340px;
  margin-top: 23px;
  color: #727468;
  font-size: 12px;
  line-height: 1.8;
}

.link {
  margin-top: 28px;
  color: #1c1f18;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 4px;
}`,
      solutionCss: ""
    }
  };

  const challengeKeys = Object.keys(challenges);
  const requestedKey = new URLSearchParams(window.location.search).get("challenge");
  let activeKey = challengeKeys.includes(requestedKey) ? requestedKey : "card";
  let activeTab = "css";
  let solutionMode = false;
  let myVersion = null;
  let renderTimer = 0;
  let saveTimer = 0;

  const readDrafts = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  let drafts = readDrafts();

  const writeDrafts = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch {
      return false;
    }
  };

  const updateEditorMeta = () => {
    const editor = activeTab === "css" ? cssEditor : htmlEditor;
    const lineCount = editor.value.split("\n").length;
    lineNumbers.textContent = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
    lineNumbers.scrollTop = editor.scrollTop;
    editorDoc.textContent = `${activeTab.toUpperCase()} · ${lineCount} 行`;
  };

  const updateStatus = (text, temporary = false) => {
    if (!savedStatus) return;
    savedStatus.classList.toggle("is-saving", temporary);
    savedStatus.querySelector("span").textContent = text;
  };

  const saveDraft = () => {
    if (solutionMode) return;
    drafts[activeKey] = {
      html: htmlEditor.value,
      css: cssEditor.value
    };
    const success = writeDrafts();
    updateStatus(success ? "草稿已保存" : "仅保存在本次会话");
  };

  const scheduleSave = () => {
    window.clearTimeout(saveTimer);
    updateStatus("正在保存…", true);
    saveTimer = window.setTimeout(saveDraft, 650);
  };

  const buildDocument = () => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${cssEditor.value}
</style>
</head>
<body>
${htmlEditor.value}
</body>
</html>`;

  const renderPreview = () => {
    previewFrame.srcdoc = buildDocument();
    editorStatus.classList.remove("is-updating");
    previewNote.textContent = "页面会随输入自动刷新";
  };

  const scheduleRender = () => {
    window.clearTimeout(renderTimer);
    editorStatus.classList.add("is-updating");
    renderTimer = window.setTimeout(renderPreview, 220);
  };

  const setTab = (tab, focus = false) => {
    activeTab = tab;
    const htmlActive = tab === "html";

    tabHtml.classList.toggle("is-active", htmlActive);
    tabCss.classList.toggle("is-active", !htmlActive);
    tabHtml.setAttribute("aria-selected", String(htmlActive));
    tabCss.setAttribute("aria-selected", String(!htmlActive));
    tabHtml.tabIndex = htmlActive ? 0 : -1;
    tabCss.tabIndex = htmlActive ? -1 : 0;

    htmlEditor.hidden = !htmlActive;
    cssEditor.hidden = htmlActive;

    updateEditorMeta();

    if (focus) {
      (htmlActive ? htmlEditor : cssEditor).focus();
    }
  };

  const updateChallengeChrome = () => {
    const data = challenges[activeKey];

    challengeNumber.textContent = data.number;
    challengeTitle.textContent = data.title;
    challengeIntro.textContent = data.intro;
    challengeCategory.textContent = data.category;
    challengeTime.textContent = data.time;

    challengeLevel.innerHTML = "";
    const levelCount = data.level || 0;
    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("i");
      if (index >= levelCount) dot.className = "is-off";
      challengeLevel.append(dot);
    }
    const levelLabel = document.createElement("span");
    levelLabel.textContent = levelCount === 0 ? "自由" : levelCount === 1 ? "入门" : levelCount === 2 ? "进阶" : "挑战";
    challengeLevel.append(levelLabel);

    challengeChecklist.innerHTML = "";
    data.list.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      challengeChecklist.append(li);
    });

    challengeHint.textContent = data.hint;
    hintBox.open = false;

    challengePills.forEach((pill) => {
      const active = pill.dataset.challenge === activeKey;
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", String(active));
    });

    solutionBtn.disabled = !data.solutionCss;
    solutionBtn.hidden = !data.solutionCss;
    solutionBtn.textContent = "看参考答案";

    const url = new URL(window.location.href);
    url.searchParams.set("challenge", activeKey);
    try {
      window.history.replaceState({}, "", url);
    } catch {
      /* file:// previews can block history updates */
    }

    document.title = `${data.title} · 代码操场 · 页间`;
  };

  const loadChallenge = (key, options = {}) => {
    if (!challenges[key]) return;

    if (!solutionMode && options.save !== false) saveDraft();

    window.clearTimeout(saveTimer);
    window.clearTimeout(renderTimer);

    activeKey = key;
    solutionMode = false;
    myVersion = null;

    const data = challenges[key];
    const draft = drafts[key];

    htmlEditor.value = draft && typeof draft.html === "string" ? draft.html : data.html;
    cssEditor.value = draft && typeof draft.css === "string" ? draft.css : data.css;

    updateChallengeChrome();
    setTab("css");
    updateEditorMeta();
    renderPreview();
    updateStatus("草稿自动保存");
  };

  const showSolution = () => {
    const data = challenges[activeKey];
    if (!data.solutionCss) return;

    if (solutionMode) {
      if (!myVersion) return;
      htmlEditor.value = myVersion.html;
      cssEditor.value = myVersion.css;
      solutionMode = false;
      myVersion = null;
      solutionBtn.textContent = "看参考答案";
      updateStatus("已恢复你的版本");
    } else {
      saveDraft();
      myVersion = { html: htmlEditor.value, css: cssEditor.value };
      solutionMode = true;
      htmlEditor.value = data.html;
      cssEditor.value = data.solutionCss;
      solutionBtn.textContent = "回到我的版本";
      updateStatus("正在查看参考答案");
    }

    setTab("css");
    updateEditorMeta();
    renderPreview();
  };

  const resetChallenge = () => {
    const data = challenges[activeKey];
    window.clearTimeout(saveTimer);
    window.clearTimeout(renderTimer);
    solutionMode = false;
    myVersion = null;
    htmlEditor.value = data.html;
    cssEditor.value = data.css;
    delete drafts[activeKey];
    writeDrafts();
    solutionBtn.textContent = "看参考答案";
    setTab("css");
    updateEditorMeta();
    renderPreview();
    updateStatus("已恢复初始代码");
  };

  const handleEditorInput = () => {
    updateEditorMeta();
    scheduleRender();
    scheduleSave();
  };

  [htmlEditor, cssEditor].forEach((editor) => {
    editor.addEventListener("input", handleEditorInput);
    editor.addEventListener("scroll", () => {
      if ((activeTab === "css" ? cssEditor : htmlEditor) === editor) {
        lineNumbers.scrollTop = editor.scrollTop;
      }
    });
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText("  ", start, end, "end");
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        window.clearTimeout(renderTimer);
        renderPreview();
      }
    });
  });

  tabHtml.addEventListener("click", () => setTab("html"));
  tabCss.addEventListener("click", () => setTab("css"));

  [tabHtml, tabCss].forEach((tab) => {
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const next = activeTab === "html" ? "css" : "html";
      setTab(next, true);
    });
  });

  challengePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      loadChallenge(pill.dataset.challenge);
    });
  });

  solutionBtn.addEventListener("click", showSolution);
  resetBtn.addEventListener("click", resetChallenge);

  openPreview.addEventListener("click", () => {
    const blob = new Blob([buildDocument()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const popup = window.open(url, "_blank");
    if (popup) {
      popup.opener = null;
      previewNote.textContent = "已在新窗口打开你的页面";
    } else {
      previewNote.textContent = "浏览器拦截了新窗口，请允许弹窗";
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  });

  loadChallenge(activeKey, { save: false });
})();
