import {
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  RotateCcw,
  ScanText,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { downloadTextAsPdf } from '@/lib/pdf';
import { Page } from '@/components/Layout';
import {
  Button,
  Card,
  Disclaimer,
  Dropzone,
  ErrorState,
  PageHeader,
  RiskBadge,
  RiskDial,
  Skeleton,
  Spinner,
  Tabs,
  Textarea,
} from '@/components/ui';

const SAMPLE = `HOUSE RENT AGREEMENT
This agreement is made on 1 January 2026 between Mr. Karim (Landlord) and Ms. Rina (Tenant) for the flat at House 12, Road 5, Dhanmondi, Dhaka.
1. Monthly rent is BDT 35,000, payable by the 5th of each month.
2. The Tenant shall pay six (6) months' rent in advance, which is non-refundable.
3. The Landlord may terminate this agreement at any time without notice.
4. Late payment shall attract a penalty of BDT 5,000 per day.
5. The Tenant is responsible for all repairs, including structural repairs.`;

const LEVELS = ['low', 'medium', 'high'];
const level = (severity) => {
  const value = String(severity || '').toLowerCase();
  if (value === 'critical') return 'high';
  return LEVELS.includes(value) ? value : 'medium';
};
const MAX_FILE_MB = 16;

export default function Contract() {
  const { t, num, toast, tError, lang } = useApp();
  const [mode, setMode] = useState('paste');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [reading, setReading] = useState(false);
  const [usedOcr, setUsedOcr] = useState(false);
  const [stage, setStage] = useState('input');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onFiles = async (files) => {
    const picked = files[0];
    if (picked.size > MAX_FILE_MB * 1024 * 1024) {
      toast(t(`File is larger than ${MAX_FILE_MB} MB`, `ফাইলটি ${num(MAX_FILE_MB)} MB-এর বেশি`), 'error');
      return;
    }
    setFile(picked);
    setText('');
    setReading(true);
    try {
      const data = await legal.extractText(picked);
      setText(data.text);
      setUsedOcr(Boolean(data.ocr));
    } catch (err) {
      setFile(null);
      toast(tError(err.message), 'error');
    } finally {
      setReading(false);
    }
  };

  const ready = text.trim().length > 20 && !reading;

  const analyze = async () => {
    setStage('analyzing');
    setError('');
    try {
      const data = await legal.analyzeContract(text, lang);
      setResult({
        score: Number(data.riskScore) || 0,
        summary: data.summary || '',
        terms: data.keyTerms || [],
        risks: (data.risks || []).map((r) => ({ ...r, level: level(r.severity) })),
        recommendations: data.recommendations || [],
      });
      setStage('result');
    } catch (err) {
      setError(tError(err.message));
      setStage('error');
    }
  };

  const reset = () => {
    setStage('input');
    setResult(null);
    setFile(null);
    setText('');
    setUsedOcr(false);
  };

  const downloadReport = async () => {
    const lines = [
      `${t('Risk score', 'ঝুঁকি স্কোর')}: ${num(result.score)}/100`,
      '',
      t('Summary', 'সারসংক্ষেপ'),
      result.summary,
      '',
      t('Key terms', 'মূল শর্তাবলি'),
      ...result.terms.map((k) => `- ${k.term}: ${k.explanation}`),
      '',
      t('Risks', 'ঝুঁকিসমূহ'),
      ...result.risks.map((r) => `- [${r.level}] ${r.title || ''} ${r.risk || ''}`.trim()),
      '',
      t('Recommendations', 'সুপারিশ'),
      ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
      '',
      t('This is legal information, not legal advice.', 'এটি আইনি তথ্য, আইনি পরামর্শ নয়।'),
    ];
    try {
      await downloadTextAsPdf(lines.join('\n'), 'contract-report.pdf', t('Contract report', 'চুক্তি প্রতিবেদন'));
    } catch {
      toast(t('Could not create the PDF', 'পিডিএফ তৈরি করা যায়নি'), 'error');
    }
  };

  const counts = result
    ? LEVELS.map((l) => result.risks.filter((r) => r.level === l).length)
    : [0, 0, 0];

  return (
    <Page>
      <PageHeader
        eyebrow={t('Contract Analyzer', 'চুক্তি বিশ্লেষক')}
        title={
          stage === 'result'
            ? t('Your contract report', 'আপনার চুক্তি প্রতিবেদন')
            : t('Check a contract before you sign', 'স্বাক্ষরের আগে চুক্তি যাচাই করুন')
        }
        body={
          stage === 'result'
            ? undefined
            : t(
                'Paste the text or upload a file. We’ll score the risk and explain each clause that needs attention.',
                'লেখা পেস্ট করুন বা ফাইল আপলোড করুন। আমরা ঝুঁকি মূল্যায়ন করে মনোযোগ প্রয়োজন এমন প্রতিটি ধারা ব্যাখ্যা করব।',
              )
        }
        right={
          stage === 'result' && (
            <div className="flex gap-2">
              <Button variant="neutral" icon={<RotateCcw className="size-4" />} onClick={reset}>
                {t('New analysis', 'নতুন বিশ্লেষণ')}
              </Button>
              <Button icon={<Download className="size-4" />} onClick={downloadReport}>
                {t('Download PDF report', 'পিডিএফ প্রতিবেদন')}
              </Button>
            </div>
          )
        }
      />

      {(stage === 'input' || stage === 'error') && (
        <Card className="mt-10 max-w-[820px] p-5 sm:p-8">
          <Tabs
            label={t('Input method', 'ইনপুট পদ্ধতি')}
            value={mode}
            onChange={setMode}
            tabs={[
              { value: 'paste', label: t('Paste text', 'লেখা পেস্ট'), icon: <FileText className="size-4" /> },
              { value: 'upload', label: t('Upload file', 'ফাইল আপলোড'), icon: <ScanText className="size-4" /> },
            ]}
          />
          <div className="mt-6">
            {mode === 'paste' ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="ctext" className="sr-only">
                  {t('Contract text', 'চুক্তির লেখা')}
                </label>
                <Textarea
                  id="ctext"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-64 font-mono text-[13px]"
                  placeholder={t('Paste your contract here…', 'আপনার চুক্তি এখানে পেস্ট করুন…')}
                />
                <div className="flex items-center justify-between text-[13px] text-muted">
                  <button
                    onClick={() => setText(SAMPLE)}
                    className="rounded font-medium text-accent-text hover:underline"
                  >
                    {t('Try a sample rent agreement', 'নমুনা ভাড়া চুক্তি ব্যবহার করুন')}
                  </button>
                  <span className="tabular-nums">
                    {num(text.length)} {t('characters', 'অক্ষর')}
                  </span>
                </div>
              </div>
            ) : !file ? (
              <Dropzone
                onFiles={onFiles}
                accept=".pdf,.txt,.png,.jpg,.jpeg,.webp,.tif,.tiff"
                title={t('Drop a PDF, TXT or photo', 'পিডিএফ, টিএক্সটি বা ছবি দিন')}
                hint={t(
                  `Scanned pages and phone photos work too · up to ${MAX_FILE_MB} MB`,
                  `স্ক্যান করা পাতা ও মোবাইলের ছবিও চলবে · সর্বোচ্চ ${num(MAX_FILE_MB)} MB`,
                )}
              />
            ) : (
              <div className="rounded-2xl border border-line bg-surface-2 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-surface text-muted">
                    {file.type.startsWith('image') ? (
                      <ImageIcon className="size-5" strokeWidth={1.75} />
                    ) : (
                      <FileText className="size-5" strokeWidth={1.75} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">{file.name}</p>
                    <p className="text-[13px] text-muted">
                      {reading ? (
                        <span className="flex items-center gap-1.5">
                          <Spinner className="size-3.5" />
                          {t('Reading the file…', 'ফাইল পড়া হচ্ছে…')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-accent-text">
                          <CheckCircle2 className="size-3.5" />
                          {usedOcr
                            ? t(
                                `Scanned text read · ${num(text.length)} characters`,
                                `স্ক্যান করা লেখা পড়া হয়েছে · ${num(text.length)} অক্ষর`,
                              )
                            : t(`Ready · ${num(text.length)} characters`, `প্রস্তুত · ${num(text.length)} অক্ষর`)}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setText('');
                    }}
                    disabled={reading}
                    aria-label={t('Remove file', 'ফাইল সরান')}
                    className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-fg/5 disabled:opacity-40"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                {reading && (
                  <p className="mt-3 text-[13px] text-muted">
                    {t(
                      'Scanned pages are read with OCR, which can take up to a minute.',
                      'স্ক্যান করা পাতা OCR দিয়ে পড়া হয়, এতে এক মিনিট পর্যন্ত লাগতে পারে।',
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
          {stage === 'error' && (
            <div className="mt-6">
              <ErrorState
                title={t('We couldn’t analyse this contract', 'চুক্তিটি বিশ্লেষণ করা যায়নি')}
                body={error}
                onRetry={analyze}
              />
            </div>
          )}
          <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <Disclaimer />
            <Button size="lg" disabled={!ready} onClick={analyze} icon={<Sparkles className="size-5" />}>
              {t('Analyze contract', 'চুক্তি বিশ্লেষণ করুন')}
            </Button>
          </div>
        </Card>
      )}

      {stage === 'analyzing' && (
        <div
          className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]"
          aria-busy="true"
          aria-label={t('Analyzing', 'বিশ্লেষণ চলছে')}
        >
          <Card className="flex flex-col items-center gap-4 p-8">
            <Skeleton className="size-40 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </Card>
          <Card className="flex flex-col gap-3 p-8">
            <p className="mb-2 text-[15px] text-muted">
              {t(
                'Reading clauses and matching them to Bangladeshi law…',
                'ধারাগুলো পড়ে বাংলাদেশের আইনের সঙ্গে মেলানো হচ্ছে…',
              )}
            </p>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-4 h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </Card>
        </div>
      )}

      {stage === 'result' && result && (
        <div className="anim-fade-up mt-10 grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            <Card className="flex flex-col items-center p-8">
              <RiskDial score={result.score} />
              <p className="mt-5 text-center text-[13px] text-muted">
                {t(
                  `${counts[2]} high, ${counts[1]} medium and ${counts[0]} low-risk points found.`,
                  `${num(counts[2])}টি উচ্চ, ${num(counts[1])}টি মাঝারি ও ${num(counts[0])}টি কম ঝুঁকির বিষয় পাওয়া গেছে।`,
                )}
              </p>
            </Card>
            {result.terms.length > 0 && (
              <Card className="p-6">
                <h2 className="text-[15px] font-semibold">{t('Key terms', 'মূল শর্তাবলি')}</h2>
                <dl className="mt-3 divide-y divide-line">
                  {result.terms.map((k) => (
                    <div key={k.term} className="py-2.5 text-[14px]">
                      <dt className="font-medium">{k.term}</dt>
                      <dd className="mt-0.5 text-muted">{k.explanation}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Card className="p-6 sm:p-8">
              <h2 className="text-[22px] font-semibold tracking-tight">{t('Summary', 'সারসংক্ষেপ')}</h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-muted">{result.summary}</p>
            </Card>
            <Card className="p-6 sm:p-8">
              <h2 className="text-[22px] font-semibold tracking-tight">{t('Risks', 'ঝুঁকিসমূহ')}</h2>
              {result.risks.length === 0 ? (
                <p className="mt-3 text-[15px] text-muted">
                  {t('No risky clauses found.', 'কোনো ঝুঁকিপূর্ণ ধারা পাওয়া যায়নি।')}
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {result.risks.map((r, i) => (
                    <li key={i} className="rounded-2xl border border-line p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <RiskBadge level={r.level} short />
                        {r.clause && (
                          <span className="text-[13px] text-muted">
                            {t('Clause', 'ধারা')} {num(r.clause)}
                          </span>
                        )}
                      </div>
                      {r.title && <h3 className="mt-2 text-[17px] font-semibold">{r.title}</h3>}
                      <p className="mt-1 text-[15px] text-muted">{r.risk}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            {result.recommendations.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-[22px] font-semibold tracking-tight">
                  <Lightbulb className="size-5 text-accent-text" /> {t('Recommendations', 'সুপারিশ')}
                </h2>
                <ol className="mt-4 flex flex-col gap-3">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-[15px]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-[12px] font-semibold text-accent-text">
                        {num(i + 1)}
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
                <Disclaimer className="mt-6" />
              </Card>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
