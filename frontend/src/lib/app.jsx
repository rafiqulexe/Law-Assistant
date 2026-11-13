import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { translateError } from '@/lib/errors';

// Language, theme, navigation, toasts and confirm dialogs, shared by every page.
const AppContext = createContext(null);
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const LANG_KEY = 'bidhanshala-language';
const THEME_KEY = 'bidhanshala-theme';

// Storage can be blocked (private windows); the defaults still work.
function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not saved; the choice still applies until the page is reloaded.
  }
}

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [lang, setLang] = useState(() => (readSetting(LANG_KEY, 'en') === 'bn' ? 'bn' : 'en'));
  const [theme, setTheme] = useState(() => readSetting(THEME_KEY, systemTheme()));
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const toastId = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveSetting(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'en' ? 'Bidhanshala | Bangladesh law, in one place' : 'বিধানশালা | বাংলাদেশের আইন, এক জায়গায়';
    saveSetting(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const dismissToast = useCallback((id) => setToasts((list) => list.filter((item) => item.id !== id)), []);
  const toast = useCallback(
    (msg, kind = 'success') => {
      const id = ++toastId.current;
      setToasts((list) => [...list.slice(-2), { id, msg, kind }]);
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );
  const confirm = useCallback(
    (options) => new Promise((resolve) => setConfirmState({ ...options, resolve })),
    [],
  );
  const closeConfirm = useCallback(
    (value) => {
      confirmState?.resolve(value);
      setConfirmState(null);
    },
    [confirmState],
  );

  const value = useMemo(() => {
    const num = (n) => {
      const text = typeof n === 'number' ? n.toLocaleString('en-US') : String(n);
      return lang === 'bn' ? text.replace(/\d/g, (d) => BN_DIGITS[+d]) : text;
    };
    // SQLite stores UTC as "YYYY-MM-DD HH:MM:SS"; plain dates are "YYYY-MM-DD".
    const toDate = (value) => {
      if (value instanceof Date) return value;
      const text = String(value || '');
      return new Date(/^\d{4}-\d{2}-\d{2} /.test(text) ? text.replace(' ', 'T') + 'Z' : text);
    };
    const user = auth.user
      ? { id: auth.user.id, name: auth.user.username, username: auth.user.username, admin: auth.user.is_admin }
      : null;
    return {
      lang,
      setLang,
      theme,
      setTheme,
      path: location.pathname,
      go: (to) => {
        if (location.pathname === to) window.scrollTo({ top: 0, behavior: 'smooth' });
        else navigate(to);
      },
      user,
      authLoading: auth.isLoadingAuth,
      signIn: auth.login,
      register: auth.register,
      signOut: auth.logout,
      t: (en, bn) => (lang === 'en' ? en : bn),
      tr: (pair) => pair[lang],
      tError: (message) => translateError(message, lang),
      num,
      date: (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) =>
        toDate(value).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', options),
      toasts,
      toast,
      dismissToast,
      confirmState,
      confirm,
      closeConfirm,
      pendingQuestion,
      setPendingQuestion,
    };
  }, [
    lang,
    theme,
    location.pathname,
    navigate,
    auth,
    toasts,
    toast,
    dismissToast,
    confirmState,
    confirm,
    closeConfirm,
    pendingQuestion,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
