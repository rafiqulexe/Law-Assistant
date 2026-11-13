import { ExternalLink, RefreshCw, Search, SearchX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { changedSections } from '@/lib/laws';
import { Page } from '@/components/Layout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  Segmented,
  Select,
  Skeleton,
  Spinner,
} from '@/components/ui';

export default function Updates() {
  const { t, date, num, toast, tError } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [range, setRange] = useState('all');

  const load = useCallback(
    async (manual) => {
      setLoading(true);
      setError('');
      try {
        setData(await legal.lawUpdates(200));
        if (manual) toast(t('Up to date', 'হালনাগাদ করা হয়েছে'));
      } catch (err) {
        setError(tError(err.message));
      } finally {
        setLoading(false);
      }
    },
    [t, toast, tError],
  );

  useEffect(() => {
    load(false);
    // Load once on open; the refresh button reloads on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updates = data?.updates || [];
  const since = range === 'all' ? 0 : Date.now() - Number(range) * 864e5;
  const query = q.trim().toLowerCase();
  const list = updates.filter(
    (u) =>
      (type === 'all' || u.change_type === type) &&
      (!since || new Date(u.detected_at) >= since) &&
      (u.title + ' ' + (u.sections || []).join(' ')).toLowerCase().includes(query),
  );
  const lastSync = data?.last_sync?.finished_at;
  const clear = () => {
    setQ('');
    setType('all');
    setRange('all');
  };

  return (
    <Page>
      <PageHeader
        eyebrow={t('Law Updates', 'আইন হালনাগাদ')}
        title={t('What changed in Bangladesh law', 'বাংলাদেশের আইনে কী পরিবর্তন হলো')}
        body={t(
          'New and amended acts from the official Laws of Bangladesh website.',
          'বাংলাদেশের আইনের সরকারি ওয়েবসাইট থেকে নতুন ও সংশোধিত আইন।',
        )}
      />
      <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-line bg-surface py-1.5 pr-1.5 pl-4 text-[13px]">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
          <span className="relative size-2 rounded-full bg-accent" />
        </span>
        <span className="text-muted">
          {data && t(`${num(data.tracked)} acts tracked`, `${num(data.tracked)}টি আইন পর্যবেক্ষণে`)}
          {lastSync &&
            t(` · last checked ${date(lastSync)}`, ` · সর্বশেষ যাচাই ${date(lastSync)}`)}
          {!data && t('Loading…', 'লোড হচ্ছে…')}
        </span>
        <Button
          size="sm"
          variant="secondary"
          pill
          className="min-h-8"
          disabled={loading}
          icon={loading ? <Spinner /> : <RefreshCw className="size-3.5" />}
          onClick={() => load(true)}
        >
          {t('Refresh', 'রিফ্রেশ')}
        </Button>
      </div>

      <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            icon={<Search className="size-[18px]" />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('Search acts or sections', 'আইন বা ধারা খুঁজুন')}
            aria-label={t('Search updates', 'হালনাগাদ খুঁজুন')}
          />
        </div>
        <Segmented
          label={t('Change type', 'পরিবর্তনের ধরন')}
          value={type}
          onChange={setType}
          options={[
            { value: 'all', label: t('All', 'সব') },
            { value: 'new', label: t('New', 'নতুন') },
            { value: 'amended', label: t('Amended', 'সংশোধিত') },
          ]}
        />
        <div className="md:w-48">
          <Select value={range} onChange={(e) => setRange(e.target.value)} aria-label={t('Date range', 'সময়সীমা')}>
            <option value="all">{t('Any time', 'যেকোনো সময়')}</option>
            <option value="30">{t('Last 30 days', 'গত ৩০ দিন')}</option>
            <option value="90">{t('Last 3 months', 'গত ৩ মাস')}</option>
            <option value="365">{t('Last year', 'গত এক বছর')}</option>
          </Select>
        </div>
      </div>

      <div className="mt-8 max-w-[860px]">
        {error ? (
          <ErrorState title={t('Updates could not load', 'হালনাগাদ লোড হয়নি')} body={error} onRetry={() => load(false)} />
        ) : !data ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="flex flex-col gap-3 p-6">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))}
          </div>
        ) : list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<SearchX className="size-6" strokeWidth={1.5} />}
              title={
                updates.length
                  ? t('No updates match', 'কোনো হালনাগাদ মেলেনি')
                  : t('No changes found yet', 'এখনো কোনো পরিবর্তন পাওয়া যায়নি')
              }
              body={
                updates.length
                  ? t('Try a different act name or clear the filters.', 'অন্য আইনের নাম দিয়ে চেষ্টা করুন বা ফিল্টার মুছুন।')
                  : t(
                      'Changes appear here after the next check of the official site.',
                      'সরকারি ওয়েবসাইট পরবর্তী যাচাইয়ের পর পরিবর্তন এখানে দেখা যাবে।',
                    )
              }
              action={
                updates.length > 0 && (
                  <Button variant="secondary" onClick={clear}>
                    {t('Clear filters', 'ফিল্টার মুছুন')}
                  </Button>
                )
              }
            />
          </Card>
        ) : (
          <ol className="relative ml-3 border-l border-line">
            {list.map((u) => (
              <li key={`${u.act_id}-${u.detected_at}`} className="anim-fade-up relative pb-8 pl-8 last:pb-0">
                <span
                  className={
                    'absolute top-6 -left-[6.5px] size-3 rounded-full ring-4 ring-bg ' +
                    (u.change_type === 'new' ? 'bg-accent' : 'bg-med')
                  }
                  aria-hidden
                />
                <Card className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={u.change_type === 'new' ? 'new' : 'amended'}>
                      {u.change_type === 'new' ? t('New', 'নতুন') : t('Amended', 'সংশোধিত')}
                    </Badge>
                    <time dateTime={u.detected_at} className="text-[13px] text-muted">
                      {date(u.detected_at, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="mt-3 text-[19px] font-semibold tracking-tight">{u.title}</h2>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-lg bg-fg/[0.05] px-2.5 py-1 font-mono text-[12px]">
                      {changedSections(u, t, num)}
                    </span>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded text-[14px] font-medium text-accent-text hover:underline"
                    >
                      {t('Official source', 'সরকারি উৎস')} <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Page>
  );
}
