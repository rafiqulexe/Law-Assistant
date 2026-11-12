import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { 
  FileSearch, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Brain,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

const featureLinks = [
  { icon: FileSearch, path: "ContractAnalyzer" },
  { icon: FileText, path: "DocumentGenerator" },
  { icon: ShieldCheck, path: "RiskChecker" },
  { icon: MessageSquare, path: "LegalChat" },
  { icon: Users, path: "FindLawyer" },
];

const highlightIcons = [Brain, Clock, Shield, Zap];

const featureImages = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800",
  "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
];

const text = {
  en: {
    badge: "Powerful Features",
    title1: "AI-Powered ",
    title2: "Legal Solutions",
    intro: "Discover our comprehensive suite of AI tools designed to revolutionize how you handle legal matters.",
    feature: "Feature",
    tryTool: "Try {name}",
    features: [
      {
        title: "AI Contract Analyzer",
        description: "Upload any contract and receive instant analysis with risk identification, clause summaries, and plain-language explanations.",
        benefits: ["Identify potential risks and red flags", "Get plain-language clause explanations", "Compare against industry standards", "Export detailed analysis reports"],
      },
      {
        title: "Document Generator",
        description: "Create professional legal documents in minutes using AI-powered templates customized to your needs.",
        benefits: ["NDA & Confidentiality Agreements", "Freelance & Service Contracts", "Rental & Lease Agreements", "Terms of Service & Privacy Policies"],
      },
      {
        title: "Risk & Compliance Checker",
        description: "Automated compliance verification ensuring your documents meet regulatory requirements.",
        benefits: ["Bangladesh law compliance checking", "Industry regulation verification", "Risk scoring and assessment", "Remediation recommendations"],
      },
      {
        title: "Legal Assistant Chat",
        description: "Get instant answers to legal questions with our AI-powered chat assistant trained on legal knowledge.",
        benefits: ["24/7 instant legal guidance", "Multi-language support", "Context-aware responses", "Citation of relevant laws"],
      },
      {
        title: "Find a Lawyer Near You",
        description: "Connect with verified lawyers based on location, specialty, ratings, and availability.",
        benefits: ["Location-based search", "Filter by legal specialty", "Verified ratings and reviews", "Direct contact options"],
      },
    ],
    highlights: [
      { title: "Advanced AI Technology", description: "Powered by state-of-the-art language models trained on millions of legal documents." },
      { title: "Save Time & Money", description: "Reduce legal costs by up to 80% and get results in minutes instead of days." },
      { title: "Bank-Level Security", description: "Your data is encrypted and protected with enterprise-grade security measures." },
      { title: "Instant Results", description: "Get analysis, documents, and answers in seconds, not hours or days." },
    ],
    ctaTitle1: "Ready to Experience the ",
    ctaTitle2: "Future of Legal?",
    ctaText: "Start using LexAI today and transform your legal workflow.",
    ctaButton: "Get Started Now",
  },
  bn: {
    badge: "শক্তিশালী ফিচার",
    title1: "এআই-চালিত ",
    title2: "আইনি সমাধান",
    intro: "আইনি কাজ সামলানোর ধরন বদলে দিতে তৈরি আমাদের এআই টুলগুলো ঘুরে দেখুন।",
    feature: "ফিচার",
    tryTool: "{name} ব্যবহার করুন",
    features: [
      {
        title: "এআই চুক্তি বিশ্লেষণ",
        description: "যেকোনো চুক্তি আপলোড করুন, সঙ্গে সঙ্গে পান ঝুঁকি চিহ্নিতকরণ, ধারার সারসংক্ষেপ আর সহজ ভাষায় ব্যাখ্যা।",
        benefits: ["সম্ভাব্য ঝুঁকি ও বিপদসংকেত চিহ্নিত করুন", "প্রতিটি ধারার সহজ ভাষায় ব্যাখ্যা পান", "প্রচলিত মানের সঙ্গে তুলনা করুন", "বিস্তারিত বিশ্লেষণ রিপোর্ট নামিয়ে নিন"],
      },
      {
        title: "দলিল তৈরি",
        description: "আপনার প্রয়োজন অনুযায়ী এআই টেমপ্লেট দিয়ে কয়েক মিনিটে পেশাদার আইনি দলিল তৈরি করুন।",
        benefits: ["NDA ও গোপনীয়তা চুক্তি", "ফ্রিল্যান্স ও সেবা চুক্তি", "বাড়িভাড়া ও ইজারা চুক্তি", "ব্যবহারের শর্তাবলি ও গোপনীয়তা নীতি"],
      },
      {
        title: "ঝুঁকি ও আইন মেনে চলা যাচাই",
        description: "আপনার দলিল প্রয়োজনীয় আইন ও বিধি মেনে চলছে কি না, তা স্বয়ংক্রিয়ভাবে যাচাই করুন।",
        benefits: ["বাংলাদেশের আইন মেনে চলা যাচাই", "খাতভিত্তিক বিধি যাচাই", "ঝুঁকির মাত্রা নির্ণয়", "সমাধানের পরামর্শ"],
      },
      {
        title: "আইনি সহকারী চ্যাট",
        description: "আইনি জ্ঞানের ওপর তৈরি আমাদের এআই চ্যাট সহকারীর কাছ থেকে আইনি প্রশ্নের তাৎক্ষণিক উত্তর পান।",
        benefits: ["২৪/৭ তাৎক্ষণিক আইনি দিকনির্দেশনা", "বাংলা ও ইংরেজিতে উত্তর", "আগের প্রশ্ন মনে রেখে উত্তর", "সংশ্লিষ্ট আইনের সূত্র"],
      },
      {
        title: "কাছাকাছি আইনজীবী খুঁজুন",
        description: "এলাকা, বিশেষজ্ঞতা, রেটিং আর সময় দেখে যাচাই করা আইনজীবীর সঙ্গে যোগাযোগ করুন।",
        benefits: ["এলাকাভিত্তিক খোঁজ", "আইনের শাখা অনুযায়ী বাছাই", "যাচাই করা রেটিং ও রিভিউ", "সরাসরি যোগাযোগের সুযোগ"],
      },
    ],
    highlights: [
      { title: "উন্নত এআই প্রযুক্তি", description: "লাখো আইনি দলিলের ওপর প্রশিক্ষিত আধুনিক ভাষা মডেলের সাহায্যে চলে।" },
      { title: "সময় ও খরচ বাঁচান", description: "আইনি খরচ ৮০% পর্যন্ত কমান, ফলাফল পান দিনের বদলে কয়েক মিনিটে।" },
      { title: "ব্যাংক-মানের নিরাপত্তা", description: "আপনার তথ্য এনক্রিপ্ট করা এবং প্রতিষ্ঠান-মানের নিরাপত্তায় সুরক্ষিত।" },
      { title: "তাৎক্ষণিক ফলাফল", description: "বিশ্লেষণ, দলিল আর উত্তর পান কয়েক সেকেন্ডে, ঘণ্টা বা দিনের অপেক্ষা ছাড়াই।" },
    ],
    ctaTitle1: "আইনি সেবার ",
    ctaTitle2: "ভবিষ্যৎ দেখতে প্রস্তুত?",
    ctaText: "আজই LexAI ব্যবহার শুরু করুন, বদলে দিন আপনার আইনি কাজের ধরন।",
    ctaButton: "এখনই শুরু করুন",
  },
};

export default function Features() {
  const { language } = useI18n();
  const c = text[language] || text.en;
  const features = featureLinks.map((link, index) => ({ ...link, ...c.features[index] }));
  const highlights = c.highlights.map((item, index) => ({ ...item, icon: highlightIcons[index] }));

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
            <p className="text-xl text-slate-400 leading-relaxed">
              {c.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 border-y border-amber-900/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
                    <feature.icon className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">{c.feature}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{feature.title}</h2>
                  <p className="text-lg text-slate-400 mb-8 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-amber-500" />
                        </div>
                        <span className="text-slate-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={createPageUrl(feature.path)}>
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                      {c.tryTool.replace('{name}', feature.title)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10">
                    <img 
                      src={featureImages[index]}
                      alt={feature.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">{c.ctaTitle1}</span>
              <span className="gradient-text">{c.ctaTitle2}</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              {c.ctaText}
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-lg px-10 py-6 rounded-xl shadow-xl shadow-amber-500/30"
              >
                {c.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}