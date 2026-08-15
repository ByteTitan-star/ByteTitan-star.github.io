(() => {
  const STORAGE_KEY = 'bytetitan-language';

  const getLanguage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'zh' || stored === 'en') return stored;
    } catch (_) {}
    return 'en';
  };

  const applyLanguage = (lang) => {
    const isZh = lang === 'zh';
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = isZh ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
      const value = isZh ? element.getAttribute('data-zh') : element.getAttribute('data-en');
      if (value !== null) element.textContent = value;
    });

    document.querySelectorAll('[data-en-placeholder][data-zh-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', isZh ? element.getAttribute('data-zh-placeholder') : element.getAttribute('data-en-placeholder'));
    });

    document.querySelectorAll('[data-en-aria][data-zh-aria]').forEach((element) => {
      element.setAttribute('aria-label', isZh ? element.getAttribute('data-zh-aria') : element.getAttribute('data-en-aria'));
    });

    document.querySelectorAll('[data-language-label]').forEach((element) => {
      element.textContent = isZh ? 'EN' : '中文';
    });

    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.setAttribute('aria-label', isZh ? 'Switch to English' : '切换到中文');
      button.setAttribute('title', isZh ? 'Switch to English' : '切换到中文');
    });

    window.dispatchEvent(new CustomEvent('site-language-change', { detail: { lang } }));
  };

  const setLanguage = (lang) => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    applyLanguage(lang);
  };

  const boot = () => {
    applyLanguage(getLanguage());
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const current = document.documentElement.dataset.lang === 'zh' ? 'zh' : 'en';
        setLanguage(current === 'zh' ? 'en' : 'zh');
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
