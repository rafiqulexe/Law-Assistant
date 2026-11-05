import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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

const features = [
  {
    icon: FileSearch,
    title: "AI Contract Analyzer",
    description: "Upload any contract and receive instant analysis with risk identification, clause summaries, and plain-language explanations.",
    path: "ContractAnalyzer",
    benefits: [
      "Identify potential risks and red flags",
      "Get plain-language clause explanations",
      "Compare against industry standards",
      "Export detailed analysis reports"
    ],
    color: "amber"
  },
  {
    icon: FileText,
    title: "Document Generator",
    description: "Create professional legal documents in minutes using AI-powered templates customized to your needs.",
    path: "DocumentGenerator",
    benefits: [
      "NDA & Confidentiality Agreements",
      "Freelance & Service Contracts",
      "Rental & Lease Agreements",
      "Terms of Service & Privacy Policies"
    ],
    color: "amber"
  },
  {
    icon: ShieldCheck,
    title: "Risk & Compliance Checker",
    description: "Automated compliance verification ensuring your documents meet regulatory requirements.",
    path: "RiskChecker",
    benefits: [
      "Bangladesh law compliance checking",
      "Industry regulation verification",
      "Risk scoring and assessment",
      "Remediation recommendations"
    ],
    color: "amber"
  },
  {
    icon: MessageSquare,
    title: "Legal Assistant Chat",
    description: "Get instant answers to legal questions with our AI-powered chat assistant trained on legal knowledge.",
    path: "LegalChat",
    benefits: [
      "24/7 instant legal guidance",
      "Multi-language support",
      "Context-aware responses",
      "Citation of relevant laws"
    ],
    color: "amber"
  },
  {
    icon: Users,
    title: "Find a Lawyer Near You",
    description: "Connect with verified lawyers based on location, specialty, ratings, and availability.",
    path: "FindLawyer",
    benefits: [
      "Location-based search",
      "Filter by legal specialty",
      "Verified ratings and reviews",
      "Direct contact options"
    ],
    color: "amber"
  },
];

const highlights = [
  {
    icon: Brain,
    title: "Advanced AI Technology",
    description: "Powered by state-of-the-art language models trained on millions of legal documents."
  },
  {
    icon: Clock,
    title: "Save Time & Money",
    description: "Reduce legal costs by up to 80% and get results in minutes instead of days."
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted and protected with enterprise-grade security measures."
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get analysis, documents, and answers in seconds, not hours or days."
  },
];

export default function Features() {
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
              <span className="text-amber-400 text-sm font-medium">Powerful Features</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">AI-Powered </span>
              <span className="gradient-text">Legal Solutions</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Discover our comprehensive suite of AI tools designed to revolutionize how you handle legal matters.
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
                    <span className="text-amber-400 text-sm font-medium">Feature</span>
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
                      Try {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10">
                    <img 
                      src={
                        index === 0 ? "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800" :
                        index === 1 ? "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800" :
                        index === 2 ? "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800" :
                        index === 3 ? "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800" :
                        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
                      }
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
              <span className="text-white">Ready to Experience the </span>
              <span className="gradient-text">Future of Legal?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Start using LexAI today and transform your legal workflow.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-lg px-10 py-6 rounded-xl shadow-xl shadow-amber-500/30"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}