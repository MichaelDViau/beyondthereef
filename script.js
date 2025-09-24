(function () {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupThemeToggle(prefersDark);
    setupHeroSlider();
    setupTourBuilder();
    setCurrentYear();
  });
})();

function setupNavigation() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('.nav__links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function setupThemeToggle(prefersDark) {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const storedTheme = localStorage.getItem('preferred-theme');
  const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark?.matches;

  if (shouldUseDark) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '🌙';
    toggle.setAttribute('aria-pressed', 'true');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggle.textContent = isDark ? '🌙' : '🌞';
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    localStorage.setItem('preferred-theme', isDark ? 'dark' : 'light');
  });

  prefersDark?.addEventListener?.('change', (event) => {
    if (!localStorage.getItem('preferred-theme')) {
      document.body.classList.toggle('dark-mode', event.matches);
      toggle.textContent = event.matches ? '🌙' : '🌞';
      toggle.setAttribute('aria-pressed', event.matches ? 'true' : 'false');
    }
  });
}

function setupHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dotsContainer = slider.querySelector('.hero-slider__dots');
  const prevButton = slider.querySelector('[data-slide="prev"]');
  const nextButton = slider.querySelector('[data-slide="next"]');

  if (!slides.length) return;

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (currentIndex === -1) {
    slides[0].classList.add('is-active');
    currentIndex = 0;
  }

  const HAVE_CURRENT_DATA =
    typeof HTMLMediaElement !== 'undefined' ? HTMLMediaElement.HAVE_CURRENT_DATA : 2;
  let autoRotateTimer = null;
  const AUTO_ROTATE_INTERVAL = 7000;
  const hasMultipleSlides = slides.length > 1;

  slides.forEach((slide, index) => {
    const media = slide.querySelector('.hero-slide__media');
    if (!media) return;

    media.preload = index === currentIndex ? 'auto' : 'metadata';

    const markLoaded = () => {
      media.classList.add('is-loaded');
    };

    if (media.readyState >= HAVE_CURRENT_DATA) {
      markLoaded();
    } else {
      ['loadeddata', 'canplay'].forEach((eventName) => {
        media.addEventListener(eventName, markLoaded, { once: true });
      });
    }

    media.addEventListener(
      'error',
      () => {
        slide.classList.add('hero-slide--unavailable');
      },
      { once: true }
    );
  });

  function setSlideState(slide, isActive) {
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    const video = slide.querySelector('video');
    if (!video) return;

    if (isActive) {
      if (video.preload !== 'auto') {
        video.preload = 'auto';
      }
      if (video.readyState < HAVE_CURRENT_DATA && typeof video.load === 'function') {
        video.load();
      }
      if (typeof video.play === 'function') {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
    } else {
      if (video.preload !== 'metadata') {
        video.preload = 'metadata';
      }
      if (typeof video.pause === 'function') {
        video.pause();
      }
      if (!video.loop) {
        try {
          video.currentTime = 0;
        } catch {
          // Some browsers might not allow resetting the currentTime for certain sources.
        }
      }
    }
  }

  function syncSlides() {
    slides.forEach((slide, index) => {
      setSlideState(slide, index === currentIndex);
    });
  }

  function goToSlide(index) {
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === currentIndex) return;

    const previousSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];

    setSlideState(previousSlide, false);
    currentIndex = nextIndex;
    setSlideState(nextSlide, true);
    updateDots();
    restartAutoRotate();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function previousSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoRotate() {
    if (!hasMultipleSlides) return;
    stopAutoRotate();
    autoRotateTimer = window.setInterval(nextSlide, AUTO_ROTATE_INTERVAL);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      window.clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function restartAutoRotate() {
    if (!hasMultipleSlides) return;
    stopAutoRotate();
    autoRotateTimer = window.setInterval(nextSlide, AUTO_ROTATE_INTERVAL);
  }

  function buildDots() {
    if (!dotsContainer || !hasMultipleSlides) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'hero-slider__dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.append(dot);
    });

    updateDots();
  }

  function updateDots() {
    if (!dotsContainer || !hasMultipleSlides) return;
    const dots = dotsContainer.querySelectorAll('.hero-slider__dot');
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
    });
  }

  syncSlides();

  prevButton?.addEventListener('click', previousSlide);
  nextButton?.addEventListener('click', nextSlide);

  if (hasMultipleSlides) {
    slider.addEventListener('mouseenter', stopAutoRotate);
    slider.addEventListener('mouseleave', startAutoRotate);
    slider.addEventListener('focusin', stopAutoRotate);
    slider.addEventListener('focusout', startAutoRotate);
  }

  buildDots();
  startAutoRotate();
}

function setupTourBuilder() {
  const form = document.querySelector('#tour-builder-form');
  const itineraryList = document.querySelector('#itinerary-list');
  const clearButton = document.querySelector('#clear-itinerary');

  if (!form || !itineraryList) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const activity = formData.get('activity');
    const date = formData.get('date');
    const notes = formData.get('notes');

    if (!activity) return;

    const item = document.createElement('li');
    item.className = 'itinerary-item';

    const heading = document.createElement('strong');
    heading.textContent = activity;
    item.append(heading);

    if (date) {
      const meta = document.createElement('div');
      meta.className = 'itinerary-item__meta';
      meta.innerHTML = `<span>📅 ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))}</span>`;
      item.append(meta);
    }

    if (notes) {
      const note = document.createElement('p');
      note.textContent = notes;
      item.append(note);
    }

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'itinerary-item__remove';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      item.remove();
      updatePlaceholder();
    });

    item.append(remove);
    itineraryList.append(item);
    form.reset();
    updatePlaceholder();
  });

  clearButton?.addEventListener('click', () => {
    itineraryList.innerHTML = '';
    updatePlaceholder();
  });

  function updatePlaceholder() {
    if (!itineraryList.children.length) {
      const placeholder = document.createElement('li');
      placeholder.className = 'itinerary-list__placeholder';
      placeholder.textContent = 'Your ideas will appear here. Add the first one to begin crafting the perfect tour.';
      itineraryList.append(placeholder);
    } else {
      const placeholder = itineraryList.querySelector('.itinerary-list__placeholder');
      placeholder?.remove();
    }
  }
}

function setCurrentYear() {
  const year = document.querySelector('#current-year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}
