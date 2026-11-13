import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User,
  ArrowRight,
  Search,
  Tag
} from 'lucide-react';

// Sample posts until the blog has real content. Text is per language, the rest is shared.
const postMeta = [
  { image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800", date: "2024-12-15", minutes: 8, category: "ai" },
  { image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", date: "2024-12-12", minutes: 5, category: "contracts" },
  { image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400", date: "2024-12-10", minutes: 6, category: "compliance" },
  { image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400", date: "2024-12-08", minutes: 7, category: "advice" },
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", date: "2024-12-05", minutes: 9, category: "startups" },
  { image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400", date: "2024-12-03", minutes: 6, category: "contracts" },
  { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", date: "2024-12-01", minutes: 8, category: "ai" },
];

const categoryIds = ["all", "ai", "contracts", "compliance", "advice", "startups"];

const text = {
  en: {
    badge: "Bidhanshala Blog",
    title1: "Legal Insights & ",
    title2: "Resources",
    intro: "Stay informed with the latest in legal AI, contract law, and compliance best practices.",
    search: "Search articles...",
    featured: "Featured",
    read: "Read Article",
    more: "Load More Articles",
    readTime: "{n} min read",
    categories: { all: "All", ai: "AI & Technology", contracts: "Contracts", compliance: "Compliance", advice: "Legal Advice", startups: "Startups" },
    posts: [
      { title: "The Future of Legal AI: How Machine Learning is Transforming Contract Review", excerpt: "Discover how artificial intelligence is revolutionizing the legal industry, from automated contract analysis to predictive legal outcomes.", author: "Dr. Sarah Mitchell" },
      { title: "5 Essential Clauses Every NDA Should Include", excerpt: "Protect your confidential information with these must-have NDA provisions that every business should know about.", author: "James Rodriguez" },
      { title: "GDPR Compliance Checklist for Small Businesses", excerpt: "A comprehensive guide to ensuring your business meets all GDPR requirements and avoids costly penalties.", author: "Emily Chen" },
      { title: "When Do You Really Need a Lawyer? A Practical Guide", excerpt: "Understanding when to handle legal matters yourself and when it's time to seek professional legal help.", author: "Michael Thompson" },
      { title: "Understanding Intellectual Property Rights for Startups", excerpt: "Everything founders need to know about protecting their innovations, from patents to trademarks.", author: "Lisa Anderson" },
      { title: "Common Contract Mistakes That Could Cost Your Business", excerpt: "Learn about the most frequent contract errors and how to avoid them to protect your business interests.", author: "David Park" },
      { title: "The Rise of Legal Tech: Tools Every Modern Lawyer Needs", excerpt: "Explore the essential technology tools that are helping legal professionals work more efficiently.", author: "Dr. Sarah Mitchell" },
    ],
  },
  bn: {
    badge: "বিধানশালা ব্লগ",
    title1: "আইনি ভাবনা ও ",
    title2: "তথ্যভান্ডার",
    intro: "আইনি এআই, চুক্তি আইন আর আইন মেনে চলার সেরা চর্চা নিয়ে সর্বশেষ খবর জানুন।",
    search: "লেখা খুঁজুন...",
    featured: "বিশেষ লেখা",
    read: "লেখাটি পড়ুন",
    more: "আরও লেখা দেখুন",
    readTime: "{n} মিনিটের পড়া",
    categories: { all: "সব", ai: "এআই ও প্রযুক্তি", contracts: "চুক্তি", compliance: "আইন মেনে চলা", advice: "আইনি পরামর্শ", startups: "স্টার্টআপ" },
    posts: [
      { title: "আইনি এআই-এর ভবিষ্যৎ: মেশিন লার্নিং যেভাবে চুক্তি পর্যালোচনা বদলে দিচ্ছে", excerpt: "স্বয়ংক্রিয় চুক্তি বিশ্লেষণ থেকে মামলার সম্ভাব্য ফলাফল অনুমান — কৃত্রিম বুদ্ধিমত্তা কীভাবে আইন অঙ্গনকে বদলে দিচ্ছে, জেনে নিন।", author: "ড. সারাহ মিচেল" },
      { title: "প্রতিটি NDA-তে যে ৫টি ধারা থাকা জরুরি", excerpt: "প্রতিটি ব্যবসার জানা উচিত এমন জরুরি NDA ধারা দিয়ে আপনার গোপন তথ্য সুরক্ষিত রাখুন।", author: "জেমস রদ্রিগেজ" },
      { title: "ক্ষুদ্র ব্যবসার জন্য তথ্য সুরক্ষা আইন মেনে চলার চেকলিস্ট", excerpt: "আপনার ব্যবসা তথ্য সুরক্ষার সব নিয়ম মেনে চলছে কি না এবং কীভাবে বড় জরিমানা এড়াবেন, তার পূর্ণাঙ্গ নির্দেশিকা।", author: "এমিলি চেন" },
      { title: "কখন সত্যিই আইনজীবী দরকার? একটি ব্যবহারিক নির্দেশিকা", excerpt: "কোন আইনি বিষয় নিজেই সামলানো যায় আর কখন পেশাদার আইনজীবীর সাহায্য নেওয়া উচিত, তা বুঝে নিন।", author: "মাইকেল থম্পসন" },
      { title: "স্টার্টআপের জন্য মেধাস্বত্ব অধিকার", excerpt: "পেটেন্ট থেকে ট্রেডমার্ক — নিজেদের উদ্ভাবন সুরক্ষায় প্রতিষ্ঠাতাদের যা যা জানা দরকার।", author: "লিসা অ্যান্ডারসন" },
      { title: "যে সাধারণ চুক্তির ভুলে ব্যবসার ক্ষতি হতে পারে", excerpt: "চুক্তিতে সবচেয়ে বেশি যে ভুলগুলো হয় এবং ব্যবসার স্বার্থ রক্ষায় কীভাবে সেগুলো এড়াবেন, জেনে নিন।", author: "ডেভিড পার্ক" },
      { title: "আইনি প্রযুক্তির উত্থান: আধুনিক আইনজীবীর প্রয়োজনীয় টুল", excerpt: "যেসব প্রযুক্তি আইন পেশাজীবীদের আরও দক্ষভাবে কাজ করতে সাহায্য করছে, সেগুলো ঘুরে দেখুন।", author: "ড. সারাহ মিচেল" },
    ],
  },
};

export default function Blog() {
  const { language, formatNumber } = useI18n();
  const c = text[language] || text.en;
  const dateFormat = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'long' });
  const posts = postMeta.map((meta, index) => ({
    ...meta,
    ...c.posts[index],
    date: dateFormat.format(new Date(meta.date)),
    readTime: c.readTime.replace('{n}', formatNumber(meta.minutes)),
    category: c.categories[meta.category],
  }));
  const [featuredPost, ...blogPosts] = posts;
  const categories = categoryIds.map((id) => c.categories[id]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 mb-6">
              <BookOpen className="h-4 w-4 text-brand-400" />
              <span className="text-brand-400 text-sm font-medium">{c.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{c.title1}</span>
              <span className="gradient-text">{c.title2}</span>
            </h1>
            <p className="text-xl text-slate-400">
              {c.intro}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder={c.search}
                className="pl-12 py-6 bg-slate-900/80 border-brand-900/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-brand-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                  index === 0
                    ? 'bg-brand-500/20 text-brand-400 border-brand-500/50'
                    : 'border-brand-900/30 text-slate-400 hover:text-brand-400 hover:border-brand-500/50'
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/80 border-brand-900/30 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent md:from-transparent md:to-slate-900" />
                </div>
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit bg-brand-500/20 text-brand-400 border-brand-500/30 mb-4">
                    <Tag className="h-3 w-3 mr-1" />
                    {c.featured}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-400 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button className="w-fit bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900">
                    {c.read}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-brand-900/30 overflow-hidden h-full group hover:border-brand-500/50 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-brand-500/20 text-brand-400 border-brand-500/30">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold">
              {c.more}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}