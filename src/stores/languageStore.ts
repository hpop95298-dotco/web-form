import { useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

const LANG_KEY = 'ieee_journey_lang';

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'ar'; // Default language to Arabic as requested
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      // ignore
    }
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return { lang, toggleLanguage, isAr: lang === 'ar' };
}
