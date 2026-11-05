import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight
} from 'lucide-react';

const plans = [
  {
    name: "Starter",
    icon: Zap,
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "Perfect for individuals getting started with legal AI",
    features: [
      { text: "10 Contract Analyses/month", included: true },
      { text: "5 Document Generations/month", included: true },
      { text: "Basic Compliance Checks", included: true },
      { text: "50 AI Chat Messages/month", included: true },
      { text: "Lawyer Directory Access", included: true },
      { text: "Email Support", included: true },
      { text: "Priority Processing", included: false },
      { text: "Custom Templates", included: false },
      { text: "API Access", included: false },
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    icon: Crown,
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Ideal for professionals and small businesses",
    features: [
      { text: "50 Contract Analyses/month", included: true },
      { text: "30 Document Generations/month", included: true },
      { text: "Advanced Compliance Checks", included: true },
      { text: "200 AI Chat Messages/month", included: true },
      { text: "Lawyer Directory Access", included: true },
      { text: "Priority Email & Chat Support", included: true },
      { text: "Priority Processing", included: true },
      { text: "Custom Templates", included: true },
      { text: "API Access", included: false },
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    icon: Building2,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    description: "For organizations with advanced legal needs",
    features: [
      { text: "Unlimited Contract Analyses", included: true },
      { text: "Unlimited Document Generations", included: true },
      { text: "Full Compliance Suite", included: true },
      { text: "Unlimited AI Chat", included: true },
      { text: "Lawyer Directory Access", included: true },
      { text: "24/7 Dedicated Support", included: true },
      { text: "Priority Processing", included: true },
      { text: "Custom Templates", included: true },
      { text: "Full API Access", included: true },
    ],
    cta: "Contact Sales",
    popular: false
  },
];

const faqs = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise accounts."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start."
  },
  {
    question: "What happens if I exceed my limits?",
    answer: "We'll notify you before you reach your limits. You can upgrade your plan or purchase additional credits as needed."
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

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
              <span className="text-amber-400 text-sm font-medium">Simple Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Choose Your </span>
              <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Start with a free trial. No credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-amber-500"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                Yearly 
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                  Save 20%
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
                        Most Popular
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
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-slate-400">/{isYearly ? 'year' : 'month'}</span>
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
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Have questions? We've got answers.
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