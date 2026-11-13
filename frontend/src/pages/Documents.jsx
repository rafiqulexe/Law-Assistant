import {
  ArrowLeft,
  Briefcase,
  Check,
  Copy,
  Download,
  FileLock2,
  FileText,
  Globe,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { DISTRICTS } from '@/lib/data';
import { downloadTextAsPdf } from '@/lib/pdf';
import { Page } from '@/components/Layout';
import {
  Button,
  Card,
  Disclaimer,
  EmptyState,
  ErrorState,
  Field,
  Input,
  PageHeader,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';

// Each field: key sent to the API, label, sample shown as placeholder, and input kind.
const TYPES = [
  {
    id: 'nda',
    Icon: FileLock2,
    name: { en: 'Non-Disclosure Agreement', bn: 'গোপনীয়তা চুক্তি (এনডিএ)' },
    desc: { en: 'Keep shared information confidential', bn: 'শেয়ার করা তথ্য গোপন রাখুন' },
    fields: [
      { key: 'Disclosing party', label: { en: 'Disclosing party', bn: 'প্রকাশকারী পক্ষ' }, sample: 'Nodi Technologies Ltd.' },
      { key: 'Receiving party', label: { en: 'Receiving party', bn: 'গ্রহীতা পক্ষ' }, sample: 'Arif Rahman' },
      { key: 'Purpose', label: { en: 'Purpose', bn: 'উদ্দেশ্য' }, sample: 'evaluating a possible software partnership', long: true },
      { key: 'Term (years)', label: { en: 'Term (years)', bn: 'মেয়াদ (বছর)' }, sample: '2', numeric: true },
    ],
  },
  {
    id: 'freelance',
    Icon: Briefcase,
    name: { en: 'Freelance / Service Agreement', bn: 'ফ্রিল্যান্স / সেবা চুক্তি' },
    desc: { en: 'Scope, fee and delivery for a project', bn: 'প্রকল্পের কাজ, ফি ও সময়সীমা' },
    fields: [
      { key: 'Client', label: { en: 'Client', bn: 'ক্লায়েন্ট' }, sample: 'Shapla Foods' },
      { key: 'Freelancer', label: { en: 'Freelancer', bn: 'ফ্রিল্যান্সার' }, sample: 'Mitu Das' },
      { key: 'Scope of work', label: { en: 'Scope of work', bn: 'কাজের পরিধি' }, sample: 'brand identity and website design', long: true },
      { key: 'Fee (BDT)', label: { en: 'Fee (BDT)', bn: 'ফি (টাকা)' }, sample: '80,000', numeric: true },
      { key: 'Delivery (weeks)', label: { en: 'Delivery (weeks)', bn: 'সরবরাহ (সপ্তাহ)' }, sample: '6', numeric: true },
    ],
  },
  {
    id: 'rental',
    Icon: HomeIcon,
    name: { en: 'Rental Agreement', bn: 'বাড়ি ভাড়া চুক্তি' },
    desc: { en: 'Fair terms for landlord and tenant', bn: 'বাড়িওয়ালা ও ভাড়াটিয়ার জন্য ন্যায্য শর্ত' },
    fields: [
      { key: 'Landlord', label: { en: 'Landlord', bn: 'বাড়িওয়ালা' }, sample: 'Abdul Karim' },
      { key: 'Tenant', label: { en: 'Tenant', bn: 'ভাড়াটিয়া' }, sample: 'Rina Begum' },
      { key: 'Property address', label: { en: 'Property address', bn: 'সম্পত্তির ঠিকানা' }, sample: 'Flat 4B, House 12, Road 5, Dhanmondi', long: true },
      { key: 'Monthly rent (BDT)', label: { en: 'Monthly rent (BDT)', bn: 'মাসিক ভাড়া (টাকা)' }, sample: '35,000', numeric: true },
      { key: 'Term (months)', label: { en: 'Term (months)', bn: 'মেয়াদ (মাস)' }, sample: '12', numeric: true },
    ],
  },
  {
    id: 'tos',
    Icon: Globe,
    name: { en: 'Terms of Service', bn: 'সেবার শর্তাবলি' },
    desc: { en: 'Rules for your website or app', bn: 'আপনার ওয়েবসাইট বা অ্যাপের নিয়ম' },
    fields: [
      { key: 'Company name', label: { en: 'Company name', bn: 'প্রতিষ্ঠানের নাম' }, sample: 'Nodi Technologies Ltd.' },
      { key: 'Website or app', label: { en: 'Website or app', bn: 'ওয়েবসাইট বা অ্যাপ' }, sample: 'nodi.com.bd' },
      { key: 'Service description', label: { en: 'What the service does', bn: 'সেবাটি কী করে' }, sample: 'online grocery ordering', long: true },
      { key: 'Contact email', label: { en: 'Contact email', bn: 'যোগাযোগের ইমেইল' }, sample: 'support@nodi.com.bd', email: true },
    ],
  },
  {
    id: 'privacy',
    Icon: ShieldCheck,
    name: { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
    desc: { en: 'How you collect and use personal data', bn: 'ব্যক্তিগত তথ্য সংগ্রহ ও ব্যবহারের নীতি' },
    fields: [
      { key: 'Company name', label: { en: 'Company name', bn: 'প্রতিষ্ঠানের নাম' }, sample: 'Shapla Foods' },
      { key: 'Website or app', label: { en: 'Website or app', bn: 'ওয়েবসাইট বা অ্যাপ' }, sample: 'shaplafoods.com' },
      { key: 'Data collected', label: { en: 'Data you collect', bn: 'যে তথ্য সংগ্রহ করেন' }, sample: 'name, phone number, delivery address', long: true },
      { key: 'Contact email', label: { en: 'Contact email', bn: 'যোগাযোগের ইমেইল' }, sample: 'privacy@shaplafoods.com', email: true },
    ],
  },
];

export default function Documents() {
  const { t, tr, lang, toast, tError } = useApp();
  const [type, setType] = useState(null);
  const [vals, setVals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doc, setDoc] = useState('');
  const [copied, setCopied] = useState(false);

  const pick = (d) => {
    setType(d);
    setVals({ date: new Date().toISOString().slice(0, 10), place: 'dhaka' });
    setDoc('');
    setError('');
  };

  if (!type)
    return (
      <Page>
        <PageHeader
          eyebrow={t('Document Generator', 'দলিল তৈরি')}
          title={t('What do you need to draft?', 'কোন দলিল তৈরি করতে চান?')}
          body={t(
            'Pick a document. Fill in a few details. Download a clean draft.',
            'একটি দলিল বেছে নিন। কিছু তথ্য দিন। পরিচ্ছন্ন খসড়া ডাউনলোড করুন।',
          )}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((d) => (
            <button key={d.id} onClick={() => pick(d)} className="group text-left">
              <Card className="flex h-full items-start gap-4 p-6 transition-[transform,box-shadow,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:shadow-pop">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent-tint text-accent-text">
                  <d.Icon className="size-[22px]" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold">{tr(d.name)}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">{tr(d.desc)}</span>
                </span>
              </Card>
            </button>
          ))}
        </div>
      </Page>
    );

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));
  const ready = type.fields.every((f) => (vals[f.key] || '').trim());

  const generate = async () => {
    setLoading(true);
    setError('');
    const fields = {};
    type.fields.forEach((f) => (fields[f.key] = vals[f.key].trim()));
    fields.Date = vals.date;
    fields.Place = DISTRICTS[vals.place]?.en || 'Dhaka';
    try {
      const data = await legal.generateDocument(type.name.en, fields, lang);
      setDoc(data.document);
    } catch (err) {
      setError(tError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard?.writeText(doc);
    setCopied(true);
    toast(t('Copied to clipboard', 'ক্লিপবোর্ডে কপি হয়েছে'));
    setTimeout(() => setCopied(false), 1500);
  };

  const download = async () => {
    try {
      await downloadTextAsPdf(doc, `${type.id}.pdf`, tr(type.name));
    } catch {
      toast(t('The PDF could not be made.', 'পিডিএফ তৈরি করা যায়নি।'), 'error');
    }
  };

  return (
    <Page>
      <Button
        variant="tertiary"
        size="sm"
        className="-ml-3"
        icon={<ArrowLeft className="size-4" />}
        onClick={() => setType(null)}
      >
        {t('All documents', 'সব দলিল')}
      </Button>
      <h1 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[34px]">{tr(type.name)}</h1>
      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
        <Card className="flex flex-col gap-5 p-6 lg:sticky lg:top-20">
          {type.fields.map((f) => (
            <Field key={f.key} label={tr(f.label)} htmlFor={`f-${type.fields.indexOf(f)}`}>
              {f.long ? (
                <Textarea
                  id={`f-${type.fields.indexOf(f)}`}
                  value={vals[f.key] || ''}
                  onChange={set(f.key)}
                  placeholder={f.sample}
                  className="min-h-20"
                />
              ) : (
                <Input
                  id={`f-${type.fields.indexOf(f)}`}
                  value={vals[f.key] || ''}
                  onChange={set(f.key)}
                  placeholder={f.sample}
                  inputMode={f.numeric ? 'numeric' : undefined}
                  type={f.email ? 'email' : 'text'}
                />
              )}
            </Field>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('Date', 'তারিখ')} htmlFor="f-date">
              <Input id="f-date" type="date" value={vals.date || ''} onChange={set('date')} />
            </Field>
            <Field label={t('District', 'জেলা')} htmlFor="f-place">
              <Select id="f-place" value={vals.place} onChange={set('place')}>
                {Object.entries(DISTRICTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {tr(v)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Button
            size="lg"
            disabled={!ready}
            loading={loading}
            onClick={generate}
            icon={<Sparkles className="size-5" />}
          >
            {loading
              ? t('Drafting…', 'খসড়া তৈরি হচ্ছে…')
              : doc
                ? t('Draft again', 'আবার তৈরি করুন')
                : t('Generate draft', 'খসড়া তৈরি করুন')}
          </Button>
          <Disclaimer />
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted">{t('Draft', 'খসড়া')}</p>
            {doc && (
              <div className="flex gap-2">
                <Button
                  variant="neutral"
                  size="sm"
                  icon={copied ? <Check className="size-4 text-accent-text" /> : <Copy className="size-4" />}
                  onClick={copy}
                >
                  {t('Copy', 'কপি')}
                </Button>
                <Button size="sm" icon={<Download className="size-4" />} onClick={download}>
                  {t('Download PDF', 'পিডিএফ ডাউনলোড')}
                </Button>
              </div>
            )}
          </div>

          {error && <ErrorState title={t('We couldn’t draft this', 'খসড়া তৈরি করা যায়নি')} body={error} onRetry={generate} />}

          {!error && loading && (
            <Card className="flex flex-col gap-3 p-8" aria-busy="true">
              <Skeleton className="mx-auto h-6 w-1/2" />
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} className={i % 3 === 2 ? 'h-4 w-2/3' : 'h-4 w-full'} />
              ))}
            </Card>
          )}

          {!error && !loading && !doc && (
            <Card>
              <EmptyState
                icon={<FileText className="size-6" />}
                title={t('Your draft will appear here', 'আপনার খসড়া এখানে দেখা যাবে')}
                body={t(
                  'Fill in every field, then press Generate draft.',
                  'সব ঘর পূরণ করে “খসড়া তৈরি করুন” চাপুন।',
                )}
              />
            </Card>
          )}

          {!error && !loading && doc && (
            <article className="anim-fade-up mx-auto w-full max-w-[680px] rounded-md border border-black/5 bg-white p-8 text-[13px] leading-[1.75] whitespace-pre-wrap text-[#1D1D1F] shadow-[0_2px_6px_rgb(0_0_0/0.06),0_20px_50px_rgb(0_0_0/0.10)] sm:p-14">
              {doc}
            </article>
          )}
        </div>
      </div>
    </Page>
  );
}
