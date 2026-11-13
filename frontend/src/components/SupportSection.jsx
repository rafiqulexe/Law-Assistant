import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Coffee, Heart, Sparkles, ArrowUpRight, Quote } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const text = {
  en: {
    badge: "Support Bidhanshala",
    title1: "Help keep legal answers",
    title2: "free for everyone.",
    paragraphs: [
      "I'm Rafiqul Islam, a developer from Bangladesh. I built Bidhanshala because finding a clear answer in our laws should not need a lawyer's office or a day of searching through old PDFs.",
      "Bidhanshala is free to use. It reads the official Laws of Bangladesh, keeps itself up to date when laws change, and explains them in Bangla and English.",
      "Servers, AI models and the time to keep improving it all cost money. If Bidhanshala helped you, any support keeps it free for the next person who needs it.",
    ],
    quote: "Every taka keeps the law within reach.",
    button: "Support Bidhanshala",
    imageAlt: "Developer working on the Bidhanshala project",
    captionTitle: "Built in Bangladesh",
    captionText: "Made in Bangladesh, for the people of Bangladesh.",
  },
  bn: {
    badge: "বিধানশালাকে সহায়তা করুন",
    title1: "আইনি উত্তর সবার জন্য",
    title2: "বিনামূল্যে রাখতে সাহায্য করুন।",
    paragraphs: [
      "আমি রফিকুল ইসলাম, বাংলাদেশের একজন ডেভেলপার। আমাদের আইনে একটা পরিষ্কার উত্তর খুঁজতে উকিলের চেম্বারে যেতে হবে বা পুরোনো PDF ঘেঁটে সারাদিন কাটাতে হবে — এমন হওয়া উচিত নয়। এই ভাবনা থেকেই বিধানশালা বানিয়েছি।",
      "বিধানশালা ব্যবহার করা বিনামূল্যে। এটি বাংলাদেশের সরকারি আইন পড়ে, আইন বদলালে নিজেকে হালনাগাদ রাখে, আর বাংলা ও ইংরেজিতে সহজ করে বুঝিয়ে দেয়।",
      "সার্ভার, এআই মডেল আর এটিকে নিয়মিত উন্নত করার সময় — সবকিছুতেই খরচ আছে। বিধানশালা আপনার কাজে লাগলে, আপনার যেকোনো সহায়তা পরের মানুষটির জন্য এটিকে বিনামূল্যে রাখবে।",
    ],
    quote: "প্রতিটি টাকা আইনকে মানুষের নাগালে রাখে।",
    button: "বিধানশালাকে সহায়তা করুন",
    imageAlt: "বিধানশালা প্রজেক্টে কাজ করছেন একজন ডেভেলপার",
    captionTitle: "বাংলাদেশে তৈরি",
    captionText: "বাংলাদেশের মানুষের জন্য, বাংলাদেশেই বানানো।",
  },
};

// VITE_SUPPORT_URL in frontend/.env can point the button somewhere else.
const SUPPORT_URL = import.meta.env.VITE_SUPPORT_URL || 'https://rafiqul-portfolio-bice.vercel.app/';
const SUPPORT_IS_EXTERNAL = SUPPORT_URL.startsWith('http');

const PARTICLES = [
  { left: '6%', top: '18%', size: 'h-2 w-2', duration: 7, delay: 0 },
  { left: '18%', top: '72%', size: 'h-3 w-3', duration: 9, delay: 1.2 },
  { left: '34%', top: '12%', size: 'h-1.5 w-1.5', duration: 6, delay: 0.6 },
  { left: '52%', top: '84%', size: 'h-2 w-2', duration: 8, delay: 2.1 },
  { left: '68%', top: '22%', size: 'h-2.5 w-2.5', duration: 10, delay: 0.9 },
  { left: '82%', top: '64%', size: 'h-1.5 w-1.5', duration: 7.5, delay: 1.7 },
  { left: '92%', top: '34%', size: 'h-2 w-2', duration: 8.5, delay: 2.6 },
];

export default function SupportSection() {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useI18n();
  const c = text[language] || text.en;

  return (
    <section className="relative overflow-hidden border-y border-brand-900/20 bg-slate-950 py-24 md:py-32">
      {/* Two-tone background composition */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-slate-950 to-slate-900" />
      <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-[130px]" />
      <div className="absolute -bottom-40 right-0 h-[560px] w-[560px] rounded-full bg-brand-700/10 blur-[140px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      {/* Ambient floating particles */}
      {!shouldReduceMotion &&
        PARTICLES.map((particle, index) => (
          <motion.span
            key={index}
            className={`pointer-events-none absolute rounded-full bg-brand-400/50 ${particle.size}`}
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [0, -26, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Message column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2">
              <Heart className="h-4 w-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-400">{c.badge}</span>
            </div>

            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-white">{c.title1}</span>
              <br />
              <span className="gradient-text">{c.title2}</span>
            </h2>

            <div className="mt-8 space-y-5">
              {c.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`leading-relaxed ${
                    index === 0 ? 'text-lg text-slate-300' : 'text-base text-slate-400'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-brand-500/30 bg-slate-900/70 p-6 shadow-lg shadow-brand-500/10 backdrop-blur-sm">
              <Quote className="h-6 w-6 flex-shrink-0 text-brand-500" />
              <p className="text-xl font-bold uppercase tracking-wide text-brand-400 sm:text-2xl">
                {c.quote}
              </p>
            </div>

            <div className="mt-10">
              <a
                href={SUPPORT_URL}
                {...(SUPPORT_IS_EXTERNAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 px-10 py-5 text-lg font-bold uppercase tracking-wide text-slate-900 shadow-2xl shadow-brand-500/30 transition-all duration-300 hover:from-brand-400 hover:via-brand-500 hover:to-brand-600 hover:shadow-brand-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                <Coffee className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                {c.button}
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </motion.div>

          {/* Animated visual column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            {/* Glow behind the visual */}
            <div className="absolute inset-6 rounded-[2.5rem] bg-brand-500/20 blur-3xl" />

            {/* Floating decorative accents */}
            <motion.div
              className="absolute -left-6 -top-6 z-20"
              animate={shouldReduceMotion ? {} : { y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="h-10 w-10 text-brand-400" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className="absolute -right-4 bottom-10 z-20"
              animate={shouldReduceMotion ? {} : { y: [0, -18, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <Coffee className="h-12 w-12 text-brand-500" strokeWidth={1.5} />
            </motion.div>

            {/* Animated image frame */}
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 overflow-hidden rounded-[2rem] border-2 border-brand-500/40 bg-slate-900 shadow-2xl shadow-brand-500/20"
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900"
                alt={c.imageAlt}
                className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[480px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Soft animated light reflection */}
              {!shouldReduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand-200/20 to-transparent"
                  initial={{ x: '-60%' }}
                  animate={{ x: '320%' }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              )}

              {/* Caption plate */}
              <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-brand-500/30 bg-slate-950/80 p-5 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-400">
                  <Heart className="h-4 w-4" />
                  {c.captionTitle}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {c.captionText}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}