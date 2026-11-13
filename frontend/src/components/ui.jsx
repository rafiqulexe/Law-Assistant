import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Info,
  Loader2,
  OctagonAlert,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useApp } from '@/lib/app';
export const cx = (...a) => a.filter(Boolean).join(' ');
const btnVariant = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover active:brightness-95',
  secondary: 'bg-accent-tint text-accent-text hover:bg-accent/20',
  tertiary: 'text-accent-text hover:bg-fg/[0.05]',
  destructive: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
  neutral: 'bg-surface text-fg border border-line hover:bg-fg/[0.03] shadow-soft',
};
const btnSize = {
  sm: 'min-h-9 px-3.5 text-[13px] gap-1.5',
  md: 'min-h-11 px-5 text-[15px] gap-2',
  lg: 'min-h-[52px] px-7 text-[17px] gap-2',
};
const iconSize = { sm: 'size-9', md: 'size-11', lg: 'size-[52px]' };
export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconRight,
  pill,
  iconOnly,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap select-none',
        'transition-[background-color,color,transform,filter] duration-150 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
        pill ? 'rounded-full' : 'rounded-xl',
        btnVariant[variant],
        iconOnly ? cx(iconSize[size], 'p-0') : btnSize[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
/* ---------- Form fields ---------- */
export function Field({ label, hint, error, children, htmlFor, optional }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between text-[13px] font-medium text-fg"
      >
        {label}
        {optional && <span className="font-normal text-muted">{optional}</span>}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[13px] text-high" role="alert">
          <AlertCircle className="size-3.5" aria-hidden /> {error}
        </p>
      ) : (
        hint && <p className="text-[13px] text-muted">{hint}</p>
      )}
    </div>
  );
}
const fieldBase =
  'w-full rounded-xl border bg-surface text-[15px] text-fg placeholder:text-muted/80 outline-none transition-[border-color,box-shadow] duration-150 focus:ring-4 disabled:opacity-50';
