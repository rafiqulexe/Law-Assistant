import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useI18n } from '@/lib/i18n';
import { 
  Scale, 
  Target, 
  Eye,
  Heart,
  Users,
  Lightbulb,
  ArrowRight,
  Linkedin,
  Twitter
} from 'lucide-react';

const valueIcons = [Lightbulb, Heart, Scale, Users];

const teamImages = [
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
];

const text = {
  en: {
    badge: "About Bidhanshala",
    title1: "Democratizing ",
    title2: "Legal Access",
    intro: "We're on a mission to make legal assistance accessible, affordable, and intelligent through the power of artificial intelligence.",
    missionTitle: "Our Mission",
    mission: "To empower individuals and businesses with AI-driven legal tools that simplify complex legal processes, reduce costs, and provide instant access to legal guidance — making justice more accessible to all.",
    visionTitle: "Our Vision",
    vision: "A world where everyone has equal access to legal understanding and protection, where AI augments human legal expertise to create faster, fairer, and more efficient legal outcomes for society.",
    stats: [
      { value: "50K+", label: "Documents Processed" },
      { value: "10K+", label: "Happy Users" },
      { value: "5K+", label: "Lawyers Listed" },
      { value: "99.9%", label: "Uptime" },
    ],
    valuesTitle1: "Our Core ",
    valuesTitle2: "Values",
    valuesIntro: "The principles that guide everything we do at Bidhanshala.",
    values: [
      { title: "Innovation", description: "Pushing the boundaries of legal technology with cutting-edge AI solutions." },
      { title: "Accessibility", description: "Making legal assistance available to everyone, regardless of background." },
      { title: "Integrity", description: "Maintaining the highest standards of accuracy and ethical AI practices." },
      { title: "Community", description: "Building a supportive ecosystem for legal professionals and individuals alike." },
    ],
    teamTitle1: "Meet Our ",
    teamTitle2: "Leadership",
    teamIntro: "A team of legal experts and technologists united by a common vision.",
    team: [
      { name: "Alexandra Chen", role: "CEO & Co-Founder", bio: "Former BigLaw partner with 15 years of experience. Harvard Law graduate." },
      { name: "Marcus Johnson", role: "CTO & Co-Founder", bio: "AI researcher from MIT. Previously led ML teams at Google and OpenAI." },
      { name: "Sarah Williams", role: "Chief Legal Officer", bio: "20+ years in legal tech. Former General Counsel at Fortune 500 companies." },
      { name: "David Park", role: "VP of Product", bio: "Product leader with experience at Slack and Notion. Stanford MBA." },
    ],
    ctaTitle1: "Ready to Get Started with ",
    ctaTitle2: "Bidhanshala?",
    ctaText: "Join thousands of users who trust Bidhanshala for their legal needs.",
    explore: "Explore Features",
    contact: "Contact Us",
  },
  bn: {
    badge: "বিধানশালা সম্পর্কে",
    title1: "আইনি সেবা ",
    title2: "সবার নাগালে",
    intro: "কৃত্রিম বুদ্ধিমত্তার সাহায্যে আইনি সহায়তাকে সহজলভ্য, সাশ্রয়ী আর বুদ্ধিদীপ্ত করাই আমাদের লক্ষ্য।",
    missionTitle: "আমাদের লক্ষ্য",
    mission: "এআই-চালিত আইনি টুল দিয়ে ব্যক্তি ও প্রতিষ্ঠানকে শক্তিশালী করা — জটিল আইনি প্রক্রিয়া সহজ করা, খরচ কমানো আর তাৎক্ষণিক আইনি দিকনির্দেশনা দেওয়া, যাতে ন্যায়বিচার সবার কাছে পৌঁছায়।",
    visionTitle: "আমাদের স্বপ্ন",
    vision: "এমন একটি পৃথিবী, যেখানে সবাই সমানভাবে আইন বুঝতে ও আইনের সুরক্ষা পেতে পারে, আর এআই মানুষের আইনি দক্ষতার পাশে থেকে দ্রুত, ন্যায্য ও কার্যকর ফলাফল আনে।",
    stats: [
      { value: "৫০ হাজার+", label: "প্রক্রিয়া করা দলিল" },
      { value: "১০ হাজার+", label: "সন্তুষ্ট ব্যবহারকারী" },
      { value: "৫ হাজার+", label: "তালিকাভুক্ত আইনজীবী" },
      { value: "৯৯.৯%", label: "সচল থাকার হার" },
    ],
    valuesTitle1: "আমাদের মূল ",
    valuesTitle2: "মূল্যবোধ",
    valuesIntro: "যে নীতিগুলো বিধানশালার প্রতিটি কাজের দিশা দেয়।",
    values: [
      { title: "উদ্ভাবন", description: "আধুনিক এআই সমাধান দিয়ে আইনি প্রযুক্তির সীমানা এগিয়ে নেওয়া।" },
      { title: "সহজলভ্যতা", description: "পটভূমি যা-ই হোক, আইনি সহায়তা সবার হাতের নাগালে আনা।" },
      { title: "সততা", description: "নির্ভুলতা আর নৈতিক এআই চর্চার সর্বোচ্চ মান বজায় রাখা।" },
      { title: "সম্প্রদায়", description: "আইন পেশাজীবী ও সাধারণ মানুষ — দুই পক্ষের জন্যই সহায়ক পরিবেশ গড়ে তোলা।" },
    ],
    teamTitle1: "আমাদের ",
    teamTitle2: "নেতৃত্ব",
    teamIntro: "একই স্বপ্নে একসঙ্গে কাজ করা আইন বিশেষজ্ঞ আর প্রযুক্তিবিদদের একটি দল।",
    team: [
      { name: "আলেকজান্দ্রা চেন", role: "সিইও ও সহ-প্রতিষ্ঠাতা", bio: "বড় আইন প্রতিষ্ঠানের সাবেক পার্টনার, ১৫ বছরের অভিজ্ঞতা। হার্ভার্ড ল স্কুলের স্নাতক।" },
      { name: "মার্কাস জনসন", role: "সিটিও ও সহ-প্রতিষ্ঠাতা", bio: "MIT-এর এআই গবেষক। আগে Google ও OpenAI-তে মেশিন লার্নিং দলের নেতৃত্ব দিয়েছেন।" },
      { name: "সারাহ উইলিয়ামস", role: "প্রধান আইন কর্মকর্তা", bio: "আইনি প্রযুক্তিতে ২০ বছরেরও বেশি অভিজ্ঞতা। Fortune 500 প্রতিষ্ঠানের সাবেক জেনারেল কাউন্সেল।" },
      { name: "ডেভিড পার্ক", role: "প্রোডাক্ট বিভাগের ভিপি", bio: "Slack ও Notion-এ কাজের অভিজ্ঞতাসম্পন্ন প্রোডাক্ট লিডার। স্ট্যানফোর্ড থেকে MBA।" },
    ],
    ctaTitle1: "বিধানশালা দিয়ে শুরু করতে ",
    ctaTitle2: "প্রস্তুত?",
    ctaText: "আইনি প্রয়োজনে বিধানশালার ওপর আস্থা রাখা হাজারো ব্যবহারকারীর সঙ্গে যোগ দিন।",
    explore: "ফিচারগুলো দেখুন",
    contact: "যোগাযোগ করুন",
  },
};

