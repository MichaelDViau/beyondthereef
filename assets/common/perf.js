(function () {
  var doc = document;
  var win = window;
  var nav = win.navigator || {};
  var conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var effectiveType = (conn && conn.effectiveType) || '';
  var slowConnection = /2g/.test(effectiveType);
  var budgetMode = saveData || slowConnection;

  /* ── Mark image as loaded (adds .loaded class for CSS fade-in) ── */
  function onceLoaded(img) {
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      return;
    }
    img.addEventListener('load', function () {
      img.classList.add('loaded');
    }, { once: true });
    img.addEventListener('error', function () {
      /* On error still remove the blur / placeholder state */
      img.classList.add('loaded');
    }, { once: true });
  }

  /* ── Set priority hints on an image ── */
  function promoteImage(img, isCritical) {
    if (!img) return;
    if (!img.decoding) img.decoding = 'async';
    if (isCritical) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      onceLoaded(img);
      return;
    }
    if (!img.loading && !img.hasAttribute('fetchpriority')) {
      img.loading = 'lazy';
    }
  }

  /* ── Swap data-src / data-srcset into real attributes ── */
  function hydrateImage(img) {
    if (!img || !img.dataset) return;

    var hasSource = false;

    if (img.dataset.src && !img.getAttribute('src')) {
      img.src = img.dataset.src;
      delete img.dataset.src;
      hasSource = true;
    } else if (img.dataset.src) {
      delete img.dataset.src;
    }

    if (img.dataset.srcset && !img.getAttribute('srcset')) {
      img.srcset = img.dataset.srcset;
      delete img.dataset.srcset;
      hasSource = true;
    } else if (img.dataset.srcset) {
      delete img.dataset.srcset;
    }

    if (hasSource && typeof img.decode === 'function') {
      /* decode() resolves when the image is ready to paint —
         this avoids the single-frame "flash of invisible image"
         that can appear when an image completes loading mid-scroll. */
      img.decode().then(function () {
        img.classList.add('loaded');
      }).catch(function () {
        /* decode() may reject for SVG or display:none images; fall back */
        onceLoaded(img);
      });
      return;
    }

    onceLoaded(img);
  }

  /* ── Defer iframe embeds until near viewport ── */
  function hydrateIframe(frame) {
    if (!frame || !frame.dataset || !frame.dataset.src || frame.getAttribute('src')) return;
    frame.setAttribute('src', frame.dataset.src);
    delete frame.dataset.src;
  }

  /* ── Prime above-the-fold images (LCP candidates) ── */
  function primeCriticalImages() {
    var criticalSelectors = [
      '.hs-img.hs-on',
      '.hero img',
      '.logo-img',
      '.navbar img',
      '.ps-track .ps-slide:first-child img',
      '#privTrack .tc img',
      '#sharedTrack .tc img'
    ];

    var seen = [];
    criticalSelectors.forEach(function (selector) {
      var found = doc.querySelector(selector);
      if (!found || seen.indexOf(found) !== -1) return;
      seen.push(found);
      promoteImage(found, true);
      hydrateImage(found);
    });

    /* Promote the first few visible images as LCP fallbacks */
    var imgs = Array.prototype.slice.call(doc.images || []);
    var visiblePromoted = 0;
    var maxVisiblePromotions = budgetMode ? 1 : 4;
    for (var i = 0; i < imgs.length; i++) {
      var rect = imgs[i].getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < win.innerHeight) {
        promoteImage(imgs[i], true);
        hydrateImage(imgs[i]);
        visiblePromoted++;
        if (visiblePromoted >= maxVisiblePromotions) break;
      }
    }
  }

  /* ── Hydrate images that are close to the viewport ── */
  function primeNearFoldDataImages() {
    var nearFold = doc.querySelectorAll('img[data-src], img[data-srcset]');
    /* Load anything within 2× viewport height on fast connections,
       1.2× on slow / data-saver — gives a comfortable preload buffer
       without wasting bandwidth on images far below the fold. */
    var viewportBottom = win.innerHeight * (budgetMode ? 1.2 : 2.5);

    Array.prototype.forEach.call(nearFold, function (img) {
      var rect = img.getBoundingClientRect();
      if (rect.top < viewportBottom) {
        promoteImage(img, rect.top < win.innerHeight);
        hydrateImage(img);
      }
    });
  }

  /* ── Preload the first N slides of every track ── */
  function preloadFirstSlides() {
    var tracks = doc.querySelectorAll('.ps-track, #privTrack, #sharedTrack');
    /* On fast connections load 4 slides per track so the first manual
       swipe is always instant; budget mode loads just 1. */
    var perTrack = budgetMode ? 1 : 4;
    Array.prototype.forEach.call(tracks, function (track) {
      var imgs = track.querySelectorAll('img[data-src], img[data-srcset]');
      for (var i = 0; i < imgs.length && i < perTrack; i++) {
        promoteImage(imgs[i], i === 0);
        hydrateImage(imgs[i]);
      }
    });
  }

  /* ── Baseline: mark already-loaded images ── */
  Array.prototype.forEach.call(doc.querySelectorAll('img'), function (img) {
    promoteImage(img, false);
    onceLoaded(img);
  });

  primeCriticalImages();
  preloadFirstSlides();
  primeNearFoldDataImages();

  /* Prime near-the-fold deferred embeds */
  Array.prototype.forEach.call(doc.querySelectorAll('iframe[data-src]'), function (frame) {
    var rect = frame.getBoundingClientRect();
    if (rect.top < win.innerHeight * 1.5) hydrateIframe(frame);
  });

  /* ── Fallback for browsers without IntersectionObserver ── */
  if (!('IntersectionObserver' in win)) {
    Array.prototype.forEach.call(
      doc.querySelectorAll('img[data-src], img[data-srcset]'),
      hydrateImage
    );
    Array.prototype.forEach.call(
      doc.querySelectorAll('iframe[data-src]'),
      hydrateIframe
    );
    return;
  }

  /* ── IntersectionObserver lazy-hydration ──
     800px rootMargin gives a generous preload buffer so images
     are already decoded before the user reaches them.
  */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var img = entry.target;
      if (img.tagName === 'IFRAME') hydrateIframe(img);
      else hydrateImage(img);
      io.unobserve(img);
    });
  }, { rootMargin: '800px 0px' });

  Array.prototype.forEach.call(
    doc.querySelectorAll('img[data-src], img[data-srcset]'),
    function (img) { io.observe(img); }
  );
  Array.prototype.forEach.call(
    doc.querySelectorAll('iframe[data-src]'),
    function (frame) { io.observe(frame); }
  );

  /* ── Resume preloading when tab becomes visible again ── */
  doc.addEventListener('visibilitychange', function () {
    if (doc.visibilityState !== 'visible') return;
    primeNearFoldDataImages();
  });


  /* ── Global promo widget (all pages) ── */
  function setupGlobalPromo() {
    if (!doc.body) return;

    var path = (win.location && win.location.pathname) || '';
    if (/\/welcome(\.html)?$/i.test(path)) return;

    if (!doc.getElementById('promoFloatStyles')) {
      var style = doc.createElement('style');
      style.id = 'promoFloatStyles';
      style.textContent = '' +
        '.promo-float{position:fixed;left:20px;bottom:51px;z-index:400;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,140,0,.95);border:1px solid rgba(255,255,255,.45);box-shadow:0 4px 18px rgba(188,24,136,.32);text-decoration:none;transition:transform .22s ease}' +
        '.promo-float:hover{transform:scale(1.1)}' +
        '.promo-pill{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:22px;font-weight:900;color:#fff;line-height:1}' +
        '@media(max-width:767px){.promo-float{left:10px;bottom:50px}}';
      doc.head.appendChild(style);
    }

    if (doc.getElementById('promoFloat')) return;

    var promo = doc.createElement('a');
    promo.className = 'promo-float';
    promo.id = 'promoFloat';
    promo.href = 'https://wa.me/529841670697?text=Hi%20Beyond%20the%20Reef!%20I%20want%20to%20book%20the%20low%20season%20promo.';
    promo.target = '_blank';
    promo.rel = 'noopener';
    promo.setAttribute('aria-label', 'Low season promotion');
    promo.innerHTML = '<span class="promo-pill" aria-hidden="true">$</span>';
    doc.body.appendChild(promo);
  }


  setupGlobalPromo();
})();
