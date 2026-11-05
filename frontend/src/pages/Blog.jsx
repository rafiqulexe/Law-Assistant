import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User,
  ArrowRight,
  Search,
  Tag
} from 'lucide-react';

const featuredPost = {
  title: "The Future of Legal AI: How Machine Learning is Transforming Contract Review",
  excerpt: "Discover how artificial intelligence is revolutionizing the legal industry, from automated contract analysis to predictive legal outcomes.",
  image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
  author: "Dr. Sarah Mitchell",
  date: "December 15, 2024",
  readTime: "8 min read",
  category: "AI & Technology"
};

const blogPosts = [
  {
    title: "5 Essential Clauses Every NDA Should Include",
    excerpt: "Protect your confidential information with these must-have NDA provisions that every business should know about.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
    author: "James Rodriguez",
    date: "December 12, 2024",
    readTime: "5 min read",
    category: "Contracts"
  },
  {
    title: "GDPR Compliance Checklist for Small Businesses",
    excerpt: "A comprehensive guide to ensuring your business meets all GDPR requirements and avoids costly penalties.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400",
    author: "Emily Chen",
    date: "December 10, 2024",
    readTime: "6 min read",
    category: "Compliance"
  },
  {
    title: "When Do You Really Need a Lawyer? A Practical Guide",
    excerpt: "Understanding when to handle legal matters yourself and when it's time to seek professional legal help.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400",
    author: "Michael Thompson",
    date: "December 8, 2024",
    readTime: "7 min read",
    category: "Legal Advice"
  },
  {
    title: "Understanding Intellectual Property Rights for Startups",
    excerpt: "Everything founders need to know about protecting their innovations, from patents to trademarks.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    author: "Lisa Anderson",
    date: "December 5, 2024",
    readTime: "9 min read",
    category: "Startups"
  },
  {
    title: "Common Contract Mistakes That Could Cost Your Business",
    excerpt: "Learn about the most frequent contract errors and how to avoid them to protect your business interests.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    author: "David Park",
    date: "December 3, 2024",
    readTime: "6 min read",
    category: "Contracts"
  },
  {
    title: "The Rise of Legal Tech: Tools Every Modern Lawyer Needs",
    excerpt: "Explore the essential technology tools that are helping legal professionals work more efficiently.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    author: "Dr. Sarah Mitchell",
    date: "December 1, 2024",
    readTime: "8 min read",
    category: "AI & Technology"
  },
];

const categories = ["All", "AI & Technology", "Contracts", "Compliance", "Legal Advice", "Startups"];

export default function Blog() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">LexAI Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Legal Insights & </span>
              <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-xl text-slate-400">
              Stay informed with the latest in legal AI, contract law, and compliance best practices.
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
                placeholder="Search articles..."
                className="pl-12 py-6 bg-slate-900/80 border-amber-900/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                  index === 0
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                    : 'border-amber-900/30 text-slate-400 hover:text-amber-400 hover:border-amber-500/50'
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
            <Card className="bg-slate-900/80 border-amber-900/30 overflow-hidden">
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
                  <Badge className="w-fit bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
                    <Tag className="h-3 w-3 mr-1" />
                    Featured
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
                  <Button className="w-fit bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900">
                    Read Article
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
                <Card className="bg-slate-900/80 border-amber-900/30 overflow-hidden h-full group hover:border-amber-500/50 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
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
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}