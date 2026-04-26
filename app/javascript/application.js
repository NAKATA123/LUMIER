import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener("turbo:load", () => {
  const btn = document.getElementById("menu-toggle");
  const nav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("overlay");

  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // 背景クリックで閉じる
  overlay.addEventListener("click", () => {
    nav.classList.remove("active");
    overlay.classList.remove("active");
  });
});
