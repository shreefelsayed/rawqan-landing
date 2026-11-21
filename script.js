// Rwaqan landing — lightweight interactions (no dependencies)
(function () {
  "use strict";

  // Current year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal-on-scroll for cards/steps/features — progressive enhancement only.
  // Content is fully visible without JS; we only animate when IO is supported,
  // and a safety timer guarantees everything shows even if the observer misfires.
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".step,.feat,.dash,.qa,.band__item");
  function showAll() {
    items.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
  }
  if (!prefersReduced && "IntersectionObserver" in window && items.length) {
    items.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = "1";
          en.target.style.transform = "none";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
    // Fail-safe: never leave content hidden.
    setTimeout(showAll, 2500);
  }

  // FAQ: keep it an accordion (only one open at a time)
  var qas = document.querySelectorAll(".faq .qa");
  qas.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) {
        qas.forEach(function (o) { if (o !== d) o.open = false; });
      }
    });
  });
})();
