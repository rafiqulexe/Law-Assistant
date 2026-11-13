import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, ExternalLink, FilePlus2, FilePen, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLawUpdates, formatDate, describeChange } from '@/lib/lawUpdates';
import { useI18n } from '@/lib/i18n';

export default function LawUpdates() {
  const { data, isLoading } = useLawUpdates(100);
  const updates = data?.updates || [];
  const { t, language, formatNumber } = useI18n();

  return (
    <div className="pt-20 pb-24">
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 mb-6">
              <BellRing className="h-4 w-4 text-brand-400" />
              <span className="text-brand-400 text-sm font-medium">{t('updates.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">{t('updates.title1')}</span>
              <span className="gradient-text">{t('updates.title2')}</span>
            </h1>
            <p className="text-lg text-slate-400">
              {t('updates.intro')}
            </p>
            {data?.last_sync && (
              <p className="text-sm text-slate-500 mt-3">
                {t('updates.lastChecked', { date: formatDate(data.last_sync.finished_at, language) })}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-brand-500 mx-auto" />}
        {!isLoading && updates.length === 0 && (
          <p className="text-slate-400 text-center">{t('updates.none')}</p>
        )}
        {updates.map((update, index) => {
          const Icon = update.change_type === 'new' ? FilePlus2 : FilePen;
          return (
            <Card
              key={`${update.act_id}-${update.detected_at}`}
              className={`bg-slate-900/80 ${index === 0 ? 'border-brand-500/60' : 'border-brand-900/30'}`}
            >
              <CardContent className="p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`text-white ${index === 0 ? 'font-extrabold' : 'font-semibold'}`}>
                      {update.title}
                    </h3>
                    {index === 0 && <Badge className="bg-brand-500 text-slate-900">{t('updates.latest')}</Badge>}
                  </div>
                  <p className="text-sm text-slate-400">
                    {t('updates.detected', { change: describeChange(update, t, formatNumber), date: formatDate(update.detected_at, language) })}
                  </p>
                  {update.sections?.length > 0 && (
                    <ul className="mt-2 text-sm text-slate-300 list-disc list-inside space-y-0.5">
                      {update.sections.slice(0, 8).map((section) => (
                        <li key={section} className="truncate">{section}</li>
                      ))}
                      {update.sections.length > 8 && (
                        <li className="text-slate-500">{t('updates.more', { count: formatNumber(update.sections.length - 8) })}</li>
                      )}
                    </ul>
                  )}
                  <a
                    href={update.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 mt-2"
                  >
                    {t('updates.official')} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
