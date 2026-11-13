import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translateRateLimit, translations } from '@/lib/translations';

const STORAGE_KEY = 'bidhanshala-language';
const LanguageContext = createContext(null);

function savedLanguage() {
  // Storage can be blocked (private windows); English is the safe default.
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

function fill(text, values) {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(savedLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((value) => {
    setLanguageState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Not saved; the choice still applies until the page is reloaded.
    }
  }, []);

  const value = useMemo(() => {
    // Missing Bangla text falls back to English, then to the key itself.
    const t = (key, values) => fill(translations[language][key] ?? translations.en[key] ?? key, values);
    // The API answers in English; show known messages in the chosen language.
    const tError = (message) =>
      translations[language].errors?.[message] ?? translateRateLimit(message, language) ?? message;
    const formatNumber = (number) => number.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
    return { language, setLanguage, t, tError, formatNumber };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useI18n must be used inside LanguageProvider');
  return context;
}

export function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useI18n();
  const next = language === 'bn' ? 'en' : 'bn';
  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      className={`rounded-lg border border-brand-900/40 px-3 py-1.5 text-sm font-medium text-slate-300 hover:border-brand-500/60 hover:text-brand-400 transition-colors ${className}`}
      aria-label={next === 'bn' ? 'বাংলায় দেখুন' : 'Switch to English'}
      title={next === 'bn' ? 'বাংলায় দেখুন' : 'Switch to English'}
    >
      {next === 'bn' ? 'বাংলা' : 'English'}
    </button>
  );
}
