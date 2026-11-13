import { Check, Minus } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/app';
import { Page } from '@/components/Layout';
import { Badge, Button, Card, PageHeader, Segmented, cx } from '@/components/ui';
export default function Pricing() {
  const { t, num, go } = useApp();
  const [cycle, setCycle] = useState('m');
  const plans = [
    {
      id: 'free',
      name: t('Free', 'ফ্রি'),
      price: 0,
      desc: t('For a question now and then.', 'মাঝে মাঝে প্রশ্নের জন্য।'),
      cta: t('Start free', 'ফ্রি শুরু করুন'),
      items: [
        t('20 questions a month', 'মাসে ২০টি প্রশ্ন'),
        t('1 contract analysis', '১টি চুক্তি বিশ্লেষণ'),
        t('Law updates', 'আইন হালনাগাদ'),
      ],
    },
    {
      id: 'pro',
      name: t('Pro', 'প্রো'),
      price: 499,
      desc: t('For people and freelancers.', 'ব্যক্তি ও ফ্রিল্যান্সারদের জন্য।'),
      cta: t('Get Pro', 'প্রো নিন'),
      items: [
        t('Unlimited questions', 'সীমাহীন প্রশ্ন'),
        t('20 contract analyses', '২০টি চুক্তি বিশ্লেষণ'),
        t('All 5 document types', 'সব ৫ ধরনের দলিল'),
        t('PDF reports', 'পিডিএফ প্রতিবেদন'),
      ],
    },
    {
      id: 'firm',
      name: t('Firm', 'ফার্ম'),
      price: 2499,
      desc: t('For chambers and small businesses.', 'চেম্বার ও ছোট ব্যবসার জন্য।'),
      cta: t('Contact sales', 'যোগাযোগ করুন'),
      items: [
        t('Everything in Pro', 'প্রো-এর সবকিছু'),
        t('Up to 10 members', 'সর্বোচ্চ ১০ জন সদস্য'),
        t('Unlimited analyses', 'সীমাহীন বিশ্লেষণ'),
        t('Priority support', 'অগ্রাধিকার সহায়তা'),
      ],
    },
  ];
  const price = (p) => (cycle === 'm' ? p : Math.round(p * 10));
  const rows = [
    [
      t('Questions to Ask AI', 'এআই প্রশ্ন'),
      [t('20 / mo', '২০ / মাস'), t('Unlimited', 'সীমাহীন'), t('Unlimited', 'সীমাহীন')],
    ],
    [
      t('Contract analyses', 'চুক্তি বিশ্লেষণ'),
      [t('1 / mo', '১ / মাস'), t('20 / mo', '২০ / মাস'), t('Unlimited', 'সীমাহীন')],
    ],
    [
      t('Risk checks', 'ঝুঁকি যাচাই'),
      [t('5 / mo', '৫ / মাস'), t('Unlimited', 'সীমাহীন'), t('Unlimited', 'সীমাহীন')],
    ],
    [t('Document generator', 'দলিল তৈরি'), [false, true, true]],
    [t('Scanned file reading (OCR)', 'স্ক্যান ফাইল পড়া (ওসিআর)'), [false, true, true]],
    [t('PDF reports', 'পিডিএফ প্রতিবেদন'), [false, true, true]],
    [t('Team members', 'টিম সদস্য'), ['1', '1', t('Up to 10', 'সর্বোচ্চ ১০')]],
  ];
  return (
    <Page>
      <div className="flex flex-col items-center text-center">
        <PageHeader title={t('Simple pricing, in taka', 'সহজ মূল্য, টাকায়')} />
        <p className="mt-2 text-[17px] text-muted">
          {t('Start free. Upgrade when you need more.', 'বিনামূল্যে শুরু করুন। প্রয়োজনে আপগ্রেড করুন।')}
        </p>
        <Segmented
          className="mt-8"
          label={t('Billing cycle', 'বিলিং চক্র')}
          value={cycle}
          onChange={setCycle}
          options={[
            { value: 'm', label: t('Monthly', 'মাসিক') },
            {
              value: 'y',
              label: (
                <>
                  {t('Yearly', 'বার্ষিক')} <span className="text-accent-text">−17%</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const featured = p.id === 'pro';
          return (
            <Card
              key={p.id}
              className={cx('relative flex flex-col p-7', featured && 'border-accent ring-1 ring-accent')}
            >
              {featured && (
                <Badge tone="accent" className="absolute top-6 right-6">
                  {t('Most popular', 'সবচেয়ে জনপ্রিয়')}
                </Badge>
              )}
              <h2 className="text-[17px] font-semibold">{p.name}</h2>
              <p className="mt-1 text-[14px] text-muted">{p.desc}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-[40px] font-semibold tracking-tight tabular-nums">
                  ৳{num(price(p.price))}
                </span>
                <span className="text-[14px] text-muted">
                  {cycle === 'm' ? t('/ month', '/ মাস') : t('/ year', '/ বছর')}
                </span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {p.items.map((i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[15px]">
                    <Check className="size-4 shrink-0 text-accent-text" /> {i}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={featured ? 'primary' : 'secondary'}
                onClick={() => go(p.id === 'firm' ? '/contact' : '/signin')}
              >
                {p.cta}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mx-auto mt-20 max-w-[1040px]">
        <h2 className="text-[22px] font-semibold tracking-tight">{t('Compare plans', 'প্ল্যান তুলনা')}</h2>
        <Card className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-line">
                <th className="p-4 font-medium text-muted">{t('Feature', 'ফিচার')}</th>
                {plans.map((p) => (
                  <th key={p.id} className="p-4 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, vals]) => (
                <tr key={label} className="border-b border-line last:border-0">
                  <td className="p-4">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      {v === true ? (
                        <Check
                          className="mx-auto size-4 text-accent-text"
                          aria-label={t('Included', 'অন্তর্ভুক্ত')}
                        />
                      ) : v === false ? (
                        <Minus
                          className="mx-auto size-4 text-muted"
                          aria-label={t('Not included', 'অন্তর্ভুক্ত নয়')}
                        />
                      ) : (
                        <span className="text-muted">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="mt-4 text-[13px] text-muted">
          {t(
            'Pay with bKash, Nagad or card. Prices include VAT.',
            'বিকাশ, নগদ বা কার্ডে পরিশোধ করুন। মূল্যে ভ্যাট অন্তর্ভুক্ত।',
          )}
        </p>
      </div>
    </Page>
  );
}
