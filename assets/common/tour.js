/* =============================================
   Shared tour-page JavaScript
   - Photo slider (psTrack / psPrev / psNext / psCtr)
   - Click-to-open fullscreen lightbox
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

    /* Collect source URLs for every slide (data-src or src) for the lightbox */
    var sources = slides.map(function (s) {
      var img = s.querySelector('img');
      if (!img) return '';
      return img.getAttribute('src') || (img.dataset && img.dataset.src) || '';
    });

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

    /* Touch swipe on the image area — track horizontal vs vertical/tap */
    var swipeX = 0, swipeY = 0, swipeT = 0;
    track.addEventListener('touchstart', function (e) {
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
      swipeT = Date.now();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeX;
      var dy = e.changedTouches[0].clientY - swipeY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var dt = Date.now() - swipeT;
      /* Horizontal swipe dominant and ≥ 30 px */
      if (Math.abs(dx) >= 30 && Math.abs(dx) > Math.abs(dy)) {
        go(cur + (dx < 0 ? 1 : -1));
        return;
      }
      /* Tap (short duration, small movement) → open lightbox at current slide */
      if (dist < 10 && dt < 350) {
        openLightbox(cur);
      }
    }, { passive: true });

    /* Keyboard navigation */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(cur - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
      if (e.key === 'Enter' || e.key === ' ') { openLightbox(cur); e.preventDefault(); }
    });

    /* Click any slide image → open lightbox at that slide.
       Desktop click fires naturally; on mobile the touchend handler above opens it. */
    track.addEventListener('click', function (e) {
      var img = e.target && e.target.closest ? e.target.closest('.ps-slide img') : null;
      if (!img) return;
      var slide = img.closest('.ps-slide');
      var idx = slides.indexOf(slide);
      if (idx < 0) idx = cur;
      openLightbox(idx);
    });

    /* Init */
    loadSlide(0);
    loadSlide(1);
    go(0);

    /* ── Lightbox ───────────────────────────────────────── */
    var lb = null, lbImg = null, lbCtr = null, lbPrev = null, lbNext = null;
    var lbCur = 0;
    var lbTouchX = 0, lbTouchY = 0;

    function buildLightbox() {
      if (lb) return;
      lb = document.createElement('div');
      lb.className = 'btr-lb' + (N <= 1 ? ' single' : '');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Photo viewer');

      var stage = document.createElement('div');
      stage.className = 'btr-lb-stage';

      lbImg = document.createElement('img');
      lbImg.className = 'btr-lb-img';
      lbImg.alt = '';
      lbImg.decoding = 'async';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'btr-lb-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '&times;';

      lbPrev = document.createElement('button');
      lbPrev.className = 'btr-lb-prev';
      lbPrev.setAttribute('aria-label', 'Previous photo');
      lbPrev.innerHTML = '&#8592;';

      lbNext = document.createElement('button');
      lbNext.className = 'btr-lb-next';
      lbNext.setAttribute('aria-label', 'Next photo');
      lbNext.innerHTML = '&#8594;';

      lbCtr = document.createElement('div');
      lbCtr.className = 'btr-lb-ctr';

      stage.appendChild(lbImg);
      stage.appendChild(closeBtn);
      stage.appendChild(lbPrev);
      stage.appendChild(lbNext);
      stage.appendChild(lbCtr);
      lb.appendChild(stage);
      document.body.appendChild(lb);

      /* Interactions */
      closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
      lbPrev.addEventListener('click', function (e) { e.stopPropagation(); lbGo(lbCur - 1); });
      lbNext.addEventListener('click', function (e) { e.stopPropagation(); lbGo(lbCur + 1); });

      /* Click on backdrop (outside image) closes */
      lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target === stage) closeLightbox();
      });

      /* Swipe navigation on mobile */
      lb.addEventListener('touchstart', function (e) {
        lbTouchX = e.touches[0].clientX;
        lbTouchY = e.touches[0].clientY;
      }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - lbTouchX;
        var dy = e.changedTouches[0].clientY - lbTouchY;
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
          lbGo(lbCur + (dx < 0 ? 1 : -1));
        } else if (Math.abs(dy) >= 80 && Math.abs(dy) > Math.abs(dx)) {
          /* Vertical swipe closes */
          closeLightbox();
        }
      }, { passive: true });
    }

    function lbGo(i) {
      lbCur = ((i % N) + N) % N;
      var src = sources[lbCur];
      if (!src) {
        /* Fallback: resolve from DOM in case data-src wasn't captured */
        var img = slides[lbCur] && slides[lbCur].querySelector('img');
        src = img ? (img.getAttribute('src') || (img.dataset && img.dataset.src) || '') : '';
      }
      if (!src) return;
      lbImg.classList.add('loading');
      lbImg.onload = function () { lbImg.classList.remove('loading'); };
      lbImg.onerror = function () { lbImg.classList.remove('loading'); };
      lbImg.src = src;
      lbCtr.textContent = (lbCur + 1) + ' / ' + N;
      /* Keep main slider in sync so closing lands on the viewed photo */
      if (lbCur !== cur) go(lbCur);
    }

    function openLightbox(idx) {
      buildLightbox();
      document.documentElement.classList.add('btr-lb-lock');
      document.body.classList.add('btr-lb-lock');
      lbGo(typeof idx === 'number' ? idx : cur);
      /* Force reflow before adding .open so transition runs */
      /* eslint-disable-next-line no-unused-expressions */
      lb.offsetHeight;
      lb.classList.add('open');
      document.addEventListener('keydown', onLbKey);
    }

    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove('open');
      document.documentElement.classList.remove('btr-lb-lock');
      document.body.classList.remove('btr-lb-lock');
      document.removeEventListener('keydown', onLbKey);
    }

    function onLbKey(e) {
      if (e.key === 'Escape')     { closeLightbox();     e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { lbGo(lbCur - 1);     e.preventDefault(); }
      if (e.key === 'ArrowRight') { lbGo(lbCur + 1);     e.preventDefault(); }
    }
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
