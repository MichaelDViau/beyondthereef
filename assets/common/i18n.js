(function () {
  const STORAGE_KEY = 'btrPreferredLanguage';
  const VALID_LANGS = new Set(['en', 'es', 'fr']);
  const REGION_LANG = {
    en: 'en',
    es: 'es-MX',
    fr: 'fr-CA'
  };

  function normalizeLang(value) {
    const lang = String(value || '').toLowerCase().trim();
    return VALID_LANGS.has(lang) ? lang : 'en';
  }

  function setGoogleTranslateCookie(lang) {
    const googValue = `/en/${lang}`;
    const host = window.location.hostname;
    document.cookie = `googtrans=${googValue}; path=/; max-age=31536000`;
    if (host) {
      document.cookie = `googtrans=${googValue}; path=/; domain=.${host}; max-age=31536000`;
    }
  }

  function hideGoogleUi() {
    const styleId = 'btr-i18n-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '.goog-te-banner-frame.skiptranslate,.goog-logo-link,.goog-te-gadget span,.goog-te-balloon-frame{display:none!important}body{top:0!important}.skiptranslate.goog-te-gadget{font-size:0!important}';
    document.head.appendChild(style);
  }

  function applyLanguage(lang) {
    const htmlLang = REGION_LANG[lang] || 'en';
    document.documentElement.setAttribute('lang', htmlLang);

    if (lang === 'en') {
      setGoogleTranslateCookie('en');
      return;
    }

    setGoogleTranslateCookie(lang);
    hideGoogleUi();

    if (!document.getElementById('google_translate_element')) {
      const holder = document.createElement('div');
      holder.id = 'google_translate_element';
      holder.style.position = 'fixed';
      holder.style.left = '-9999px';
      holder.style.bottom = '0';
      holder.style.opacity = '0';
      holder.style.pointerEvents = 'none';
      document.body.appendChild(holder);
    }

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr',
          autoDisplay: false,
          multilanguagePage: true
        },
        'google_translate_element'
      );
    };

    if (!window.google || !window.google.translate) {
      if (!document.querySelector('script[data-btr-gt]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.setAttribute('data-btr-gt', '1');
        document.head.appendChild(script);
      }
    } else {
      window.googleTranslateElementInit();
    }

    let attempts = 0;
    const applyTimer = window.setInterval(function () {
      attempts += 1;
      const combo = document.querySelector('select.goog-te-combo');
      if (combo) {
        if (combo.value !== lang) {
          combo.value = lang;
          combo.dispatchEvent(new Event('change'));
        }
        window.clearInterval(applyTimer);
      } else if (attempts > 25) {
        window.clearInterval(applyTimer);
      }
    }, 250);
  }

  function wireLanguageSelectors() {
    const buttons = document.querySelectorAll('[data-lang]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        const lang = normalizeLang(button.getAttribute('data-lang'));
        localStorage.setItem(STORAGE_KEY, lang);
      });
    });
  }

  const preferred = normalizeLang(localStorage.getItem(STORAGE_KEY) || 'en');
  wireLanguageSelectors();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyLanguage(preferred);
    });
  } else {
    applyLanguage(preferred);
  }
})();
