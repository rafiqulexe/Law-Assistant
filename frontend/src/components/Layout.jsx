import {
  ChevronDown,
  FileSignature,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Settings2,
  ShieldAlert,
  Sparkles,
  Sun,
  User,
  X,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { Button, Logo, LogoMark, Segmented, Sheet, cx } from './ui';
export const TOOLS = [
  {
    p: '/contract',
    en: 'Contract Analyzer',
    bn: 'চুক্তি বিশ্লেষক',
    den: 'Score a contract and spot risky clauses',
    dbn: 'চুক্তির ঝুঁকিপূর্ণ ধারা খুঁজুন',
    Icon: FileSignature,
  },
  {
    p: '/risk',
    en: 'Risk Checker',
    bn: 'ঝুঁকি যাচাই',
    den: 'Check one clause or situation',
    dbn: 'একটি ধারা বা পরিস্থিতি যাচাই',
    Icon: ShieldAlert,
  },
  {
    p: '/documents',
    en: 'Document Generator',
    bn: 'দলিল তৈরি',
    den: 'Draft an NDA, rental or service agreement',
    dbn: 'এনডিএ, ভাড়া বা সেবা চুক্তি তৈরি',
    Icon: FileText,
  },
];
const LINKS = [
  { p: '/', en: 'Home', bn: 'হোম' },
  { p: '/ask', en: 'Ask AI', bn: 'এআই-কে জিজ্ঞাসা' },
  { p: '/updates', en: 'Law Updates', bn: 'আইন হালনাগাদ' },
  { p: '/lawyers', en: 'Find a Lawyer', bn: 'আইনজীবী খুঁজুন' },
  { p: '/pricing', en: 'Pricing', bn: 'মূল্য' },
];
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  return { open, setOpen, ref };
}
function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'flex h-9 items-center gap-1 rounded-lg px-3 text-[14px] transition-colors',
        active ? 'font-medium text-fg' : 'text-muted hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}
