import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Pushing the boundaries of legal technology with cutting-edge AI solutions."
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Making legal assistance available to everyone, regardless of background."
  },
  {
    icon: Scale,
    title: "Integrity",
    description: "Maintaining the highest standards of accuracy and ethical AI practices."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive ecosystem for legal professionals and individuals alike."
  },
];

const team = [
  {
    name: "Alexandra Chen",
    role: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    bio: "Former BigLaw partner with 15 years of experience. Harvard Law graduate."
  },
  {
    name: "Marcus Johnson",
    role: "CTO & Co-Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "AI researcher from MIT. Previously led ML teams at Google and OpenAI."
  },
  {
    name: "Sarah Williams",
    role: "Chief Legal Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    bio: "20+ years in legal tech. Former General Counsel at Fortune 500 companies."
  },
  {
    name: "David Park",
    role: "VP of Product",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Product leader with experience at Slack and Notion. Stanford MBA."
  },
];

const stats = [
  { value: "50K+", label: "Documents Processed" },
  { value: "10K+", label: "Happy Users" },
  { value: "5K+", label: "Lawyers Listed" },
  { value: "99.9%", label: "Uptime" },
];

export default function About() {
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
              <Scale className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">About LexAI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Democratizing </span>
              <span className="gradient-text">Legal Access</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              We're on a mission to make legal assistance accessible, affordable, and intelligent through the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 border-y border-amber-900/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                To empower individuals and businesses with AI-driven legal tools that simplify complex legal processes, reduce costs, and provide instant access to legal guidance — making justice more accessible to all.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                A world where everyone has equal access to legal understanding and protection, where AI augments human legal expertise to create faster, fairer, and more efficient legal outcomes for society.
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
              <span className="text-white">Our Core </span>
              <span className="gradient-text">Values</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we do at LexAI.
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
                <Card className="bg-slate-900/80 border-amber-900/30 h-full text-center p-6">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-4">
                      <value.icon className="h-7 w-7 text-amber-500" />
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
              <span className="text-white">Meet Our </span>
              <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A team of legal experts and technologists united by a common vision.
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
                <Card className="bg-slate-900/80 border-amber-900/30 overflow-hidden group">
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
                    <p className="text-amber-400 text-sm mb-3">{member.role}</p>
                    <p className="text-slate-400 text-sm mb-4">{member.bio}</p>
                    <div className="flex gap-3">
                      <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
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
              <span className="text-white">Ready to Get Started with </span>
              <span className="gradient-text">LexAI?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join thousands of users who trust LexAI for their legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Features')}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                >
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-amber-900/30 text-slate-300 hover:text-amber-400"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}