import { MapPin, Search, UserX } from 'lucide-react';
import { useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { DISTRICTS, LAWYERS, SPECIALTIES } from '@/lib/data';
import { Avatar, Page } from '@/components/Layout';
import {
  Button,
  Card,
  Dialog,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  } from '@/components/ui';
export default function Lawyers() {
  const { t, tr, num, toast, tError } = useApp();
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('all');
  const [dist, setDist] = useState('all');
  const [contact, setContact] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const notify = async () => {
    setSending(true);
    try {
      await legal.contact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: 'Lawyer directory',
        message: `Tell me when the lawyer directory is live (${contact.specialty}, ${contact.district}).`,
      });
      setContact(null);
      toast(t('Thanks. We’ll email you when it’s ready.', 'ধন্যবাদ। চালু হলে ইমেইলে জানাব।'));
    } catch (err) {
      toast(tError(err.message), 'error');
    } finally {
      setSending(false);
    }
  };
  const list = LAWYERS.filter(
    (l) =>
      (spec === 'all' || l.specialty === spec) &&
      (dist === 'all' || l.district === dist) &&
      (l.name.en + l.name.bn).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Page>
      <PageHeader
        eyebrow={t('Find a Lawyer', 'আইনজীবী খুঁজুন')}
        title={t('Find a lawyer near you', 'কাছের আইনজীবী খুঁজুন')}
        body={t(
          'When you need advice for your specific case, choose a lawyer near you.',
          'আপনার নির্দিষ্ট বিষয়ে পরামর্শের প্রয়োজন হলে কাছের একজন আইনজীবী বেছে নিন।',
        )}
      />
      <p className="mt-4 inline-flex rounded-full border border-line bg-surface-2 px-3 py-1 text-[13px] text-muted">
        {t('Preview: these listings are samples, not real lawyers.', 'প্রিভিউ: এই তালিকা উদাহরণমাত্র, সত্যিকারের আইনজীবী নয়।')}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_200px]">
        <Input
          icon={<Search className="size-[18px]" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('Search by name', 'নাম দিয়ে খুঁজুন')}
          aria-label={t('Search lawyers', 'আইনজীবী খুঁজুন')}
        />
        <Select
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          aria-label={t('Specialty', 'বিশেষত্ব')}
        >
          <option value="all">{t('All specialties', 'সব বিশেষত্ব')}</option>
          {Object.entries(SPECIALTIES).map(([k, v]) => (
            <option key={k} value={k}>
              {tr(v)}
            </option>
          ))}
        </Select>
        <Select value={dist} onChange={(e) => setDist(e.target.value)} aria-label={t('District', 'জেলা')}>
          <option value="all">{t('All districts', 'সব জেলা')}</option>
          {Object.entries(DISTRICTS).map(([k, v]) => (
            <option key={k} value={k}>
              {tr(v)}
            </option>
          ))}
        </Select>
      </div>
      <p className="mt-6 text-[13px] text-muted">
        {t(`${list.length} lawyers`, `${num(list.length)} জন আইনজীবী`)}
      </p>
      {list.length === 0 ? (
        <Card className="mt-3">
          <EmptyState
            icon={<UserX className="size-6" strokeWidth={1.5} />}
            title={t('No lawyers found', 'কোনো আইনজীবী পাওয়া যায়নি')}
            body={t('Try another district or specialty.', 'অন্য জেলা বা বিশেষত্ব বেছে নিন।')}
            action={
              <Button variant="secondary" onClick={() => (setQ(''), setSpec('all'), setDist('all'))}>
                {t('Clear filters', 'ফিল্টার মুছুন')}
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((l) => (
            <Card key={l.id} className="anim-fade-up flex flex-col p-5">
              <div className="flex items-start gap-4">
                <Avatar name={l.name.en} size="size-14 text-[17px]" />
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold">{tr(l.name)}</h2>
                  <p className="text-[14px] text-muted">{tr(SPECIALTIES[l.specialty])}</p>
                  <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                    <MapPin className="size-3.5" aria-hidden /> {tr(DISTRICTS[l.district])} ·{' '}
                    {t(`${l.years} yrs`, `${num(l.years)} বছর`)}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div>
                  <p className="text-[17px] font-semibold tabular-nums">৳{num(l.fee)}</p>
                  <p className="text-[12px] text-muted">{t('per consultation', 'প্রতি পরামর্শ')}</p>
                </div>
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => setContact(l)}>
                {t('Contact', 'যোগাযোগ')}
              </Button>
            </Card>
          ))}
        </div>
      )}
      <p className="mt-8 text-[12px] text-muted">
        {t(
          'Sample listings for illustration. Bidhanshala does not endorse any lawyer.',
          'উদাহরণ হিসেবে দেখানো তালিকা। বিধানশালা কোনো আইনজীবীকে সুপারিশ করে না।',
        )}
      </p>

      <Dialog
        open={!!contact}
        onClose={() => setContact(null)}
        title={t('The directory is not live yet', 'তালিকাটি এখনো চালু হয়নি')}
        footer={
          <>
            <Button variant="neutral" onClick={() => setContact(null)}>
              {t('Cancel', 'বাতিল')}
            </Button>
            <Button loading={sending} disabled={!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)} onClick={notify}>
              {t('Notify me', 'আমাকে জানান')}
            </Button>
          </>
        }
      >
        <p className="mt-2 text-[15px] text-muted">
          {t(
            'These lawyers are samples, so we can’t pass on a request. Leave your email and we’ll tell you when real lawyers join.',
            'এই আইনজীবীরা উদাহরণমাত্র, তাই অনুরোধ পাঠানো যাবে না। ইমেইল দিন, সত্যিকারের আইনজীবী যুক্ত হলে আমরা জানাব।',
          )}
        </p>
        <div className="mt-4 flex flex-col gap-4 text-fg">
          <Field label={t('Name', 'নাম')} htmlFor="c-name">
            <Input id="c-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t('Email', 'ইমেইল')} htmlFor="c-email">
            <Input id="c-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
        </div>
      </Dialog>
    </Page>
  );
}
