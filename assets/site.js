const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const mobileNav = document.getElementById("mobile-nav");
const overlay = document.getElementById("overlay");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function openMenu() {
  mobileNav.classList.add("active");
  overlay.classList.add("active");
}

function closeMenu() {
  mobileNav.classList.remove("active");
  overlay.classList.remove("active");
}

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

if (!prefersReducedMotion) {
  document.body.classList.add("motion-ready");
}

function initHeaderMotion() {
  const header = document.querySelector(".header");
  if (!header) return;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initHeroFlecks() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion) return;

  const fleckCount = 18;
  for (let index = 0; index < fleckCount; index += 1) {
    const fleck = document.createElement("span");
    const size = 5 + Math.random() * 7;
    fleck.className = "hero-fleck";
    fleck.style.setProperty("--fleck-left", `${8 + Math.random() * 84}%`);
    fleck.style.setProperty("--fleck-top", `${16 + Math.random() * 72}%`);
    fleck.style.setProperty("--fleck-size", `${size}px`);
    fleck.style.setProperty("--fleck-delay", `${Math.random() * 4.5}s`);
    fleck.style.setProperty("--fleck-duration", `${5.8 + Math.random() * 4.4}s`);
    fleck.style.setProperty("--fleck-drift", `${Math.random() > 0.5 ? "" : "-"}${10 + Math.random() * 26}px`);
    fleck.style.setProperty("--fleck-opacity", `${0.24 + Math.random() * 0.34}`);
    hero.appendChild(fleck);
  }
}

function initRevealMotion() {
  const revealTargets = document.querySelectorAll([
    "#about h2",
    ".about-copy",
    ".about-points",
    ".news-heading",
    ".news-stage",
    ".flow-heading",
    ".flow-map",
    ".flow-item",
    ".page-hero h1",
    ".page-hero p",
    ".staff-heading",
    ".staff-card",
    ".price-lead",
    ".price-list",
    ".option-item",
    ".voices-title",
    ".voice-item",
    ".side-banner",
    ".side-consult",
    ".side-trust",
    ".side-number",
    ".members-hero-copy",
    ".members-hero-panel",
    ".section-heading",
    ".member-card",
    ".stats-summary > div",
    ".chart-card",
    ".members-cta h2",
    ".members-cta .btn"
  ].join(","));

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  revealTargets.forEach((target) => observer.observe(target));
}

function initNewsSlider() {
  const stage = document.querySelector(".news-stage");
  const cards = Array.from(document.querySelectorAll("[data-news-card]"));
  const modal = document.getElementById("news-modal");
  const modalClose = document.getElementById("news-modal-close");
  const modalTitle = document.getElementById("news-modal-title");
  const modalDate = document.getElementById("news-modal-date");
  const modalBody = document.getElementById("news-modal-body");
  const dotsContainer = document.getElementById("news-dots");
  if (!stage || !cards.length || !modal) return;

  const isMobile = () => window.innerWidth <= 768;
  let activeIndex = 0;
  let lastMove = 0;

  function wrapIndex(index) {
    return (index + cards.length) % cards.length;
  }

  function getSlot(index) {
    const raw = index - activeIndex;
    const half = Math.floor(cards.length / 2);
    if (raw > half) return raw - cards.length;
    if (raw < -half) return raw + cards.length;
    return raw;
  }

  function renderSlider() {
    cards.forEach((card, index) => {
      card.dataset.slot = String(getSlot(index));
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  function moveSlider(direction) {
    activeIndex = wrapIndex(activeIndex + direction);
    renderSlider();
  }

  function openArticle(card) {
    modalTitle.textContent = card.dataset.title || "";
    modalDate.textContent = card.dataset.date || "";
    modalBody.textContent = card.dataset.body || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modalClose?.focus();
  }

  function closeArticle() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // ドット生成
  const dots = cards.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "news-dot";
    dot.setAttribute("aria-label", `Issue ${index + 1}`);
    dot.addEventListener("click", () => {
      if (isMobile()) {
        cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        activeIndex = index;
        renderSlider();
      }
    });
    dotsContainer?.appendChild(dot);
    return dot;
  });

  renderSlider();

  // デスクトップ：マウスホバーナビ
  if (!prefersReducedMotion) {
    stage.addEventListener("pointermove", (event) => {
      if (isMobile() || event.pointerType === "touch") return;
      const now = Date.now();
      if (now - lastMove < 650) return;
      const rect = stage.getBoundingClientRect();
      const position = (event.clientX - rect.left) / rect.width;
      if (position > 0.64) {
        moveSlider(1);
        lastMove = now;
      } else if (position < 0.36) {
        moveSlider(-1);
        lastMove = now;
      }
    });
  }

  // モバイル：スクロール位置でドットを更新
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!isMobile()) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cards.indexOf(entry.target);
          dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
        }
      });
    }, { root: stage, threshold: 0.6 });
    cards.forEach((card) => observer.observe(card));
  }

  // カードタップでモーダル
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (isMobile() || card.dataset.slot === "0") openArticle(card);
    });
  });

  modalClose?.addEventListener("click", closeArticle);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeArticle();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeArticle();
    }
  });
}

function initFlowMap() {
  const flowItems = document.querySelectorAll(".flow-item");
  const flowDots = document.querySelectorAll(".flow-map span");
  if (!flowItems.length || !flowDots.length) return;

  flowDots[0].classList.add("is-active");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const index = Array.from(flowItems).indexOf(entry.target);
      flowDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex <= index);
      });
    });
  }, {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.2
  });

  flowItems.forEach((item) => observer.observe(item));
}

function initCardTilt() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const tiltCards = document.querySelectorAll(".flow-item, .staff-card, .member-card");
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-x", `${y * -5}deg`);
      card.style.setProperty("--tilt-y", `${x * 5}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

initHeaderMotion();
initHeroFlecks();
initRevealMotion();
initNewsSlider();
initFlowMap();
initCardTilt();
