import { ArrowRight, FileSignature, FileText, Inbox, MessageCircle, Plus, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { useApp } from '@/lib/app';
import { Page } from '@/components/Layout';
import { Button, Card, EmptyState, ErrorState, ListRow, RiskBadge, Skeleton, StatTile } from '@/components/ui';

const KINDS = {
  chat: { Icon: MessageCircle, path: '/ask', label: ['Chat', 'চ্যাট'] },
  contract: { Icon: FileSignature, path: '/contract', label: ['Contract', 'চুক্তি'] },
  risk: { Icon: ShieldAlert, path: '/risk', label: ['Risk check', 'ঝুঁকি যাচাই'] },
  document: { Icon: FileText, path: '/documents', label: ['Document', 'দলিল'] },
};

export default function Dashboard() {
  const { t, num, user, go, date, tError } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api
      .get('/api/dashboard')
      .then(setData)
      .catch((err) => setError(tError(err.message)));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const h = new Date().getHours();
  const greet =
    h < 12
      ? t('Good morning', 'শুভ সকাল')
      : h < 17
        ? t('Good afternoon', 'শুভ অপরাহ্ণ')
        : t('Good evening', 'শুভ সন্ধ্যা');
  const counts = data?.counts || {};
  const stats = [
    { kind: 'chat', label: t('Questions asked', 'জিজ্ঞাসিত প্রশ্ন') },
    { kind: 'contract', label: t('Contracts analysed', 'বিশ্লেষিত চুক্তি') },
    { kind: 'risk', label: t('Risk checks', 'ঝুঁকি যাচাই') },
    { kind: 'document', label: t('Documents', 'দলিল') },
  ];
  const quick = [
    { p: '/ask', l: t('New chat', 'নতুন চ্যাট'), Icon: Plus },
    { p: '/contract', l: t('Analyze a contract', 'চুক্তি বিশ্লেষণ'), Icon: FileSignature },
    { p: '/risk', l: t('Check a risk', 'ঝুঁকি যাচাই'), Icon: ShieldAlert },
    { p: '/documents', l: t('Create a document', 'দলিল তৈরি'), Icon: FileText },
  ];

  return (
    <Page>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[15px] text-muted">{greet},</p>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">{user?.name}</h1>
        </div>
        <Button pill icon={<Plus className="size-5" />} onClick={() => go('/ask')}>
          {t('Ask a question', 'প্রশ্ন করুন')}
        </Button>
      </div>

      {error && (
        <div className="mt-8">
          <ErrorState title={t('Your dashboard could not load', 'ড্যাশবোর্ড লোড হয়নি')} body={error} onRetry={load} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {!data
          ? [0, 1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col gap-4 p-5">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </Card>
            ))
          : stats.map((s) => {
              const { Icon } = KINDS[s.kind];
              return (
                <StatTile
                  key={s.kind}
                  icon={<Icon className="size-5" strokeWidth={1.75} />}
                  label={s.label}
                  value={num(counts[s.kind] || 0)}
                />
              );
            })}
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="p-2">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h2 className="text-[17px] font-semibold">{t('Recent activity', 'সাম্প্রতিক কার্যক্রম')}</h2>
          </div>
          {!data ? (
            <div className="flex flex-col gap-1 p-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3.5 px-2 py-2.5">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.recent.length === 0 ? (
            <EmptyState
              icon={<Inbox className="size-6" strokeWidth={1.5} />}
              title={t('Nothing here yet', 'এখনো কিছু নেই')}
              body={t(
                'Your questions, contracts and documents will show up here.',
                'আপনার প্রশ্ন, চুক্তি ও দলিল এখানে দেখা যাবে।',
              )}
            />
          ) : (
            <ul className="anim-fade">
              {data.recent.map((a, i) => {
                const kind = KINDS[a.kind] || KINDS.chat;
                return (
                  <li key={i}>
                    <ListRow
                      icon={<kind.Icon className="size-5" strokeWidth={1.75} />}
                      title={a.title}
                      subtitle={`${t(...kind.label)} · ${date(a.created_at)}`}
                      onClick={() => go(kind.path)}
                      right={
                        ['low', 'medium', 'high'].includes(a.risk) ? (
                          <RiskBadge level={a.risk} short />
                        ) : (
                          <ArrowRight className="size-4 text-muted" />
                        )
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="text-[17px] font-semibold">{t('Quick actions', 'দ্রুত কাজ')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quick.map((q) => (
              <button
                key={q.p}
                onClick={() => go(q.p)}
                className="flex min-h-24 flex-col items-start justify-between rounded-2xl border border-line bg-surface-2 p-4 text-left text-[14px] font-medium transition-colors hover:border-accent/50"
              >
                <q.Icon className="size-5 text-accent-text" strokeWidth={1.75} />
                {q.l}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}
