import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';
import { 
  Check, 
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight
} from 'lucide-react';

const planMeta = [
  { icon: Zap, monthlyPrice: 29, yearlyPrice: 290, popular: false, included: [true, true, true, true, true, true, false, false, false] },
  { icon: Crown, monthlyPrice: 79, yearlyPrice: 790, popular: true, included: [true, true, true, true, true, true, true, true, false] },
  { icon: Building2, monthlyPrice: 199, yearlyPrice: 1990, popular: false, included: [true, true, true, true, true, true, true, true, true] },
];

const text = {
  en: {
    badge: "Simple Pricing",
    title1: "Choose Your ",
    title2: "Plan",
    intro: "Start with a free trial. No credit card required.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 20%",
    popular: "Most Popular",
    perMonth: "month",
    perYear: "year",
    plans: [
      {
        name: "Starter",
        description: "Perfect for individuals getting started with legal AI",
        features: ["10 Contract Analyses/month", "5 Document Generations/month", "Basic Compliance Checks", "50 AI Chat Messages/month", "Lawyer Directory Access", "Email Support", "Priority Processing", "Custom Templates", "API Access"],
        cta: "Get Started",
      },
      {
        name: "Professional",
        description: "Ideal for professionals and small businesses",
        features: ["50 Contract Analyses/month", "30 Document Generations/month", "Advanced Compliance Checks", "200 AI Chat Messages/month", "Lawyer Directory Access", "Priority Email & Chat Support", "Priority Processing", "Custom Templates", "API Access"],
        cta: "Start Free Trial",
      },
      {
        name: "Enterprise",
        description: "For organizations with advanced legal needs",
        features: ["Unlimited Contract Analyses", "Unlimited Document Generations", "Full Compliance Suite", "Unlimited AI Chat", "Lawyer Directory Access", "24/7 Dedicated Support", "Priority Processing", "Custom Templates", "Full API Access"],
        cta: "Contact Sales",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqIntro: "Have questions? We've got answers.",
    faqs: [
      { question: "Can I change my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle." },
      { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise accounts." },
      { question: "Is there a free trial?", answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start." },
      { question: "What happens if I exceed my limits?", answer: "We'll notify you before you reach your limits. You can upgrade your plan or purchase additional credits as needed." },
    ],
  },
  bn: {
    badge: "সহজ মূল্য",
    title1: "আপনার ",
    title2: "প্ল্যান বেছে নিন",
    intro: "বিনামূল্যে ট্রায়াল দিয়ে শুরু করুন। কোনো ক্রেডিট কার্ড লাগবে না।",
    monthly: "মাসিক",
    yearly: "বার্ষিক",
    save: "২০% সাশ্রয়",
    popular: "সবচেয়ে জনপ্রিয়",
    perMonth: "মাস",
    perYear: "বছর",
    plans: [
      {
        name: "স্টার্টার",
        description: "যাঁরা প্রথমবার আইনি এআই ব্যবহার শুরু করছেন, তাঁদের জন্য",
        features: ["মাসে ১০টি চুক্তি বিশ্লেষণ", "মাসে ৫টি দলিল তৈরি", "মৌলিক আইন মেনে চলা যাচাই", "মাসে ৫০টি এআই চ্যাট বার্তা", "আইনজীবী তালিকা দেখার সুযোগ", "ইমেইল সহায়তা", "অগ্রাধিকার প্রক্রিয়াকরণ", "নিজস্ব টেমপ্লেট", "API ব্যবহারের সুযোগ"],
        cta: "শুরু করুন",
      },
      {
        name: "প্রফেশনাল",
        description: "পেশাজীবী ও ক্ষুদ্র ব্যবসার জন্য উপযুক্ত",
        features: ["মাসে ৫০টি চুক্তি বিশ্লেষণ", "মাসে ৩০টি দলিল তৈরি", "উন্নত আইন মেনে চলা যাচাই", "মাসে ২০০টি এআই চ্যাট বার্তা", "আইনজীবী তালিকা দেখার সুযোগ", "অগ্রাধিকার ইমেইল ও চ্যাট সহায়তা", "অগ্রাধিকার প্রক্রিয়াকরণ", "নিজস্ব টেমপ্লেট", "API ব্যবহারের সুযোগ"],
        cta: "বিনামূল্যে ট্রায়াল শুরু করুন",
      },
      {
        name: "এন্টারপ্রাইজ",
        description: "বড় পরিসরের আইনি প্রয়োজনের প্রতিষ্ঠানের জন্য",
        features: ["সীমাহীন চুক্তি বিশ্লেষণ", "সীমাহীন দলিল তৈরি", "পূর্ণাঙ্গ আইন মেনে চলা যাচাই", "সীমাহীন এআই চ্যাট", "আইনজীবী তালিকা দেখার সুযোগ", "২৪/৭ নিবেদিত সহায়তা", "অগ্রাধিকার প্রক্রিয়াকরণ", "নিজস্ব টেমপ্লেট", "পূর্ণ API ব্যবহারের সুযোগ"],
        cta: "বিক্রয় দলের সঙ্গে যোগাযোগ",
      },
    ],
    faqTitle: "সচরাচর জিজ্ঞাসা",
    faqIntro: "প্রশ্ন আছে? উত্তর এখানে।",
    faqs: [
      { question: "পরে কি প্ল্যান বদলানো যাবে?", answer: "হ্যাঁ, যেকোনো সময় প্ল্যান বাড়ানো বা কমানো যাবে। পরিবর্তন কার্যকর হবে পরের বিলিং চক্র থেকে।" },
      { question: "কীভাবে পেমেন্ট করা যায়?", answer: "সব প্রধান ক্রেডিট কার্ড, PayPal এবং এন্টারপ্রাইজ অ্যাকাউন্টের জন্য ব্যাংক ট্রান্সফার গ্রহণ করা হয়।" },
      { question: "বিনামূল্যে ট্রায়াল আছে কি?", answer: "হ্যাঁ, প্রতিটি পেইড প্ল্যানে ১৪ দিনের বিনামূল্যে ট্রায়াল আছে। শুরু করতে কোনো ক্রেডিট কার্ড লাগবে না।" },
      { question: "সীমা পেরিয়ে গেলে কী হবে?", answer: "সীমায় পৌঁছানোর আগেই আপনাকে জানানো হবে। প্রয়োজনে প্ল্যান বাড়াতে বা বাড়তি ক্রেডিট কিনতে পারবেন।" },
    ],
  },
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { language, formatNumber } = useI18n();
  const c = text[language] || text.en;
  const plans = planMeta.map((meta, index) => ({
    ...meta,
    ...c.plans[index],
    features: c.plans[index].features.map((featureText, i) => ({ text: featureText, included: meta.included[i] })),
  }));
  const faqs = c.faqs;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{c.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{c.title1}</span>
              <span className="gradient-text">{c.title2}</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              {c.intro}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-slate-400'}`}>{c.monthly}</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-amber-500"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                {c.yearly}
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                  {c.save}
                </Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-amber-500/50' 
                    : 'bg-slate-900/80 border-amber-900/30'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-4 py-1">
                        {c.popular}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-4">
                      <plan.icon className="h-7 w-7 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-white">
                        ${formatNumber(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                      </span>
                      <span className="text-slate-400">/{isYearly ? c.perYear : c.perMonth}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {c.faqTitle}
            </h2>
            <p className="text-slate-400">
              {c.faqIntro}
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-amber-900/30">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-slate-400">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}