const fieldOk = 'border-line focus:border-[var(--focus)] focus:ring-accent/15';
const fieldBad = 'border-high focus:border-high focus:ring-high/15';
export function Input({ invalid, icon, trailing, className, ...p }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
          {icon}
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={cx(
          fieldBase,
          invalid ? fieldBad : fieldOk,
          'h-11 px-3.5',
          icon && 'pl-10',
          trailing && 'pr-12',
          className,
        )}
        {...p}
      />
      {trailing && <span className="absolute top-1/2 right-1 -translate-y-1/2">{trailing}</span>}
    </div>
  );
}
export function Textarea({ invalid, className, ...p }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cx(
        fieldBase,
        invalid ? fieldBad : fieldOk,
        'min-h-28 resize-y px-3.5 py-3 leading-relaxed',
        className,
      )}
      {...p}
    />
  );
}
export function Select({ className, children, ...p }) {
  return (
    <div className="relative">
      <select className={cx(fieldBase, fieldOk, 'h-11 appearance-none pr-10 pl-3.5', className)} {...p}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}
/* ---------- Segmented control ---------- */
export function Segmented({ options, value, onChange, size = 'md', label, className }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('inline-flex rounded-[11px] bg-fg/[0.06] p-[3px]', className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            aria-label={o.aria}
            onClick={() => onChange(o.value)}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 rounded-[9px] font-medium whitespace-nowrap transition-all duration-200',
              size === 'sm' ? 'h-8 px-2.5 text-[13px]' : 'h-[38px] px-4 text-[14px]',
              on
                ? 'bg-surface text-fg shadow-[0_1px_3px_rgb(0_0_0/0.12)] dark:bg-[#2A323C]'
                : 'text-muted hover:text-fg',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
/* ---------- Tabs ---------- */
export function Tabs({ tabs, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-6 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={t.value === value}
          onClick={() => onChange(t.value)}
          className={cx(
            '-mb-px flex min-h-11 items-center gap-2 border-b-2 text-[15px] font-medium transition-colors',
            t.value === value ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg',
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
/* ---------- Chip ---------- */
export function Chip({ children, selected, className, icon, ...p }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-left text-[13px] transition-colors duration-150',
        selected
          ? 'border-accent bg-accent-tint text-accent-text'
          : 'border-line bg-surface text-fg hover:border-fg/20 hover:bg-fg/[0.02]',
        className,
      )}
      {...p}
    >
      {icon}
      {children}
    </button>
  );
}
const badgeTone = {
  neutral: 'bg-fg/[0.06] text-muted',
  accent: 'bg-accent-tint text-accent-text',
  low: 'bg-low-tint text-low',
  medium: 'bg-med-tint text-med',
  high: 'bg-high-tint text-high',
  new: 'bg-accent-tint text-accent-text',
  amended: 'bg-med-tint text-med',
  admin: 'bg-fg text-bg',
  cyan: 'bg-cyan/15 text-[#0E7490] dark:text-cyan',
};
export function Badge({ tone = 'neutral', children, icon, className }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap',
        badgeTone[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
export const riskMeta = {
  low: { en: 'Low risk', bn: 'কম ঝুঁকি', Icon: ShieldCheck, color: 'var(--low)' },
  medium: { en: 'Medium risk', bn: 'মাঝারি ঝুঁকি', Icon: AlertTriangle, color: 'var(--med)' },
  high: { en: 'High risk', bn: 'উচ্চ ঝুঁকি', Icon: OctagonAlert, color: 'var(--high)' },
};
export const riskFromScore = (s) => (s < 35 ? 'low' : s < 70 ? 'medium' : 'high');
export function RiskBadge({ level, short, size = 'md' }) {
  const { tr, t } = useApp();
  const m = riskMeta[level];
  const shortLabel = { low: t('Low', 'কম'), medium: t('Medium', 'মাঝারি'), high: t('High', 'উচ্চ') }[level];
  return (
    <Badge
      tone={level}
      icon={<m.Icon className={size === 'lg' ? 'size-4' : 'size-3.5'} aria-hidden />}
      className={size === 'lg' ? 'h-8 px-3 text-[13px]' : ''}
    >
      {short ? shortLabel : tr(m)}
    </Badge>
  );
}
/* ---------- Card ---------- */
export function Card({ children, className, as: As = 'div', ...p }) {
  return (
    <As className={cx('rounded-[20px] border border-line bg-surface shadow-soft', className)} {...p}>
      {children}
    </As>
  );
}
/* ---------- Stat tile ---------- */
export function StatTile({ icon, label, value, delta }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent-tint text-accent-text">
          {icon}
        </span>
        {delta && <span className="text-[13px] text-muted">{delta}</span>}
      </div>
      <div>
        <div className="text-[28px] font-semibold tracking-tight tabular-nums">{value}</div>
        <div className="text-[13px] text-muted">{label}</div>
      </div>
    </Card>
  );
}
/* ---------- List row ---------- */
export function ListRow({ icon, title, subtitle, right, onClick }) {
  const inner = (
    <>
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fg/[0.05] text-fg">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">{title}</span>
        {subtitle && <span className="block truncate text-[13px] text-muted">{subtitle}</span>}
      </span>
      {right}
    </>
  );
  const cls = 'flex min-h-[60px] w-full items-center gap-3.5 px-4 py-2.5 text-left';
  return onClick ? (
    <button onClick={onClick} className={cx(cls, 'rounded-xl transition-colors hover:bg-fg/[0.03]')}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
/* ---------- Dropzone ---------- */
export function Dropzone({ onFiles, accept, title, hint, multiple, compact }) {
  const [over, setOver] = useState(false);
  const ref = useRef(null);
  const { t } = useApp();
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cx(
        'flex flex-col items-center justify-center gap-3 rounded-[20px] border-[1.5px] border-dashed text-center transition-colors duration-150',
        compact ? 'px-6 py-8' : 'px-6 py-14',
        over ? 'border-accent bg-accent-tint' : 'border-line bg-surface-2',
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-surface text-accent-text shadow-soft">
        <Upload className="size-[22px]" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <p className="text-[15px] font-medium">{title}</p>
        <p className="mt-0.5 text-[13px] text-muted">{hint}</p>
      </div>
      <Button variant="neutral" size="sm" onClick={() => ref.current?.click()}>
        {t('Choose file', 'ফাইল বেছে নিন')}
      </Button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
      />
    </div>
  );
}
/* ---------- Progress ---------- */
export function Progress({ value, label }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-fg/[0.07]"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
/* ---------- Toasts (iOS style) ---------- */
export function ToastViewport() {
  const { toasts, dismissToast } = useApp();
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const colors = { success: 'text-accent-text', error: 'text-high', info: 'text-fg' };
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => {
        const I = icons[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className="glass anim-toast pointer-events-auto flex min-h-12 max-w-md items-center gap-3 rounded-full border border-line py-2 pr-2 pl-4 shadow-pop"
          >
            <I className={cx('size-5 shrink-0', colors[t.kind])} aria-hidden />
            <span className="text-[14px] font-medium">{t.msg}</span>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-fg/5"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
/* ---------- Overlays ---------- */
function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}
export function Dialog({ open, onClose, title, children, footer, icon }) {
  useEscape(open, onClose);
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="anim-fade absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className="glass anim-pop relative w-full max-w-[400px] rounded-[20px] border border-line p-6 shadow-pop"
      >
        {icon && <div className="mb-4">{icon}</div>}
        <h2 id={id} className="text-[20px] font-semibold tracking-tight">
          {title}
        </h2>
        {children && <div className="mt-2 text-[15px] text-muted">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
export function ConfirmHost() {
  const { confirmState, closeConfirm, t } = useApp();
  return (
    <Dialog
      open={!!confirmState}
      onClose={() => closeConfirm(false)}
      title={confirmState?.title || ''}
      icon={
        confirmState?.destructive ? (
          <span className="flex size-11 items-center justify-center rounded-full bg-high-tint text-high">
            <AlertTriangle className="size-5" aria-hidden />
          </span>
        ) : undefined
      }
      footer={
        <>
          <Button variant="neutral" onClick={() => closeConfirm(false)}>
            {t('Cancel', 'বাতিল')}
          </Button>
          <Button
            autoFocus
            variant={confirmState?.destructive ? 'destructive' : 'primary'}
            onClick={() => closeConfirm(true)}
          >
            {confirmState?.confirmLabel || t('Confirm', 'নিশ্চিত করুন')}
          </Button>
        </>
      }
    >
      {confirmState?.body}
    </Dialog>
  );
}
export function Sheet({ open, onClose, title, children, side = 'right', footer }) {
  useEscape(open, onClose);
  const id = useId();
  if (!open) return null;
  const pos = {
    right: 'anim-sheet-r inset-y-2 right-2 w-[min(440px,calc(100vw-16px))] rounded-[20px]',
    left: 'anim-sheet-l inset-y-2 left-2 w-[min(320px,calc(100vw-48px))] rounded-[20px]',
    bottom: 'anim-sheet-b inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[24px]',
  }[side];
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="anim-fade absolute inset-0 bg-black/25" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={cx('glass absolute flex flex-col border border-line shadow-pop', pos)}
      >
        {side === 'bottom' && <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-fg/15" aria-hidden />}
        <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-2">
          <h2 id={id} className="text-[17px] font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-fg/5"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}
/* ---------- Source chip ---------- */
export function SourceChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[13px] font-medium text-fg transition-colors hover:border-accent hover:text-accent-text"
    >
      <BookOpen className="size-3.5 text-accent-text" aria-hidden />
      {label}
    </button>
  );
}
/* ---------- Risk dial ---------- */
export function RiskDial({ score, size = 180 }) {
  const { t, num, tr } = useApp();
  const level = riskFromScore(score);
  const m = riskMeta[level];
  const r = 70;
  const C = 2 * Math.PI * r;
  const arc = C * 0.75;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(id);
  }, [score]);
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${t('Risk score', 'ঝুঁকি স্কোর')} ${score}/100, ${tr(m)}`}
    >
      <svg viewBox="0 0 180 180" className="size-full -rotate-[225deg]">
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${C}`}
        />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={m.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(arc * shown) / 100} ${C}`}
          style={{ transition: 'stroke-dasharray 900ms cubic-bezier(0.2,0.8,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span className="text-[44px] leading-none font-semibold tracking-tight tabular-nums">
          {num(score)}
        </span>
        <span className="mt-1 text-[13px] text-muted">{t('out of 100', '১০০-এর মধ্যে')}</span>
      </div>
      <div className="absolute inset-x-0 bottom-1 flex justify-center">
        <RiskBadge level={level} />
      </div>
    </div>
  );
}
/* ---------- Empty state ---------- */
export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="anim-fade-up flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-fg/[0.05] text-muted">
        {icon}
      </span>
      <h3 className="text-[17px] font-semibold">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-[15px] text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
/* ---------- Error state ---------- */
export function ErrorState({ title, body, onRetry }) {
  const { t } = useApp();
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-high/25 bg-high-tint p-4">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-high" aria-hidden />
      <div className="flex-1">
        <p className="text-[15px] font-medium">{title}</p>
        <p className="text-[13px] text-muted">{body}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="neutral" onClick={onRetry}>
          {t('Try again', 'আবার চেষ্টা করুন')}
        </Button>
      )}
    </div>
  );
}
/* ---------- Skeleton ---------- */
export function Skeleton({ className }) {
  return <div aria-hidden className={cx('animate-pulse rounded-lg bg-fg/[0.07]', className)} />;
}
/* ---------- Disclaimer ---------- */
export function Disclaimer({ className }) {
  const { t } = useApp();
  return (
    <p className={cx('flex items-center gap-1.5 text-[12px] text-muted', className)}>
      <Info className="size-3.5 shrink-0" aria-hidden />
      {t('This is legal information, not legal advice.', 'এটি আইনি তথ্য, আইনি পরামর্শ নয়।')}
    </p>
  );
}
/* ---------- Logo ---------- */
export function LogoMark({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <g stroke="var(--logo-ink, #fff)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8v15M11 23h10M9.5 11h13" />
        <path d="M9.5 11 7 17h5l-2.5-6ZM22.5 11 20 17h5l-2.5-6Z" />
      </g>
    </svg>
  );
}
export function Logo({ onClick }) {
  const { t } = useApp();
  return (
    <button
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 rounded-lg"
      aria-label={t('Bidhanshala home', 'বিধানশালা হোম')}
    >
      <span className="text-accent-text [--logo-ink:var(--surface)]">
        <LogoMark />
      </span>
      <span className="text-[17px] font-semibold tracking-tight">{t('Bidhanshala', 'বিধানশালা')}</span>
    </button>
  );
}
/* ---------- Page header ---------- */
export function PageHeader({ eyebrow, title, body, right }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-[720px]">
        {eyebrow && (
          <p className="mb-2 text-[13px] font-semibold tracking-wide text-accent-text uppercase">{eyebrow}</p>
        )}
        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">{title}</h1>
        {body && <p className="mt-2 text-[17px] text-muted">{body}</p>}
      </div>
      {right}
    </div>
  );
}
export function Spinner({ className = 'size-4' }) {
  return <Loader2 className={cx('animate-spin', className)} aria-hidden />;
}
