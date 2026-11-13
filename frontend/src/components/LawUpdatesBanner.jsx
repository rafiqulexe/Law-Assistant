import React from 'react';
import { Link } from 'react-router-dom';
import { BellRing, ArrowRight } from 'lucide-react';
import { useLawUpdates, formatDate, describeChange } from '@/lib/lawUpdates';
import { useI18n } from '@/lib/i18n';

// Bold strip at the bottom of every page with the most recent law change.
export default function LawUpdatesBanner() {
  const { data } = useLawUpdates(1);
  const { t, language, formatNumber } = useI18n();
  const latest = data?.updates?.[0];
  if (!latest) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-500 text-slate-950 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 text-sm">
        <BellRing className="h-4 w-4 flex-shrink-0" />
        <p className="flex-1 min-w-0 truncate">
          <span className="font-extrabold uppercase tracking-wide mr-2">{t('updates.recent')}</span>
          <span className="font-bold">{latest.title}</span>
          <span className="hidden sm:inline"> - {t('updates.on', { change: describeChange(latest, t, formatNumber), date: formatDate(latest.detected_at, language) })}</span>
        </p>
        <Link
          to="/LawUpdates"
          className="flex items-center gap-1 font-bold whitespace-nowrap hover:underline"
        >
          {t('updates.all')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
