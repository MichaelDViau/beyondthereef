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
        '.promo-float{position:fixed;left:14px;bottom:16px;z-index:390;width:min(300px,calc(100vw - 28px));background:rgba(255,140,0,.9);border:1px solid rgba(255,255,255,.45);border-radius:14px;box-shadow:0 12px 30px rgba(139,69,0,.32);padding:14px 38px 14px 14px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);overflow:hidden;transition:transform .42s cubic-bezier(.22,.61,.36,1),width .42s cubic-bezier(.22,.61,.36,1),height .42s cubic-bezier(.22,.61,.36,1),padding .42s cubic-bezier(.22,.61,.36,1),border-radius .42s cubic-bezier(.22,.61,.36,1)}' +
        '.promo-main{transition:opacity .24s ease,transform .3s ease}' +
        '.promo-close{position:absolute;top:8px;right:8px;width:22px;height:22px;border:0;border-radius:50%;background:rgba(255,255,255,.25);color:#fff;font-size:14px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .2s ease,transform .2s ease}' +
        '.promo-kicker{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0 0 6px}' +
        '.promo-text{font-size:13px;line-height:1.45;font-weight:700;color:#fff;margin:0 0 10px}' +
        '.promo-link{display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border-radius:999px;background:#fff;color:#bf4f00;font-size:12px;font-weight:800;text-decoration:none}' +
        '.promo-pill{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;opacity:0;transform:scale(.84);pointer-events:none;transition:opacity .24s ease,transform .34s cubic-bezier(.22,.61,.36,1)}' +
        '.promo-float.is-collapsed{width:34px;height:34px;padding:0;border-radius:8px;transform:translateX(-8px);cursor:pointer}' +
        '.promo-float.is-collapsed .promo-main,.promo-float.is-collapsed .promo-close{opacity:0;transform:translateX(-6px);pointer-events:none}' +
        '.promo-float.is-collapsed .promo-pill{opacity:1;transform:scale(1)}' +
        '@media(max-width:767px){.promo-float{left:10px;bottom:10px;width:min(270px,calc(100vw - 20px));padding:12px 34px 12px 12px}.promo-text{font-size:12px}.promo-link{font-size:11px;padding:7px 10px}.promo-float.is-collapsed{width:32px;height:32px;transform:translateX(-6px)}}';
      doc.head.appendChild(style);
    }

    var promo = doc.getElementById('promoFloat');
    if (!promo) {
      promo = doc.createElement('aside');
      promo.className = 'promo-float';
      promo.id = 'promoFloat';
      promo.setAttribute('aria-label', 'Low season promotion');
      promo.innerHTML = '<button class="promo-close" id="promoClose" type="button" aria-label="Close promotion">✕</button>' +
        '<div class="promo-main">' +
        '<p class="promo-kicker">Low season promo</p>' +
        '<p class="promo-text">Up to <strong>30% discount</strong> on our most popular experiences. Reach out to us directly on WhatsApp.</p>' +
        '<a href="https://wa.me/529841670697?text=Hi%20Beyond%20the%20Reef!%20I%20want%20to%20book%20the%20low%20season%20promo." class="promo-link" target="_blank" rel="noopener">Chat on WhatsApp</a>' +
        '</div>' +
        '<span class="promo-pill" aria-hidden="true">%</span>';
      doc.body.appendChild(promo);
    }

    var closeBtn = promo.querySelector('.promo-close');
    if (!closeBtn || promo.dataset.promoBound === '1') return;
    promo.dataset.promoBound = '1';

    var collapsed = sessionStorage.getItem('btr_promo_collapsed') === '1';
    if (collapsed) promo.classList.add('is-collapsed');

    closeBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      promo.classList.add('is-collapsed');
      sessionStorage.setItem('btr_promo_collapsed', '1');
    });

    promo.addEventListener('click', function (event) {
      var onLink = event.target && event.target.closest && event.target.closest('.promo-link');
      if (onLink) return;
      if (!promo.classList.contains('is-collapsed')) return;
      promo.classList.remove('is-collapsed');
      sessionStorage.setItem('btr_promo_collapsed', '0');
    });
  }

  setupGlobalPromo();
})();
