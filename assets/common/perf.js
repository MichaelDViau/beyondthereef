(function () {
  // Decode images off the main rendering critical path.
  document.querySelectorAll('img').forEach(function (img) {
    if (!img.decoding) img.decoding = 'async';
    if (!img.loading && !img.hasAttribute('fetchpriority')) img.loading = 'lazy';
  });

  // Lazy hydrate sliders/hero images that keep data-src to reduce eager network pressure.
  if (!window.IntersectionObserver) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var img = entry.target;
      if (img.dataset && img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      if (img.dataset && img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
      io.unobserve(img);
    });
  }, { rootMargin: '600px 0px' });

  document.querySelectorAll('img[data-src], img[data-srcset]').forEach(function (img) {
    io.observe(img);
  });
})();
