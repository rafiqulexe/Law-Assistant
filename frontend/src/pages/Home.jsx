import React from 'react';
import SupportSection from '@/components/SupportSection';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileSearch, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Users,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Lock,
  Scale,
  Gavel,
  BookOpen,
  Shield
} from 'lucide-react';

const heroImages = [
  {
    src: "/images/justice.jpg",
    alt: "Lady Justice statue",
    className: "col-span-2 row-span-2"
  },
  {
    src: "/images/office.jpg",
    alt: "Lawyer office",
    className: "col-span-1 row-span-1"
  },
  {
    src: "/images/law-book.jpg",
    alt: "Law book",
    className: "col-span-1 row-span-1"
  },
];

const features = [
  {
    icon: FileSearch,
    title: "AI Contract Analyzer",
    description: "Upload any contract and get instant summaries, risk highlights, and plain-language explanations.",
    path: "ContractAnalyzer"
  },
  {
    icon: FileText,
    title: "Document Generator",
    description: "Create NDAs, contracts, and legal documents in minutes with AI-powered templates.",
    path: "DocumentGenerator"
  },
  {
    icon: ShieldCheck,
    title: "Risk & Compliance",
    description: "Automated compliance checking and risk assessment for your business documents.",
    path: "RiskChecker"
  },
  {
    icon: MessageSquare,
    title: "Legal Assistant Chat",
    description: "Get instant answers to your legal questions from our AI-powered assistant.",
    path: "LegalChat"
  },
  {
    icon: Users,
    title: "Find a Lawyer",
    description: "Connect with verified lawyers near you, filtered by specialty and ratings.",
    path: "FindLawyer"
  },
];

const stats = [
  { value: "50K+", label: "Documents Analyzed" },
  { value: "10K+", label: "Happy Users" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "5K+", label: "Lawyers Listed" },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Startup Founder",
    content: "LexAI saved us thousands in legal fees. The contract analyzer caught issues our lawyers missed.",
    rating: 5
  },
  {
    name: "James Rodriguez",
    role: "Real Estate Agent",
    content: "Finding the right lawyer used to take weeks. Now I can connect with specialists in minutes.",
    rating: 5
  },
  {
    name: "Emily Chen",
    role: "Small Business Owner",
    content: "The document generator is a game-changer. Professional contracts without the hefty legal bills.",
    rating: 5
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-amber-700/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">AI-Powered Legal Technology</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Your AI</span>
                <br />
                <span className="gradient-text">Legal Partner</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Analyze contracts, generate documents, ensure compliance, and find the perfect lawyer — all powered by cutting-edge AI technology.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to={createPageUrl('Features')}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-slate-900 font-bold text-lg px-10 py-7 rounded-xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 group"
                  >
                    Explore LexAI
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Globe className="h-4 w-4 text-amber-500" />
                  <span>Global Coverage</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right - Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Floating icons around images */}
              <motion.div
                className="absolute -top-8 -left-8 z-30"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -30, -60],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Scale className="h-12 w-12 text-amber-400" strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute top-1/4 -right-12 z-30"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -40, -80],
                  rotate: [0, 15, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Gavel className="h-14 w-14 text-amber-500" strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 -left-10 z-30"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -35, -70],
                  rotate: [0, -10, 0]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <FileText className="h-10 w-10 text-amber-400" strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute -bottom-8 right-1/4 z-30"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -30, -60],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Shield className="h-11 w-11 text-amber-500" strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute top-12 left-1/3 z-30"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -45, -90],
                  x: [0, 10, 0]
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <BookOpen className="h-9 w-9 text-amber-400" strokeWidth={1.5} />
              </motion.div>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {/* Main large image */}
                <motion.div 
                  className="col-span-2 relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 z-20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 border-2 border-amber-500/30 rounded-2xl z-20" />
                  <img 
                    src={heroImages[0].src}
                    alt={heroImages[0].alt}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  
                  {/* Floating badge over image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 shadow-xl z-30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Trusted by 10K+</p>
                        <p className="text-slate-400 text-sm">Legal Professionals</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Two smaller images */}
                <motion.div 
                  className="relative rounded-2xl overflow-hidden shadow-xl shadow-amber-500/10 z-20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent z-10" />
                  <div className="absolute inset-0 border-2 border-amber-500/20 rounded-2xl z-20" />
                  <img 
                    src={heroImages[1].src}
                    alt={heroImages[1].alt}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </motion.div>
                
                <motion.div 
                  className="relative rounded-2xl overflow-hidden shadow-xl shadow-amber-500/10 z-20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent z-10" />
                  <div className="absolute inset-0 border-2 border-amber-500/20 rounded-2xl z-20" />
                  <img 
                    src={heroImages[2].src}
                    alt={heroImages[2].alt}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support */}
      <SupportSection />

      {/* Stats Section */}
      <section className="py-20 border-y border-amber-900/20 bg-slate-900/30">
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

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Powerful </span>
              <span className="gradient-text">AI Legal Tools</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to handle legal matters with confidence, powered by advanced artificial intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={createPageUrl(feature.path)}>
                  <div className="group h-full bg-gradient-to-br from-slate-900 to-slate-900/50 border border-amber-900/20 hover:border-amber-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 card-glow">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-7 w-7 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-amber-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Trusted by </span>
              <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-slate-400 text-lg">See what our users are saying about LexAI</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-amber-900/20 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-amber-700/10 border border-amber-500/30 rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-white">Ready to Transform Your</span>
                <br />
                <span className="gradient-text">Legal Workflow?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of professionals using LexAI to save time, reduce costs, and make better legal decisions.
              </p>
              <Link to={createPageUrl('Features')}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-lg px-10 py-6 rounded-xl shadow-xl shadow-amber-500/30"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}