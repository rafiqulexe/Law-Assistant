import { BadgeCheck, MapPin, Search, Star, UserX } from 'lucide-react';
import { useState } from 'react';
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
  Textarea,
} from '@/components/ui';
export default function Lawyers() {
  const { t, tr, num, toast } = useApp();
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('all');
  const [dist, setDist] = useState('all');
  const [contact, setContact] = useState(null);
  const [sending, setSending] = useState(false);
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
        title={t('Talk to a verified lawyer', 'যাচাইকৃত আইনজীবীর সঙ্গে কথা বলুন')}
        body={t(
          'When you need advice for your specific case, choose a lawyer near you.',
          'আপনার নির্দিষ্ট বিষয়ে পরামর্শের প্রয়োজন হলে কাছের একজন আইনজীবী বেছে নিন।',
        )}
      />
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
                  <h2 className="flex items-center gap-1.5 text-[17px] font-semibold">
                    {tr(l.name)}{' '}
                    <BadgeCheck
                      className="size-4 shrink-0 text-accent-text"
                      aria-label={t('Verified', 'যাচাইকৃত')}
                    />
                  </h2>
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
                <p className="flex items-center gap-1 text-[14px]">
                  <Star className="size-4 fill-[var(--med)] text-med" aria-hidden />
                  <span className="font-semibold">{num(l.rating.toFixed(1))}</span>
                  <span className="text-muted">({num(l.reviews)})</span>
                </p>
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
        title={contact ? t(`Contact ${contact.name.en}`, `${contact.name.bn}-এর সঙ্গে যোগাযোগ`) : ''}
        footer={
          <>
            <Button variant="neutral" onClick={() => setContact(null)}>
              {t('Cancel', 'বাতিল')}
            </Button>
            <Button
              loading={sending}
              onClick={() => {
                setSending(true);
                setTimeout(
                  () => (
                    setSending(false),
                    setContact(null),
                    toast(
                      t(
                        'Request sent. Expect a reply within 24 hours.',
                        'অনুরোধ পাঠানো হয়েছে। ২৪ ঘণ্টার মধ্যে উত্তর পাবেন।',
                      ),
                    )
                  ),
                  900,
                );
              }}
            >
              {t('Send request', 'অনুরোধ পাঠান')}
            </Button>
          </>
        }
      >
        <div className="mt-4 flex flex-col gap-4 text-fg">
          <Field label={t('Phone', 'ফোন')} htmlFor="c-phone">
            <Input id="c-phone" type="tel" placeholder="01XXXXXXXXX" />
          </Field>
          <Field
            label={t('Briefly, what do you need help with?', 'সংক্ষেপে, কী বিষয়ে সাহায্য প্রয়োজন?')}
            htmlFor="c-msg"
          >
            <Textarea id="c-msg" className="min-h-24" />
          </Field>
        </div>
      </Dialog>
    </Page>
  );
}
