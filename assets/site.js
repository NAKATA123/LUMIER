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
    "#about p",
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
initFlowMap();
initCardTilt();
