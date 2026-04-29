import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener("turbo:load", () => {
  const btn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("menu-close");
  const nav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("overlay");

  if (!btn || !closeBtn || !nav || !overlay) return;

  const closeMenu = () => {
    nav.classList.remove("active");
    overlay.classList.remove("active");
  };

  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});
