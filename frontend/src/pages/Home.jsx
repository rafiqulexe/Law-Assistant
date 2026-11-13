import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpen,
  FileSignature,
  FileText,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { EXAMPLE_QUESTIONS, FAQS } from '@/lib/data';
import { changedSections } from '@/lib/laws';
import { Page } from '@/components/Layout';
import { Badge, Button, Card, Chip, cx } from '@/components/ui';
export function AskHero({ big = true }) {
  const { t, tr, go, setPendingQuestion } = useApp();
  const [q, setQ] = useState('');
  const submit = (text) => {
    if (!text.trim()) return;
    setPendingQuestion(text.trim());
    go('/ask');
  };
  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className={cx(
          'flex items-center gap-2 rounded-[22px] border border-line bg-surface p-2 pl-5 shadow-soft transition-[border-color,box-shadow] focus-within:border-[var(--focus)] focus-within:ring-4 focus-within:ring-accent/15',
          big && 'sm:min-h-[68px]',
        )}
      >
        <Search className="size-5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
        <label htmlFor="hero-q" className="sr-only">
          {t('Ask a legal question', 'আইনি প্রশ্ন করুন')}
        </label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('Ask a legal question in Bangla or English…', 'বাংলা বা ইংরেজিতে আইনি প্রশ্ন করুন…')}
          className="h-11 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-muted/80"
        />
        <Button
          type="submit"
          pill
          size="md"
          disabled={!q.trim()}
          iconOnly={!big}
          aria-label={t('Ask', 'জিজ্ঞাসা')}
          className={big ? 'hidden sm:inline-flex' : ''}
        >
          {big ? t('Ask', 'জিজ্ঞাসা করুন') : <ArrowUp className="size-5" />}
        </Button>
        {big && (
          <Button
            type="submit"
            pill
            iconOnly
            disabled={!q.trim()}
            aria-label={t('Ask', 'জিজ্ঞাসা')}
            className="sm:hidden"
          >
            <ArrowUp className="size-5" />
          </Button>
        )}
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EXAMPLE_QUESTIONS.map((e) => (
          <Chip key={e.en} onClick={() => submit(tr(e))}>
            {tr(e)}
          </Chip>
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const { t, go, date, num } = useApp();
  const [laws, setLaws] = useState(null);
  useEffect(() => {
    legal
      .lawUpdates(4)
      .then(setLaws)
      .catch(() => setLaws({ updates: [], tracked: 0 }));
  }, []);
  const [openFaq, setOpenFaq] = useState(0);
  const tools = [
    {
      p: '/ask',
      Icon: MessageCircle,
      h: t('Ask AI', 'এআই-কে জিজ্ঞাসা'),
      b: t(
        'Plain-language answers with the exact sections they come from.',
        'সহজ ভাষায় উত্তর, সঙ্গে সুনির্দিষ্ট ধারা।',
      ),
      cta: t('Ask a question', 'প্রশ্ন করুন'),
    },
    {
      p: '/contract',
      Icon: FileSignature,
      h: t('Contract Analyzer', 'চুক্তি বিশ্লেষক'),
      b: t(
        'Upload a contract. Get a risk score and the clauses to fix.',
        'চুক্তি আপলোড করুন। ঝুঁকি স্কোর ও সংশোধনযোগ্য ধারা পান।',
      ),
      cta: t('Check a contract', 'চুক্তি যাচাই করুন'),
    },
    {
      p: '/documents',
      Icon: FileText,
      h: t('Document Generator', 'দলিল তৈরি'),
      b: t(
        'Draft an NDA, rental or service agreement in minutes.',
        'কয়েক মিনিটে এনডিএ, ভাড়া বা সেবা চুক্তি তৈরি করুন।',
      ),
      cta: t('Create a document', 'দলিল তৈরি করুন'),
    },
  ];
  const steps = [
    {
      h: t('Ask in your words', 'নিজের ভাষায় জিজ্ঞাসা করুন'),
      b: t(
        'Type a question or upload a document, in Bangla or English.',
        'বাংলা বা ইংরেজিতে প্রশ্ন লিখুন বা নথি আপলোড করুন।',
      ),
    },
    {
      h: t('We search the law', 'আমরা আইন খুঁজি'),
      b: t(
        'Bidhanshala finds the relevant acts and sections from official sources.',
        'বিধানশালা সরকারি উৎস থেকে প্রাসঙ্গিক আইন ও ধারা খুঁজে বের করে।',
      ),
    },
    {
      h: t('Get a clear answer', 'স্পষ্ট উত্তর পান'),
      b: t(
        'Read a short answer, open each source, and decide your next step.',
        'সংক্ষিপ্ত উত্তর পড়ুন, প্রতিটি উৎস দেখুন, পরবর্তী পদক্ষেপ ঠিক করুন।',
      ),
    },
  ];
  return (
    <>
      {/* Hero */}
      <section className="anim-fade-up mx-auto flex max-w-[760px] flex-col items-center px-4 pt-20 pb-16 text-center sm:pt-28">
        <Badge tone="accent" icon={<BadgeCheck className="size-3.5" />}>
          {t('Grounded in official Bangladesh law', 'বাংলাদেশের সরকারি আইনের ভিত্তিতে')}
        </Badge>
        <h1 className="mt-6 text-[40px] leading-[1.08] font-semibold tracking-[-0.025em] sm:text-[56px]">
          {t('Bangladesh law,', 'বাংলাদেশের আইন,')}
          <br />
          <span className="text-muted">{t('in one place.', 'এক জায়গায়।')}</span>
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] text-muted sm:text-[19px]">
          {t(
            'Ask any legal question and get a clear answer, with the exact act and section it comes from.',
            'যেকোনো আইনি প্রশ্ন করুন, সুনির্দিষ্ট আইন ও ধারাসহ স্পষ্ট উত্তর পান।',
          )}
        </p>
        <div className="mt-10 w-full">
          <AskHero />
        </div>
      </section>
      <Page className="pt-0 sm:pt-0">
        {/* Tools */}
        <section aria-labelledby="tools-h" className="mt-8">
          <h2 id="tools-h" className="sr-only">
            {t('Tools', 'টুলস')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tools.map((x) => (
              <button key={x.p} onClick={() => go(x.p)} className="group text-left">
                <Card className="flex h-full flex-col p-6 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-pop">
                  <span className="flex size-11 items-center justify-center rounded-[14px] bg-accent-tint text-accent-text">
                    <x.Icon className="size-[22px]" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{x.h}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] text-muted">{x.b}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent-text">
                    {x.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-h" className="mt-28">
          <h2 id="how-h" className="text-center text-[28px] font-semibold tracking-tight">
            {t('How it works', 'কীভাবে কাজ করে')}
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <li key={s.h} className="flex flex-col items-center text-center md:px-6">
                <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-[15px] font-semibold tabular-nums">
                  {t(String(i + 1), '১২৩'[i])}
                </span>
                <h3 className="mt-4 text-[17px] font-semibold">{s.h}</h3>
                <p className="mt-1.5 max-w-[280px] text-[15px] text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Trust */}
        <section aria-labelledby="trust-h" className="mt-28">
          <Card className="grid gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="flex flex-col justify-center">
              <span className="flex size-11 items-center justify-center rounded-[14px] bg-fg text-bg">
                <ShieldCheck className="size-[22px]" strokeWidth={1.75} />
              </span>
              <h2 id="trust-h" className="mt-5 text-[28px] font-semibold tracking-tight">
                {t('Grounded in official Bangladesh law', 'বাংলাদেশের সরকারি আইনের ভিত্তিতে')}
              </h2>
              <p className="mt-3 text-[17px] text-muted">
                {t(
                  'We check the Laws of Bangladesh website for changes. When an act changes, our answers change with it — and every answer shows the sections it used.',
                  'আমরা বাংলাদেশের আইনের সরকারি ওয়েবসাইটে পরিবর্তন যাচাই করি। কোনো আইন বদলালে আমাদের উত্তরও বদলায় — এবং প্রতিটি উত্তরে ব্যবহৃত ধারাগুলো দেখানো হয়।',
                )}
              </p>
              <div className="mt-6 flex gap-8">
                <div>
                  <div className="text-[28px] font-semibold tabular-nums">{laws ? num(laws.tracked) : '–'}</div>
                  <div className="text-[13px] text-muted">{t('Acts tracked', 'আইন পর্যবেক্ষণে')}</div>
                </div>
                <div>
                  <div className="text-[28px] font-semibold tabular-nums">{t('Monthly', 'মাসিক')}</div>
                  <div className="text-[13px] text-muted">
                    {t('Sync with bdlaws', 'bdlaws-এর সঙ্গে সিঙ্ক')}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">
                  {t('Latest law updates', 'সর্বশেষ আইন হালনাগাদ')}
                </h3>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => go('/updates')}
                  iconRight={<ArrowRight className="size-4" />}
                >
                  {t('See all', 'সব দেখুন')}
                </Button>
              </div>
              {laws && laws.updates.length === 0 && (
                <p className="rounded-2xl border border-line bg-surface-2 p-4 text-[15px] text-muted">
                  {t('No changes found yet.', 'এখনো কোনো পরিবর্তন পাওয়া যায়নি।')}
                </p>
              )}
              <ul className="divide-y divide-line rounded-2xl border border-line bg-surface-2 empty:hidden">
                {(laws?.updates || []).map((u) => (
                  <li key={`${u.act_id}-${u.detected_at}`} className="flex items-start gap-3 p-4">
                    <BookOpen
                      className="mt-0.5 size-[18px] shrink-0 text-muted"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium">{u.title}</p>
                      <p className="text-[13px] text-muted">
                        {changedSections(u, t, num)} · {date(u.detected_at)}
                      </p>
                    </div>
                    <Badge tone={u.change_type === 'new' ? 'new' : 'amended'}>
                      {u.change_type === 'new' ? t('New', 'নতুন') : t('Amended', 'সংশোধিত')}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-h" className="mx-auto mt-28 max-w-[720px]">
          <h2 id="faq-h" className="text-center text-[28px] font-semibold tracking-tight">
            {t('Questions, answered', 'সাধারণ প্রশ্ন')}
          </h2>
          <FaqList openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </section>

        {/* CTA */}
        <section className="mt-28">
          <div className="flex flex-col items-center rounded-[28px] bg-fg px-6 py-16 text-center text-bg">
            <h2 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">
              {t('Have a legal question?', 'আইনি প্রশ্ন আছে?')}
            </h2>
            <p className="mt-2 max-w-md text-[17px] opacity-70">
              {t(
                'Ask it now. It’s free, private and takes a few seconds.',
                'এখনই জিজ্ঞাসা করুন। বিনামূল্যে, গোপনীয়, কয়েক সেকেন্ডেই।',
              )}
            </p>
            <Button
              size="lg"
              pill
              className="mt-8"
              icon={<Plus className="size-5" />}
              onClick={() => go('/ask')}
            >
              {t('Start a new chat', 'নতুন চ্যাট শুরু করুন')}
            </Button>
          </div>
        </section>
      </Page>
    </>
  );
}
export function FaqList({ openFaq, setOpenFaq }) {
  const { tr } = useApp();
  return (
    <div className="mt-8 divide-y divide-line rounded-[20px] border border-line bg-surface">
      {FAQS.map((f, i) => {
        const open = openFaq === i;
        return (
          <div key={f.q.en}>
            <button
              aria-expanded={open}
              onClick={() => setOpenFaq(open ? null : i)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-left text-[17px] font-medium"
            >
              {tr(f.q)}
              <Plus
                className={cx(
                  'size-5 shrink-0 text-muted transition-transform duration-200',
                  open && 'rotate-45',
                )}
              />
            </button>
            {open && <p className="anim-fade -mt-1 px-5 pb-5 text-[15px] text-muted">{tr(f.a)}</p>}
          </div>
        );
      })}
    </div>
  );
}
