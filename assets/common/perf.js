(function () {
  var doc = document;
  var win = window;

  function onceLoaded(img) {
    if (!img) return;
    if (img.complete) {
      img.classList.add('loaded');
      return;
    }
    img.addEventListener('load', function () {
      img.classList.add('loaded');
    }, { once: true });
  }

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

  function hydrateImage(img) {
    if (!img || !img.dataset) return;

    var hasSource = false;
    if (img.dataset.src && !img.getAttribute('src')) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      hasSource = true;
    } else if (img.dataset.src) {
      img.removeAttribute('data-src');
    }

    if (img.dataset.srcset && !img.getAttribute('srcset')) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
      hasSource = true;
    } else if (img.dataset.srcset) {
      img.removeAttribute('data-srcset');
    }

    if (hasSource && typeof img.decode === 'function') {
      img.decode().catch(function () {
        // Ignore decode errors; browser will still paint the image.
      });
    }

    onceLoaded(img);
  }

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

    // Promote the first visible image as an LCP fallback.
    var imgs = Array.prototype.slice.call(doc.images || []);
    for (var i = 0; i < imgs.length; i += 1) {
      var rect = imgs[i].getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < win.innerHeight) {
        promoteImage(imgs[i], true);
        hydrateImage(imgs[i]);
        break;
      }
    }
  }

  function primeNearFoldDataImages() {
    var nearFold = doc.querySelectorAll('img[data-src], img[data-srcset]');
    var viewportBottom = win.innerHeight * 1.6;

    Array.prototype.forEach.call(nearFold, function (img) {
      var rect = img.getBoundingClientRect();
      if (rect.top < viewportBottom) {
        promoteImage(img, rect.top < win.innerHeight);
        hydrateImage(img);
      }
    });
  }

  Array.prototype.forEach.call(doc.querySelectorAll('img'), function (img) {
    promoteImage(img, false);
    onceLoaded(img);
  });

  primeCriticalImages();
  primeNearFoldDataImages();

  // Lazy hydrate the rest of data-src images.
  if (!('IntersectionObserver' in win)) {
    Array.prototype.forEach.call(doc.querySelectorAll('img[data-src], img[data-srcset]'), hydrateImage);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var img = entry.target;
      hydrateImage(img);
      io.unobserve(img);
    });
  }, { rootMargin: '500px 0px' });

  Array.prototype.forEach.call(doc.querySelectorAll('img[data-src], img[data-srcset]'), function (img) {
    io.observe(img);
  });

  // Improve stability: pause heavy media decoding while tab is hidden and resume preloading when visible again.
  doc.addEventListener('visibilitychange', function () {
    if (doc.visibilityState !== 'visible') return;
    primeNearFoldDataImages();
  });
})();
