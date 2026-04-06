(function () {
  const STORAGE_KEY = 'btrPreferredLanguage';
  const VALID_LANGS = new Set(['en', 'es', 'fr']);
  const REGION_LANG = { en: 'en', es: 'es-MX', fr: 'fr-CA' };
  const API_LANG = { en: 'en', es: 'es', fr: 'fr' };
  const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTRS = new WeakMap();
  const inFlight = new Map();

  function normalizeLang(lang) {
    const value = String(lang || '').toLowerCase().trim();
    return VALID_LANGS.has(value) ? value : 'en';
  }

  function getCache(lang) {
    const key = `btrI18nCache:${lang}`;
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return {
      key,
      data: parsed && typeof parsed === 'object' ? parsed : {}
    };
  }

  function saveCache(cache) {
    localStorage.setItem(cache.key, JSON.stringify(cache.data));
  }

  function stripForLookup(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  async function fetchTranslation(original, lang) {
    if (lang === 'en') return original;
    const normalized = stripForLookup(original);
    if (!normalized) return original;

    const cache = getCache(lang);
    if (cache.data[normalized]) return cache.data[normalized];

    const flightKey = `${lang}::${normalized}`;
    if (inFlight.has(flightKey)) return inFlight.get(flightKey);

    const request = (async () => {
      const src = API_LANG.en;
      const dest = API_LANG[lang];
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalized)}&langpair=${src}|${dest}`;
      const response = await fetch(url);
      if (!response.ok) return original;
      const payload = await response.json();
      const translated = payload?.responseData?.translatedText;
      if (!translated || typeof translated !== 'string') return original;

      cache.data[normalized] = translated;
      saveCache(cache);
      return translated;
    })();

    inFlight.set(flightKey, request);
    const result = await request;
    inFlight.delete(flightKey);
    return result;
  }

  function getOriginalText(node) {
    if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue || '');
    return ORIGINAL_TEXT.get(node) || '';
  }

  function getOriginalAttr(el, attr) {
    if (!ORIGINAL_ATTRS.has(el)) ORIGINAL_ATTRS.set(el, {});
    const store = ORIGINAL_ATTRS.get(el);
    if (!(attr in store)) store[attr] = el.getAttribute(attr) || '';
    return store[attr];
  }

  function isSkippable(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    const tag = parent.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'IFRAME';
  }

  async function translateTextNode(node, lang) {
    if (isSkippable(node)) return;
    const original = getOriginalText(node);
    if (!stripForLookup(original)) return;
    node.nodeValue = lang === 'en' ? original : await fetchTranslation(original, lang);
  }

  async function translateAttributes(el, lang) {
    await Promise.all(ATTRS.map(async (attr) => {
      if (!el.hasAttribute(attr)) return;
      const original = getOriginalAttr(el, attr);
      if (!stripForLookup(original)) return;
      el.setAttribute(attr, lang === 'en' ? original : await fetchTranslation(original, lang));
    }));
  }

  async function translatePage(lang) {
    document.documentElement.lang = REGION_LANG[lang] || 'en';

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node = walker.nextNode();
    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    for (const textNode of textNodes) {
      await translateTextNode(textNode, lang);
    }

    const elements = Array.from(document.querySelectorAll('*'));
    for (const el of elements) {
      await translateAttributes(el, lang);
    }
  }

  function watchDom() {
    const observer = new MutationObserver(async () => {
      const lang = normalizeLang(localStorage.getItem(STORAGE_KEY));
      await translatePage(lang);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: false
    });
  }

  function wireLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = normalizeLang(btn.getAttribute('data-lang'));
        localStorage.setItem(STORAGE_KEY, lang);
      });
    });
  }

  async function init() {
    wireLanguageButtons();
    const lang = normalizeLang(localStorage.getItem(STORAGE_KEY));
    await translatePage(lang);
    watchDom();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
