/* =========================================================
   Shared site behaviour — loaded by every page.
   - Fixed navigation bar (opaque on scroll)
   - Mobile hamburger menu (open / close / scroll lock)
   - Scroll-reveal animation for .rv elements
   ========================================================= */
(function () {
  'use strict';

  /* ── Navigation bar: turn opaque after scrolling past the hero ── */
  var nav = document.getElementById('mainNav');
  if (nav) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('opaque', window.scrollY > 80);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  var ham = document.getElementById('ham');
  var menu = document.getElementById('mobMenu');
  var closeBtn = document.getElementById('mobClose');

  function openMenu() {
    menu.classList.add('open');
    ham.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; /* lock page scroll behind the menu */
  }

  function closeMenu() {
    menu.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (ham && menu) {
    ham.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    /* Any menu link closes the overlay before navigating */
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ── Scroll reveal: fade .rv elements in as they enter the viewport ── */
  var revealEls = document.querySelectorAll('.rv');
  if (!revealEls.length) return;

  if (!window.IntersectionObserver) {
    /* Old browsers: show everything immediately */
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('vis'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
})();
