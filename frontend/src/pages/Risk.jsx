import { ArrowRight, RotateCcw, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { Page } from '@/components/Layout';
import { SourceChips, SourceSheet } from '@/components/SourceSheet';
import {
  Button,
  Card,
  Chip,
  Disclaimer,
  ErrorState,
  Field,
  PageHeader,
  RiskBadge,
  Skeleton,
  Textarea,
} from '@/components/ui';

const EXAMPLES = [
  {
    en: 'The employee shall not work for any other company in Bangladesh for 5 years after leaving.',
    bn: 'চাকরি ছাড়ার পর ৫ বছর কর্মচারী বাংলাদেশের অন্য কোনো কোম্পানিতে কাজ করতে পারবেন না।',
  },
  {
    en: 'My friend gave me a cheque for ৳50,000 and it bounced.',
    bn: 'বন্ধু আমাকে ৫০,০০০ টাকার চেক দিয়েছিল, সেটি ডিজঅনার হয়েছে।',
  },
  {
    en: 'Rent is payable by the 5th of each month against a signed receipt.',
    bn: 'প্রতি মাসের ৫ তারিখের মধ্যে স্বাক্ষরিত রসিদের বিপরীতে ভাড়া প্রদেয়।',
  },
];

export default function RiskChecker() {
  const { t, tr, num, go, lang, tError } = useApp();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [source, setSource] = useState(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      setResult(await legal.checkRisk(text, lang));
    } catch (err) {
      setError(tError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <div className="mx-auto max-w-[720px]">
        <PageHeader
          eyebrow={t('Risk Checker', 'ঝুঁকি যাচাই')}
          title={t('Is this risky for me?', 'এটি কি আমার জন্য ঝুঁকিপূর্ণ?')}
          body={t(
            'Paste one clause or describe your situation in a sentence or two.',
            'একটি ধারা পেস্ট করুন বা দু-এক বাক্যে আপনার পরিস্থিতি লিখুন।',
          )}
        />
        <Card className="mt-8 p-5 sm:p-6">
          <Field label={t('Clause or situation', 'ধারা বা পরিস্থিতি')} htmlFor="risk-in">
            <Textarea
              id="risk-in"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t(
                'e.g. “The landlord may keep the deposit for any reason.”',
                'যেমন: “বাড়িওয়ালা যেকোনো কারণে জামানত রেখে দিতে পারবেন।”',
              )}
            />
          </Field>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <Chip key={e.en} onClick={() => setText(tr(e))}>
                {tr(e).slice(0, 44)}…
              </Chip>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              size="lg"
              disabled={text.trim().length < 8}
              loading={loading}
              onClick={run}
              icon={<ShieldAlert className="size-5" />}
            >
              {loading ? t('Checking…', 'যাচাই হচ্ছে…') : t('Check risk', 'ঝুঁকি যাচাই করুন')}
            </Button>
          </div>
        </Card>

        {loading && (
          <Card className="mt-4 flex flex-col gap-3 p-6" aria-busy="true">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
        )}

        {error && (
          <div className="mt-4">
            <ErrorState title={t('We couldn’t check this', 'যাচাই করা যায়নি')} body={error} onRetry={run} />
          </div>
        )}

        {result && (
          <Card className="anim-fade-up mt-4 overflow-hidden" aria-live="polite">
            <div className="p-6 sm:p-8">
              <RiskBadge level={result.level} size="lg" />
              {result.headline && (
                <h2 className="mt-4 text-[22px] font-semibold tracking-tight">{result.headline}</h2>
              )}
              <p className="mt-2 text-[15px] leading-[1.7] text-muted">{result.explanation}</p>
              {result.sources?.length > 0 && (
                <>
                  <h3 className="mt-6 mb-2 text-[13px] font-semibold text-muted">
                    {t('Law it was checked against', 'যে আইনের সঙ্গে মেলানো হয়েছে')}
                  </h3>
                  <SourceChips sources={result.sources} onOpen={setSource} />
                </>
              )}
            </div>
            <div className="border-t border-line bg-surface-2 p-6 sm:p-8">
              {result.steps.length > 0 && (
                <>
                  <h3 className="text-[17px] font-semibold">{t('Next steps', 'পরবর্তী পদক্ষেপ')}</h3>
                  <ol className="mt-3 flex flex-col gap-2.5">
                    {result.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-[15px]">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-[12px] font-semibold text-accent-text">
                          {num(i + 1)}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Disclaimer />
                <div className="flex gap-2">
                  <Button
                    variant="tertiary"
                    icon={<RotateCcw className="size-4" />}
                    onClick={() => {
                      setResult(null);
                      setText('');
                    }}
                  >
                    {t('Check another', 'আরেকটি যাচাই')}
                  </Button>
                  <Button
                    variant="secondary"
                    iconRight={<ArrowRight className="size-4" />}
                    onClick={() => go('/lawyers')}
                  >
                    {t('Talk to a lawyer', 'আইনজীবীর সঙ্গে কথা বলুন')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <SourceSheet source={source} onClose={() => setSource(null)} />
    </Page>
  );
}
