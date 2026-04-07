/* =============================================
   Shared tour-page JavaScript
   - Photo slider (psTrack / psPrev / psNext / psCtr)
   - Scroll reveal (.rv elements)
   =============================================*/
(function () {
  'use strict';

  /* ── Photo Slider ─────────────────────────────────────── */
  (function () {
    var track   = document.getElementById('psTrack');
    var prevBtn = document.getElementById('psPrev');
    var nextBtn = document.getElementById('psNext');
    var ctrEl   = document.getElementById('psCtr');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.ps-slide'));
    var N = slides.length;
    if (!N) return;

    var cur = 0;
    var busy = false; /* animation guard – prevents double-fire during transition */

    /* Preload image inside a slide (noop if already loaded) */
    function loadSlide(idx) {
      var slide = slides[((idx % N) + N) % N];
      if (!slide) return;
      var img = slide.querySelector('img');
      if (!img || img.getAttribute('src')) return;
      if (img.dataset && img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
        img.decoding = 'async';
        img.addEventListener('load',  function () { img.classList.add('loaded'); }, { once: true });
        img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
      }
    }

    function go(i) {
      if (busy) return;
      busy = true;
      setTimeout(function () { busy = false; }, 370); /* matches .35s CSS transition + small buffer */

      cur = ((i % N) + N) % N;

      /* Slide the track */
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';

      /* Update counter */
      if (ctrEl) ctrEl.textContent = (cur + 1) + ' / ' + N;

      /* Disable buttons when only 1 slide */
      if (prevBtn) prevBtn.disabled = (N <= 1);
      if (nextBtn) nextBtn.disabled = (N <= 1);

      /* Preload: current, next, previous — so any direction swipe is instant */
      loadSlide(cur);
      loadSlide(cur + 1);
      loadSlide(cur - 1);
    }

    /* Wire buttons */
    if (prevBtn) prevBtn.addEventListener('click', function () { go(cur - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(cur + 1); });

    /* Touch swipe on the image area */
    var swipeX = 0, swipeY = 0;
    track.addEventListener('touchstart', function (e) {
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeX;
      var dy = e.changedTouches[0].clientY - swipeY;
      /* Horizontal swipe dominant and ≥ 30 px */
      if (Math.abs(dx) >= 30 && Math.abs(dx) > Math.abs(dy)) {
        go(cur + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });

    /* Keyboard navigation */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(cur - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
    });

    /* Init */
    loadSlide(0);
    loadSlide(1);
    go(0);
  })();

  /* ── Scroll Reveal ────────────────────────────────────── */
  (function () {
    if (!window.IntersectionObserver) {
      var els = document.querySelectorAll('.rv');
      for (var i = 0; i < els.length; i++) els[i].classList.add('vis');
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
    var els = document.querySelectorAll('.rv');
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  })();

})();
