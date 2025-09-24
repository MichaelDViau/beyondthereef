(function () {
  const root = document.documentElement;
  const DARK_CLASS = 'dark-mode';

  const getStoredTheme = () => {
    try {
      return window.localStorage.getItem('preferred-theme');
    } catch (error) {
      return null;
    }
  };

  const prefersDarkMode = () => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      return false;
    }
  };

  const storedTheme = getStoredTheme();
  const shouldUseDark = storedTheme === 'dark' || (!storedTheme && prefersDarkMode());

  if (shouldUseDark) {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
})();
