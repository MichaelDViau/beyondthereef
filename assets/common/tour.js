/* =============================================
   Shared tour-page JavaScript
   - Photo slider (psTrack / psPrev / psNext / psDots / psCtr)
   - Scroll reveal (.rv elements)
   =============================================*/
(function () {
  'use strict';

  /* ── Photo Slider ─────────────────────────────────────── */
  (function () {
    var track   = document.getElementById('psTrack');
    var prevBtn = document.getElementById('psPrev');
    var nextBtn = document.getElementById('psNext');
    var dotsEl  = document.getElementById('psDots');
    var ctrEl   = document.getElementById('psCtr');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.ps-slide'));
    var N = slides.length;
    if (!N) return;

    var cur = 0;

    /* Build dots if the container exists but is empty */
    var dots = dotsEl ? Array.prototype.slice.call(dotsEl.querySelectorAll('.ps-dot')) : [];
    if (dotsEl && dots.length !== N) {
      dotsEl.innerHTML = '';
      dots = [];
      for (var i = 0; i < N; i++) {
        var d = document.createElement('button');
        d.className = 'ps-dot';
        d.setAttribute('aria-label', 'Photo ' + (i + 1));
        d.type = 'button';
        dotsEl.appendChild(d);
        dots.push(d);
      }
    }

    /* Preload image inside a slide */
    function loadSlide(idx) {
      var slide = slides[idx];
      if (!slide) return;
      var img = slide.querySelector('img');
      if (!img) return;
      if (img.dataset && img.dataset.src && !img.getAttribute('src')) {
        img.src = img.dataset.src;
        delete img.dataset.src;
        img.decoding = 'async';
        img.addEventListener('load', function () { img.classList.add('loaded'); }, { once: true });
        img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
      }
    }

    function go(i) {
      cur = ((i % N) + N) % N;

      /* Slide the track */
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';

      /* Update counter */
      if (ctrEl) ctrEl.textContent = (cur + 1) + ' / ' + N;

      /* Update dots */
      dots.forEach(function (dot, j) {
        dot.classList.toggle('on', j === cur);
      });

      /* Update prev/next disabled state */
      if (prevBtn) prevBtn.disabled = (N <= 1);
      if (nextBtn) nextBtn.disabled = (N <= 1);

      /* Eagerly load current + next slide */
      loadSlide(cur);
      loadSlide((cur + 1) % N);
    }

    /* Wire buttons */
    if (prevBtn) prevBtn.addEventListener('click', function () { go(cur - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(cur + 1); });

    /* Wire dots */
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { go(i); });
    });

    /* Touch swipe */
    var swipeStartX = 0;
    var swipeStartY = 0;
    track.addEventListener('touchstart', function (e) {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeStartX;
      var dy = e.changedTouches[0].clientY - swipeStartY;
      /* Only trigger if horizontal swipe is dominant and >= 30px */
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        go(cur + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });

    /* Keyboard navigation when slider is focused */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(cur - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
    });

    /* Init: load first two slides, set initial state */
    loadSlide(0);
    loadSlide(1);
    go(0);
  })();

  /* ── Scroll Reveal ────────────────────────────────────── */
  (function () {
    if (!window.IntersectionObserver) {
      /* Fallback: show all immediately */
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
