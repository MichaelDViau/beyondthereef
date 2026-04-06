(function () {
  const STORAGE_KEY = 'btrPreferredLanguage';
  const VALID_LANGS = new Set(['en', 'es', 'fr']);
  const REGION_LANG = { en: 'en', es: 'es-MX', fr: 'fr-CA' };
  const ATTRS = [];
  const PROTECTED = ['Beyond the Reef', 'BEYOND THE REEF', 'Beyond The Reef'];
  const QUICK = {
    es: {
      'Choose your language': 'Elige tu idioma',
      'Continue in English': 'Continuar en inglés',
      'Continuer en français': 'Continuar en francés',
      'Continuar en español': 'Continuar en español',
      'Book Now': 'Reservar ahora',
      'Our Story': 'Nuestra historia',
      'Tours': 'Tours',
      'Reviews': 'Reseñas',
      'Home': 'Inicio'
    },
    fr: {
      'Choose your language': 'Choisissez votre langue',
      'Continue in English': 'Continuer en anglais',
      'Continuer en français': 'Continuer en français',
      'Continuar en español': 'Continuer en espagnol',
      'Book Now': 'Réserver maintenant',
      'Our Story': 'Notre histoire',
      'Tours': 'Excursions',
      'Reviews': 'Avis',
      'Home': 'Accueil'
    }
  };

  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const inFlight = new Map();

  function normalizeLang(value) {
    const lang = String(value || '').toLowerCase().trim();
    return VALID_LANGS.has(lang) ? lang : 'en';
  }

  function getActiveLang() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalizeLang(params.get('lang'));
    const stored = normalizeLang(localStorage.getItem(STORAGE_KEY));
    return params.has('lang') ? fromQuery : stored;
  }

  function getCache(lang) {
    const key = `btrI18nCache:${lang}`;
    let parsed = {};
    try {
      parsed = JSON.parse(localStorage.getItem(key) || '{}');
    } catch (_error) {
      parsed = {};
    }
    return { key, data: parsed && typeof parsed === 'object' ? parsed : {} };
  }

  function saveCache(cache) {
    localStorage.setItem(cache.key, JSON.stringify(cache.data));
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isProtected(text) {
    return PROTECTED.some((name) => text.includes(name));
  }

  function quickTranslate(text, lang) {
    if (lang === 'en') return text;
    const quick = QUICK[lang] || {};
    return quick[text] || text;
  }

  async function fetchTranslation(text, lang) {
    if (lang === 'en') return text;

    const original = normalizeText(text);
    if (!original || isProtected(original)) return text;

    const quick = quickTranslate(original, lang);
    if (quick !== original) return text.replace(original, quick);

    const cache = getCache(lang);
    if (cache.data[original]) {
      return text.replace(original, cache.data[original]);
    }

    const key = `${lang}::${original}`;
    if (!inFlight.has(key)) {
      const promise = (async () => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(original)}&langpair=en|${lang}`;
        const response = await fetch(url);
        if (!response.ok) return original;
        const payload = await response.json();
        const translated = payload?.responseData?.translatedText;
        if (!translated || typeof translated !== 'string') return original;
        cache.data[original] = translated;
        saveCache(cache);
        return translated;
      })();
      inFlight.set(key, promise);
    }

    const translated = await inFlight.get(key);
    inFlight.delete(key);
    return text.replace(original, translated);
  }

  function gatherNodes() {
    const textNodes = [];
    const attrs = [];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const parent = node.parentElement;
      const tag = parent ? parent.tagName : '';
      const value = normalizeText(node.nodeValue);
      if (value && tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'NOSCRIPT' && tag !== 'IFRAME') {
        if (value.length < 2) {
          node = walker.nextNode();
          continue;
        }
        if (!originalText.has(node)) originalText.set(node, node.nodeValue || '');
        textNodes.push(node);
      }
      node = walker.nextNode();
    }

    document.querySelectorAll('*').forEach((el) => {
      ATTRS.forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        if (!originalAttrs.has(el)) originalAttrs.set(el, {});
        const store = originalAttrs.get(el);
        if (!(attr in store)) store[attr] = el.getAttribute(attr) || '';
        attrs.push([el, attr]);
      });
    });

    return { textNodes, attrs };
  }

  async function translateUniqueTexts(sources, lang) {
    const unique = Array.from(new Set(sources.filter((value) => normalizeText(value))));
    const translatedMap = new Map();
    const tasks = unique.map((source) => async () => {
      const translated = lang === 'en' ? source : await fetchTranslation(source, lang);
      translatedMap.set(source, translated);
    });

    const concurrency = 10;
    for (let i = 0; i < tasks.length; i += concurrency) {
      const chunk = tasks.slice(i, i + concurrency).map((fn) => fn());
      await Promise.all(chunk);
    }

    return translatedMap;
  }

  async function translatePage(lang) {
    if (window.location.pathname.toLowerCase().includes('welcome.html')) return;
    document.documentElement.lang = REGION_LANG[lang] || 'en';
    document.documentElement.setAttribute('data-i18n-loading', lang === 'en' ? '0' : '1');
    try {
      const { textNodes, attrs } = gatherNodes();
      const textSources = textNodes.map((node) => originalText.get(node) || '');
      const attrSources = attrs.map(([el, attr]) => (originalAttrs.get(el) || {})[attr] || '');
      const translatedMap = await translateUniqueTexts([...textSources, ...attrSources], lang);

      textNodes.forEach((node) => {
        const source = originalText.get(node) || '';
        node.nodeValue = translatedMap.get(source) || source;
      });

      attrs.forEach(([el, attr]) => {
        const source = (originalAttrs.get(el) || {})[attr] || '';
        el.setAttribute(attr, translatedMap.get(source) || source);
      });
    } finally {
      document.documentElement.setAttribute('data-i18n-loading', '0');
    }
  }

  function bindLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        const lang = normalizeLang(button.getAttribute('data-lang'));
        localStorage.setItem(STORAGE_KEY, lang);
      });
    });
  }

  function applyLoadingStyle() {
    if (document.getElementById('btr-i18n-loading-style')) return;
    const style = document.createElement('style');
    style.id = 'btr-i18n-loading-style';
    style.textContent = 'html[data-i18n-loading="1"] body{cursor:progress}';
    document.head.appendChild(style);
  }

  async function init() {
    bindLanguageButtons();
    applyLoadingStyle();
    const lang = getActiveLang();
    localStorage.setItem(STORAGE_KEY, lang);
    await translatePage(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