export default function About() {
  const { language } = useI18n();
  const c = text[language] || text.en;
  const values = c.values.map((item, index) => ({ ...item, icon: valueIcons[index] }));
  const team = c.team.map((member, index) => ({ ...member, image: teamImages[index] }));
  const stats = c.stats;

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 mb-6">
              <Scale className="h-4 w-4 text-brand-400" />
              <span className="text-brand-400 text-sm font-medium">{c.badge}</span>
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

      {/* Mission & Vision */}
      <section className="py-16 border-y border-brand-900/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-brand-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{c.missionTitle}</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {c.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-brand-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{c.visionTitle}</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {c.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">{c.valuesTitle1}</span>
              <span className="gradient-text">{c.valuesTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {c.valuesIntro}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-brand-900/30 h-full text-center p-6">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center mb-4">
                      <value.icon className="h-7 w-7 text-brand-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-slate-400 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">{c.teamTitle1}</span>
              <span className="gradient-text">{c.teamTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {c.teamIntro}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-brand-900/30 overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-brand-400 text-sm mb-3">{member.role}</p>
                    <p className="text-slate-400 text-sm mb-4">{member.bio}</p>
                    <div className="flex gap-3">
                      <a href="#" className="text-slate-400 hover:text-brand-400 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-slate-400 hover:text-brand-400 transition-colors">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900/30">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Features')}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold"
                >
                  {c.explore}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-brand-900/30 text-slate-300 hover:text-brand-400"
                >
                  {c.contact}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}