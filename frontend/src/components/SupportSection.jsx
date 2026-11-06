import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Coffee, Heart, Sparkles, ArrowUpRight, Quote } from 'lucide-react';

const MESSAGE_PARAGRAPHS = [
  "I'm Rafiqul Islam, a developer from Bangladesh. I built LexAI because finding a clear answer in our laws should not need a lawyer's office or a day of searching through old PDFs.",
  "LexAI is free to use. It reads the official Laws of Bangladesh, keeps itself up to date when laws change, and explains them in Bangla and English.",
  "Servers, AI models and the time to keep improving it all cost money. If LexAI helped you, any support keeps it free for the next person who needs it.",
];

// Set VITE_SUPPORT_URL in frontend/.env to your payment page; without it the button opens Contact.
const SUPPORT_URL = import.meta.env.VITE_SUPPORT_URL || '/Contact';
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

  return (
    <section className="relative overflow-hidden border-y border-amber-900/20 bg-slate-950 py-24 md:py-32">
      {/* Two-tone background composition */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-900" />
      <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-amber-500/10 blur-[130px]" />
      <div className="absolute -bottom-40 right-0 h-[560px] w-[560px] rounded-full bg-amber-700/10 blur-[140px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      {/* Ambient floating particles */}
      {!shouldReduceMotion &&
        PARTICLES.map((particle, index) => (
          <motion.span
            key={index}
            className={`pointer-events-none absolute rounded-full bg-amber-400/50 ${particle.size}`}
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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <Heart className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Support LexAI</span>
            </div>

            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-white">Help keep legal answers</span>
              <br />
              <span className="gradient-text">free for everyone.</span>
            </h2>

            <div className="mt-8 space-y-5">
              {MESSAGE_PARAGRAPHS.map((paragraph, index) => (
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

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-amber-500/30 bg-slate-900/70 p-6 shadow-lg shadow-amber-500/10 backdrop-blur-sm">
              <Quote className="h-6 w-6 flex-shrink-0 text-amber-500" />
              <p className="text-xl font-bold uppercase tracking-wide text-amber-400 sm:text-2xl">
                Every taka keeps the law within reach.
              </p>
            </div>

            <div className="mt-10">
              <a
                href={SUPPORT_URL}
                {...(SUPPORT_IS_EXTERNAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-10 py-5 text-lg font-bold uppercase tracking-wide text-slate-900 shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:shadow-amber-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                <Coffee className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Support LexAI
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
            <div className="absolute inset-6 rounded-[2.5rem] bg-amber-500/20 blur-3xl" />

            {/* Floating decorative accents */}
            <motion.div
              className="absolute -left-6 -top-6 z-20"
              animate={shouldReduceMotion ? {} : { y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="h-10 w-10 text-amber-400" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className="absolute -right-4 bottom-10 z-20"
              animate={shouldReduceMotion ? {} : { y: [0, -18, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <Coffee className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
            </motion.div>

            {/* Animated image frame */}
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 overflow-hidden rounded-[2rem] border-2 border-amber-500/40 bg-slate-900 shadow-2xl shadow-amber-500/20"
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900"
                alt="Developer working on the LexAI project"
                className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[480px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Soft animated light reflection */}
              {!shouldReduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
                  initial={{ x: '-60%' }}
                  animate={{ x: '320%' }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              )}

              {/* Caption plate */}
              <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-amber-500/30 bg-slate-950/80 p-5 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
                  <Heart className="h-4 w-4" />
                  Built in Bangladesh
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Made in Bangladesh, for the people of Bangladesh.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}