export function LangSwitch({ size = 'sm' }) {
  const { lang, setLang, t } = useApp();
  return (
    <Segmented
      size={size}
      label={t('Language', 'ভাষা')}
      value={lang}
      onChange={setLang}
      options={[
        { value: 'en', label: 'EN', aria: 'English' },
        { value: 'bn', label: <span className="font-bn">বাং</span>, aria: 'বাংলা' },
      ]}
    />
  );
}
function ThemeToggle() {
  const { theme, setTheme, t } = useApp();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={
        theme === 'dark' ? t('Switch to light mode', 'লাইট মোড') : t('Switch to dark mode', 'ডার্ক মোড')
      }
      className="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
    >
      {theme === 'dark' ? (
        <Sun className="size-5" strokeWidth={1.75} />
      ) : (
        <Moon className="size-5" strokeWidth={1.75} />
      )}
    </button>
  );
}
export function Avatar({ name, size = 'size-9' }) {
  const initials = name
    .replace(/^Adv\.\s|^অ্যাড\.\s/, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <span
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/25 to-cyan/20 text-[13px] font-semibold text-accent-text',
        size,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
function AccountMenu() {
  const { user, signOut, go, t, toast } = useApp();
  const pop = usePopover();
  if (!user)
    return (
      <Button size="sm" pill variant="primary" className="min-h-9 px-4" onClick={() => go('/signin')}>
        {t('Sign in', 'সাইন ইন')}
      </Button>
    );
  const item = 'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-[14px] hover:bg-fg/[0.05]';
  return (
    <div ref={pop.ref} className="relative">
      <button
        onClick={() => pop.setOpen(!pop.open)}
        aria-expanded={pop.open}
        aria-haspopup="menu"
        aria-label={t('Account menu', 'অ্যাকাউন্ট মেনু')}
        className="flex size-10 items-center justify-center rounded-full"
      >
        <Avatar name={user.name} />
      </button>
      {pop.open && (
        <div
          role="menu"
          className="glass anim-pop absolute top-12 right-0 w-60 rounded-2xl border border-line p-1.5 shadow-pop"
        >
          <div className="px-3 py-2.5">
            <p className="text-[14px] font-medium">{user.name}</p>
            <p className="text-[13px] text-muted">@{user.username}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          <button role="menuitem" className={item} onClick={() => (pop.setOpen(false), go('/dashboard'))}>
            <LayoutGrid className="size-[18px] text-muted" strokeWidth={1.75} />{' '}
            {t('Dashboard', 'ড্যাশবোর্ড')}
          </button>
          {user.admin && (
            <button role="menuitem" className={item} onClick={() => (pop.setOpen(false), go('/admin'))}>
              <Settings2 className="size-[18px] text-muted" strokeWidth={1.75} /> {t('Admin', 'অ্যাডমিন')}
            </button>
          )}
          <button
            role="menuitem"
            className={item}
            onClick={async () => {
              pop.setOpen(false);
              await signOut();
              toast(t('Signed out', 'সাইন আউট হয়েছে'), 'info');
              go('/');
            }}
          >
            <LogOut className="size-[18px] text-muted" strokeWidth={1.75} /> {t('Sign out', 'সাইন আউট')}
          </button>
        </div>
      )}
    </div>
  );
}
function ToolsMenu() {
  const { go, t, path } = useApp();
  const pop = usePopover();
  const active = TOOLS.some((x) => x.p === path);
  return (
    <div ref={pop.ref} className="relative">
      <NavLink active={active} onClick={() => pop.setOpen(!pop.open)}>
        <span aria-haspopup="menu" aria-expanded={pop.open}>
          {t('Tools', 'টুলস')}
        </span>
        <ChevronDown className={cx('size-3.5 transition-transform', pop.open && 'rotate-180')} />
      </NavLink>
      {pop.open && (
        <div
          role="menu"
          className="glass anim-pop absolute top-11 left-1/2 w-[320px] -translate-x-1/2 rounded-2xl border border-line p-1.5 shadow-pop"
        >
          {TOOLS.map((x) => (
            <button
              key={x.p}
              role="menuitem"
              onClick={() => (pop.setOpen(false), go(x.p))}
              className="flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-fg/[0.05]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-tint text-accent-text">
                <x.Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[14px] font-medium">{t(x.en, x.bn)}</span>
                <span className="block text-[13px] text-muted">{t(x.den, x.dbn)}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// The newest change from the official law site, on every page until dismissed.
export function UpdateBar() {
  const { t, go, date, num } = useApp();
  const [update, setUpdate] = useState(null);
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem('bidhanshala-update-bar') !== '0';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    legal
      .lawUpdates(1)
      .then((data) => setUpdate(data.updates[0] || null))
      .catch(() => setUpdate(null));
  }, [show]);

  if (!show || !update) return null;
  const sections = update.sections.slice(0, 2).map((s) => num(s)).join(', ');
  const what =
    update.change_type === 'new'
      ? t('new law', 'নতুন আইন')
      : sections
        ? t(`s.${sections} amended`, `ধারা ${sections} সংশোধিত`)
        : t('amended', 'সংশোধিত');
  const dismiss = () => {
    try {
      sessionStorage.setItem('bidhanshala-update-bar', '0');
    } catch {
      // The bar still closes for this page view.
    }
    setShow(false);
  };
  return (
    <div className="relative border-b border-line bg-surface text-[13px]">
      <div className="mx-auto flex min-h-10 max-w-[1200px] items-center justify-center gap-2 px-12 py-1.5 text-center">
        <span className="size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
        <span className="min-w-0 truncate text-muted">
          <span className="font-medium text-fg">
            {update.title} {what}
          </span>{' '}
          · {date(update.detected_at)}
        </span>
        <button
          onClick={() => go('/updates')}
          className="inline-flex shrink-0 items-center gap-1 rounded font-medium text-accent-text hover:underline"
        >
          {t('See all', 'সব দেখুন')} <ArrowRight className="size-3.5" />
        </button>
      </div>
      <button
        aria-label={t('Dismiss update', 'বন্ধ করুন')}
        onClick={dismiss}
        className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-fg/5"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
export function NavBar() {
  const { path, go, t, user, theme, setTheme, signOut } = useApp();
  const [menu, setMenu] = useState(false);
  const nav = (p) => (setMenu(false), go(p));
  return (
    <header className="glass sticky top-0 z-50 border-b border-line">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <Logo onClick={() => go('/')} />
        <nav aria-label={t('Main', 'প্রধান')} className="ml-6 hidden items-center xl:flex">
          <NavLink active={path === '/'} onClick={() => go('/')}>
            {t('Home', 'হোম')}
          </NavLink>
          <NavLink active={path === '/ask'} onClick={() => go('/ask')}>
            {t('Ask AI', 'এআই-কে জিজ্ঞাসা')}
          </NavLink>
          <ToolsMenu />
          {LINKS.slice(2).map((l) => (
            <NavLink key={l.p} active={path === l.p} onClick={() => go(l.p)}>
              {t(l.en, l.bn)}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LangSwitch />
          <div className="hidden items-center gap-1.5 xl:flex">
            <ThemeToggle />
            <AccountMenu />
          </div>
          <button
            onClick={() => setMenu(true)}
            aria-label={t('Open menu', 'মেনু খুলুন')}
            className="flex size-11 items-center justify-center rounded-full hover:bg-fg/[0.06] xl:hidden"
          >
            <Menu className="size-[22px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <Sheet open={menu} onClose={() => setMenu(false)} side="bottom" title={t('Menu', 'মেনু')}>
        <div className="flex flex-col gap-5 pb-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {LINKS.map((l, i) => (
              <button
                key={l.p}
                onClick={() => nav(l.p)}
                className={cx(
                  'flex min-h-12 w-full items-center justify-between px-4 text-[17px]',
                  i && 'border-t border-line',
                  path === l.p && 'font-semibold text-accent-text',
                )}
              >
                {t(l.en, l.bn)}
              </button>
            ))}
          </div>
          <div>
            <p className="mb-2 px-1 text-[13px] font-medium text-muted">{t('Tools', 'টুলস')}</p>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {TOOLS.map((x, i) => (
                <button
                  key={x.p}
                  onClick={() => nav(x.p)}
                  className={cx(
                    'flex min-h-12 w-full items-center gap-3 px-4 text-[17px]',
                    i && 'border-t border-line',
                  )}
                >
                  <x.Icon className="size-5 text-accent-text" strokeWidth={1.75} /> {t(x.en, x.bn)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-2">
            <span className="text-[15px]">{t('Appearance', 'থিম')}</span>
            <Segmented
              size="sm"
              label={t('Theme', 'থিম')}
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'light', label: <Sun className="size-4" />, aria: t('Light', 'লাইট') },
                { value: 'dark', label: <Moon className="size-4" />, aria: t('Dark', 'ডার্ক') },
              ]}
            />
          </div>
          {user ? (
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <button
                onClick={() => nav('/dashboard')}
                className="flex min-h-12 w-full items-center gap-3 px-4 text-[17px]"
              >
                <User className="size-5 text-muted" strokeWidth={1.75} /> {t('Dashboard', 'ড্যাশবোর্ড')}
              </button>
              {user.admin && (
                <button
                  onClick={() => nav('/admin')}
                  className="flex min-h-12 w-full items-center gap-3 border-t border-line px-4 text-[17px]"
                >
                  <Settings2 className="size-5 text-muted" strokeWidth={1.75} /> {t('Admin', 'অ্যাডমিন')}
                </button>
              )}
              <button
                onClick={async () => {
                  await signOut();
                  nav('/');
                }}
                className="flex min-h-12 w-full items-center gap-3 border-t border-line px-4 text-[17px] text-high"
              >
                <LogOut className="size-5" strokeWidth={1.75} /> {t('Sign out', 'সাইন আউট')}
              </button>
            </div>
          ) : (
            <Button size="lg" onClick={() => nav('/signin')}>
              {t('Sign in', 'সাইন ইন')}
            </Button>
          )}
        </div>
      </Sheet>
    </header>
  );
}
export function Footer() {
  const { t, go } = useApp();
  const cols = [
    {
      h: t('Product', 'পণ্য'),
      l: [
        ['/ask', t('Ask AI', 'এআই-কে জিজ্ঞাসা')],
        ['/contract', t('Contract Analyzer', 'চুক্তি বিশ্লেষক')],
        ['/risk', t('Risk Checker', 'ঝুঁকি যাচাই')],
        ['/documents', t('Document Generator', 'দলিল তৈরি')],
      ],
    },
    {
      h: t('Resources', 'রিসোর্স'),
      l: [
        ['/updates', t('Law Updates', 'আইন হালনাগাদ')],
        ['/blog', t('Blog', 'ব্লগ')],
        ['/lawyers', t('Find a Lawyer', 'আইনজীবী খুঁজুন')],
      ],
    },
    {
      h: t('Company', 'প্রতিষ্ঠান'),
      l: [
        ['/about', t('About', 'আমাদের সম্পর্কে')],
        ['/pricing', t('Pricing', 'মূল্য')],
        ['/contact', t('Contact', 'যোগাযোগ')],
      ],
    },
  ];
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 text-fg [--logo-ink:var(--bg)]">
            <LogoMark className="size-6" />
            <span className="text-[15px] font-semibold">{t('Bidhanshala', 'বিধানশালা')}</span>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            {t('Bangladesh law, in one place.', 'বাংলাদেশের আইন, এক জায়গায়।')}
          </p>
          <button
            onClick={() => go('/contact')}
            className="mt-4 inline-flex items-center gap-2 rounded text-[13px] text-fg hover:text-accent-text"
          >
            <Mail className="size-4" strokeWidth={1.75} /> {t('Send us a message', 'আমাদের বার্তা পাঠান')}
          </button>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-[13px] font-semibold">{c.h}</p>
            <ul className="mt-3 flex flex-col">
              {c.l.map(([p, label]) => (
                <li key={p}>
                  <button
                    onClick={() => go(p)}
                    className="flex min-h-9 items-center rounded text-[13px] text-muted hover:text-fg"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-6 text-[12px] text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>© 2026 {t('Bidhanshala', 'বিধানশালা')}</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" aria-hidden />
            {t('Legal information, not legal advice.', 'আইনি তথ্য, আইনি পরামর্শ নয়।')}
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Page({ children, className }) {
  return (
    <main className={cx('anim-fade-up mx-auto w-full max-w-[1200px] px-4 pt-10 sm:px-6 sm:pt-14', className)}>
      {children}
    </main>
  );
}
