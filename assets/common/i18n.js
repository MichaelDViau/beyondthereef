(function () {
  const STORAGE_KEY = 'btrPreferredLanguage';
  const VALID_LANGS = new Set(['en', 'es', 'fr']);

  const COPY = {
    en: {
      choose: 'Choose your language',
      englishTag: 'Continue in English',
      frenchTag: 'Continuer en français',
      spanishTag: 'Continuar en español'
    },
    es: {
      choose: 'Elige tu idioma',
      englishTag: 'Continuar en inglés',
      frenchTag: 'Continuar en francés',
      spanishTag: 'Continuar en español'
    },
    fr: {
      choose: 'Choisissez votre langue',
      englishTag: 'Continuer en anglais',
      frenchTag: 'Continuer en français',
      spanishTag: 'Continuer en espagnol'
    }
  };

  function normalizeLang(value) {
    const lang = String(value || '').toLowerCase().trim();
    return VALID_LANGS.has(lang) ? lang : 'en';
  }

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return normalizeLang(params.get('lang'));
  }

  function applyWelcomeTranslations(lang) {
    const dict = COPY[lang] || COPY.en;

    const choose = document.querySelector('.choose');
    const englishTag = document.querySelector('[data-lang="en"] .lang-tag');
    const frenchTag = document.querySelector('[data-lang="fr"] .lang-tag');
    const spanishTag = document.querySelector('[data-lang="es"] .lang-tag');

    if (choose) choose.textContent = dict.choose;
    if (englishTag) englishTag.textContent = dict.englishTag;
    if (frenchTag) frenchTag.textContent = dict.frenchTag;
    if (spanishTag) spanishTag.textContent = dict.spanishTag;
  }

  function wireButtons() {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        const lang = normalizeLang(button.getAttribute('data-lang'));
        localStorage.setItem(STORAGE_KEY, lang);
      });
    });
  }

  function init() {
    if (!window.location.pathname.toLowerCase().includes('welcome.html')) return;

    const stored = normalizeLang(localStorage.getItem(STORAGE_KEY));
    const urlLang = getLangFromUrl();
    const activeLang = urlLang !== 'en' ? urlLang : stored;

    applyWelcomeTranslations(activeLang);
    wireButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
