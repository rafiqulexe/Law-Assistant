import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Globe2,
  HeartHandshake,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { POSTS } from '@/lib/data';
import { Page } from '@/components/Layout';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea } from '@/components/ui';
import { FaqList } from './Home';
export function About() {
  const { t, go } = useApp();
  const values = [
    {
      Icon: BookOpen,
      h: t('Source first', 'উৎস আগে'),
      b: t(
        'Every answer links to the official text of the law.',
        'প্রতিটি উত্তর আইনের সরকারি পাঠের সঙ্গে যুক্ত।',
      ),
    },
    {
      Icon: Globe2,
      h: t('Bangla first', 'বাংলা আগে'),
      b: t(
        'Built for the way people in Bangladesh actually ask.',
        'বাংলাদেশের মানুষ যেভাবে প্রশ্ন করেন, সেভাবেই তৈরি।',
      ),
    },
    {
      Icon: ShieldCheck,
      h: t('Honest limits', 'সৎ সীমারেখা'),
      b: t(
        'Information, not advice — and a lawyer when you need one.',
        'তথ্য, পরামর্শ নয় — প্রয়োজনে আইনজীবী।',
      ),
    },
  ];
  return (
    <Page>
      <div className="mx-auto max-w-[720px]">
        <PageHeader
          eyebrow={t('About', 'আমাদের সম্পর্কে')}
          title={t('Law should be easy to understand.', 'আইন বোঝা সহজ হওয়া উচিত।')}
        />
        <div className="mt-6 flex flex-col gap-4 text-[17px] leading-[1.7] text-muted">
          <p>
            {t(
              'Most people in Bangladesh never read the laws that shape their lives — not because they don’t care, but because the text is long, technical and hard to find.',
              'বাংলাদেশের বেশিরভাগ মানুষ তাদের জীবন নিয়ন্ত্রণকারী আইন কখনো পড়েন না — অনাগ্রহের কারণে নয়, বরং পাঠ দীর্ঘ, জটিল ও খুঁজে পাওয়া কঠিন বলে।',
            )}
          </p>
          <p>
            {t(
              'Bidhanshala reads the official acts for you, answers in plain Bangla or English, and always shows where the answer comes from.',
              'বিধানশালা আপনার হয়ে সরকারি আইন পড়ে, সহজ বাংলা বা ইংরেজিতে উত্তর দেয়, এবং সবসময় উত্তরের উৎস দেখায়।',
            )}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-14 grid max-w-[1000px] gap-4 md:grid-cols-3">
        {values.map((v) => (
          <Card key={v.h} className="p-6">
            <v.Icon className="size-6 text-accent-text" strokeWidth={1.75} />
            <h2 className="mt-4 text-[17px] font-semibold">{v.h}</h2>
            <p className="mt-1 text-[15px] text-muted">{v.b}</p>
          </Card>
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <Button pill size="lg" iconRight={<ArrowRight className="size-5" />} onClick={() => go('/ask')}>
          {t('Ask your first question', 'প্রথম প্রশ্ন করুন')}
        </Button>
      </div>
    </Page>
  );
}
const TOPICS = { general: 'General', citation: 'Wrong citation', billing: 'Plans and billing' };

export function Contact() {
  const { t, toast, tError } = useApp();
  const [f, setF] = useState({ name: '', email: '', topic: 'general', msg: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = t('Enter your name', 'আপনার নাম লিখুন');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = t('Enter a valid email', 'সঠিক ইমেইল দিন');
    if (f.msg.trim().length < 10) errs.msg = t('Tell us a little more', 'আরেকটু বিস্তারিত লিখুন');
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    try {
      await legal.contact({ name: f.name.trim(), email: f.email.trim(), subject: TOPICS[f.topic], message: f.msg.trim() });
      setF({ name: '', email: '', topic: 'general', msg: '' });
      toast(t('Message sent. We’ll get back to you soon.', 'বার্তা পাঠানো হয়েছে। শিগগিরই উত্তর দেব।'));
    } catch (err) {
      toast(tError(err.message), 'error');
    } finally {
      setSending(false);
    }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Page>
      <PageHeader
        eyebrow={t('Contact', 'যোগাযোগ')}
        title={t('We’d love to hear from you', 'আপনার কথা শুনতে চাই')}
        body={t(
          'Feedback, a wrong citation, or a question about plans.',
          'মতামত, ভুল উদ্ধৃতি, অথবা প্ল্যান নিয়ে প্রশ্ন।',
        )}
      />
      <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-6 sm:p-8">
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('Name', 'নাম')} htmlFor="ct-name" error={errors.name}>
                <Input
                  id="ct-name"
                  value={f.name}
                  onChange={set('name')}
                  invalid={!!errors.name}
                  autoComplete="name"
                />
              </Field>
              <Field label={t('Email', 'ইমেইল')} htmlFor="ct-email" error={errors.email}>
                <Input
                  id="ct-email"
                  type="email"
                  value={f.email}
                  onChange={set('email')}
                  invalid={!!errors.email}
                  autoComplete="email"
                />
              </Field>
            </div>
            <Field label={t('Topic', 'বিষয়')} htmlFor="ct-topic">
              <Select id="ct-topic" value={f.topic} onChange={set('topic')}>
                <option value="general">{t('General', 'সাধারণ')}</option>
                <option value="citation">{t('Report a wrong citation', 'ভুল উদ্ধৃতি জানান')}</option>
                <option value="billing">{t('Plans & billing', 'প্ল্যান ও বিলিং')}</option>
              </Select>
            </Field>
            <Field label={t('Message', 'বার্তা')} htmlFor="ct-msg" error={errors.msg}>
              <Textarea
                id="ct-msg"
                value={f.msg}
                onChange={set('msg')}
                invalid={!!errors.msg}
                className="min-h-36"
              />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="lg" loading={sending}>
                {t('Send message', 'বার্তা পাঠান')}
              </Button>
            </div>
          </form>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <Mail className="size-5 text-accent-text" strokeWidth={1.75} />
            <p className="mt-3 text-[15px] font-medium">{t('How we reply', 'কীভাবে উত্তর দিই')}</p>
            <p className="mt-1 text-[15px] text-muted">
              {t(
                'Your message goes straight to the Bidhanshala team. We reply to the email you give.',
                'আপনার বার্তা সরাসরি বিধানশালা টিমের কাছে যায়। আপনার দেওয়া ইমেইলে আমরা উত্তর দিই।',
              )}
            </p>
          </Card>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[720px]">
        <h2 className="text-center text-[22px] font-semibold tracking-tight">
          {t('Before you write', 'লেখার আগে দেখে নিন')}
        </h2>
        <FaqList openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </div>
    </Page>
  );
}
export function Blog() {
  const { t, tr, date, num, go } = useApp();
  const [first, ...rest] = POSTS;
  return (
    <Page>
      <PageHeader eyebrow={t('Blog', 'ব্লগ')} title={t('Law, explained simply', 'সহজ ভাষায় আইন')} />
      <button onClick={() => go(`/blog/${first.slug}`)} className="group mt-10 block w-full text-left">
        <Card className="grid overflow-hidden md:grid-cols-[1.1fr_1fr]">
          <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-accent/15 via-transparent to-cyan/10 md:aspect-auto">
            <BookOpen className="size-16 text-accent-text/70" strokeWidth={1} />
          </div>
          <div className="p-6 sm:p-10">
            <Badge tone="accent">{tr(first.tag)}</Badge>
            <h2 className="mt-4 text-[28px] font-semibold tracking-tight group-hover:text-accent-text">
              {tr(first.title)}
            </h2>
            <p className="mt-2 text-[17px] text-muted">{tr(first.excerpt)}</p>
            <p className="mt-6 text-[13px] text-muted">
              {date(first.date)} · {t(`${first.read} min read`, `${num(first.read)} মিনিট`)}
            </p>
          </div>
        </Card>
      </button>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {rest.map((p) => (
          <button key={p.slug} onClick={() => go(`/blog/${p.slug}`)} className="group text-left">
            <Card className="flex h-full flex-col p-6">
              <Badge>{tr(p.tag)}</Badge>
              <h2 className="mt-4 text-[19px] font-semibold tracking-tight group-hover:text-accent-text">
                {tr(p.title)}
              </h2>
              <p className="mt-1.5 flex-1 text-[15px] text-muted">{tr(p.excerpt)}</p>
              <p className="mt-6 text-[13px] text-muted">
                {date(p.date)} · {t(`${p.read} min read`, `${num(p.read)} মিনিট`)}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </Page>
  );
}
export function Article({ slug }) {
  const { t, tr, date, num, go } = useApp();
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  return (
    <Page>
      <article className="mx-auto max-w-[720px]">
        <Button
          variant="tertiary"
          size="sm"
          className="-ml-3"
          icon={<ArrowLeft className="size-4" />}
          onClick={() => go('/blog')}
        >
          {t('Blog', 'ব্লগ')}
        </Button>
        <Badge tone="accent" className="mt-6">
          {tr(p.tag)}
        </Badge>
        <h1 className="mt-4 text-[34px] leading-tight font-semibold tracking-tight sm:text-[40px]">
          {tr(p.title)}
        </h1>
        <p className="mt-3 text-[19px] text-muted">{tr(p.excerpt)}</p>
        <p className="mt-6 border-b border-line pb-6 text-[13px] text-muted">
          {t('Bidhanshala Editorial', 'বিধানশালা সম্পাদকীয়')} ·{' '}
          {date(p.date, { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
          {t(`${p.read} min read`, `${num(p.read)} মিনিট`)}
        </p>
        <div className="mt-8 flex flex-col gap-5 text-[17px] leading-[1.75]">
          {p.body.map((b) => (
            <p key={b.en}>{tr(b)}</p>
          ))}
        </div>
        <Card className="mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[17px] font-semibold">
              {t('Have a question about this?', 'এ বিষয়ে প্রশ্ন আছে?')}
            </p>
            <p className="text-[15px] text-muted">
              {t(
                'Ask Bidhanshala and get the exact sections.',
                'বিধানশালাকে জিজ্ঞাসা করুন, সুনির্দিষ্ট ধারা পান।',
              )}
            </p>
          </div>
          <Button pill onClick={() => go('/ask')}>
            {t('Ask AI', 'এআই-কে জিজ্ঞাসা')}
          </Button>
        </Card>
      </article>
    </Page>
  );
}
export function NotFound() {
  const { t, go } = useApp();
  return (
    <Page>
      <div className="flex min-h-[50dvh] items-center justify-center">
        <EmptyState
          icon={<Compass className="size-6" strokeWidth={1.5} />}
          title={t('This page isn’t in our books', 'এই পাতাটি আমাদের বইয়ে নেই')}
          body={t(
            'The link may be old, or the page may have moved. Let’s get you back.',
            'লিংকটি পুরোনো হতে পারে, অথবা পাতাটি সরানো হয়েছে। চলুন ফিরে যাই।',
          )}
          action={
            <div className="flex gap-2">
              <Button onClick={() => go('/')}>{t('Go home', 'হোমে যান')}</Button>
              <Button
                variant="secondary"
                icon={<HeartHandshake className="size-4" />}
                onClick={() => go('/contact')}
              >
                {t('Contact us', 'যোগাযোগ')}
              </Button>
            </div>
          }
        />
      </div>
    </Page>
  );
}
