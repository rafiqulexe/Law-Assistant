import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { legal } from '@/api/client';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  Clock,
  CheckCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';

const contactMeta = [
  { icon: Mail, content: "support@lexai.com" },
  { icon: Phone, content: "+1 (555) 123-4567" },
  { icon: MapPin, content: "123 Legal Street" },
  { icon: Clock },
];

const text = {
  en: {
    badge: "Contact Us",
    title1: "Get in ",
    title2: "Touch",
    intro: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    info: [
      { title: "Email Us", subtitle: "We respond within 24 hours" },
      { title: "Call Us", subtitle: "Mon-Fri, 9am-6pm EST" },
      { title: "Visit Us", subtitle: "San Francisco, CA 94102" },
      { title: "Business Hours", content: "Monday - Friday", subtitle: "9:00 AM - 6:00 PM EST" },
    ],
    formTitle: "Send Us a Message",
    sentTitle: "Message Sent!",
    sentText: "Thank you for reaching out. We'll get back to you within 24 hours.",
    sendAnother: "Send Another Message",
    name: "Full Name",
    namePlaceholder: "John Doe",
    email: "Email Address",
    subject: "Subject",
    subjectPlaceholder: "Select a subject",
    subjects: { general: "General Inquiry", support: "Technical Support", sales: "Sales & Pricing", partnership: "Partnership", feedback: "Feedback" },
    message: "Message",
    messagePlaceholder: "How can we help you?",
    sending: "Sending...",
    send: "Send Message",
    city: "San Francisco, CA 94102",
    connect: "Connect With Us",
    faqTitle: "Have Questions?",
    faqText: "Check out our FAQ section for quick answers to common questions.",
    faqButton: "View FAQs",
  },
  bn: {
    badge: "যোগাযোগ",
    title1: "আমাদের সঙ্গে ",
    title2: "যোগাযোগ করুন",
    intro: "কোনো প্রশ্ন আছে? আমরা শুনতে চাই। একটি বার্তা পাঠান, যত দ্রুত সম্ভব উত্তর দেব।",
    info: [
      { title: "ইমেইল করুন", subtitle: "২৪ ঘণ্টার মধ্যে উত্তর দিই" },
      { title: "ফোন করুন", subtitle: "সোম-শুক্র, সকাল ৯টা - সন্ধ্যা ৬টা (EST)" },
      { title: "আমাদের ঠিকানা", subtitle: "San Francisco, CA 94102" },
      { title: "অফিস সময়", content: "সোমবার - শুক্রবার", subtitle: "সকাল ৯:০০ - সন্ধ্যা ৬:০০ (EST)" },
    ],
    formTitle: "আমাদের বার্তা পাঠান",
    sentTitle: "বার্তা পাঠানো হয়েছে!",
    sentText: "যোগাযোগের জন্য ধন্যবাদ। ২৪ ঘণ্টার মধ্যে আমরা আপনার সঙ্গে যোগাযোগ করব।",
    sendAnother: "আরেকটি বার্তা পাঠান",
    name: "পুরো নাম",
    namePlaceholder: "যেমন: রহিম উদ্দিন",
    email: "ইমেইল ঠিকানা",
    subject: "বিষয়",
    subjectPlaceholder: "একটি বিষয় বেছে নিন",
    subjects: { general: "সাধারণ জিজ্ঞাসা", support: "কারিগরি সহায়তা", sales: "বিক্রয় ও মূল্য", partnership: "অংশীদারিত্ব", feedback: "মতামত" },
    message: "বার্তা",
    messagePlaceholder: "কীভাবে সাহায্য করতে পারি?",
    sending: "পাঠানো হচ্ছে...",
    send: "বার্তা পাঠান",
    city: "San Francisco, CA 94102",
    connect: "আমাদের সঙ্গে যুক্ত থাকুন",
    faqTitle: "প্রশ্ন আছে?",
    faqText: "সাধারণ প্রশ্নের দ্রুত উত্তর পেতে আমাদের সচরাচর জিজ্ঞাসা অংশ দেখুন।",
    faqButton: "সচরাচর জিজ্ঞাসা দেখুন",
  },
};

export default function Contact() {
  const { language, tError } = useI18n();
  const c = text[language] || text.en;
  const contactInfo = contactMeta.map((meta, index) => ({ ...meta, ...c.info[index] }));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await legal.contact(formData);
      setIsSubmitted(true);
    } catch (error) {
      toast.error(tError(error.message));
    } finally {
      setIsSending(false);
    }
  };

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
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{c.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{c.title1}</span>
              <span className="gradient-text">{c.title2}</span>
            </h1>
            <p className="text-xl text-slate-400">
              {c.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-amber-900/30 text-center p-6">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-4">
                      <info.icon className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
                    <p className="text-amber-400">{info.content}</p>
                    <p className="text-slate-500 text-sm mt-1">{info.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/80 border-amber-900/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{c.formTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{c.sentTitle}</h3>
                      <p className="text-slate-400">
                        {c.sentText}
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-6 border-amber-900/30 text-slate-300 hover:text-amber-400"
                      >
                        {c.sendAnother}
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">{c.name}</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder={c.namePlaceholder}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">{c.email}</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">{c.subject}</Label>
                        <Select 
                          value={formData.subject}
                          onValueChange={(value) => setFormData({...formData, subject: value})}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder={c.subjectPlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="general">{c.subjects.general}</SelectItem>
                            <SelectItem value="support">{c.subjects.support}</SelectItem>
                            <SelectItem value="sales">{c.subjects.sales}</SelectItem>
                            <SelectItem value="partnership">{c.subjects.partnership}</SelectItem>
                            <SelectItem value="feedback">{c.subjects.feedback}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">{c.message}</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder={c.messagePlaceholder}
                          className="min-h-[150px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold py-6"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {isSending ? c.sending : c.send}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <Card className="bg-slate-900/80 border-amber-900/30 overflow-hidden">
                <div className="h-64 bg-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-amber-500/50 mx-auto mb-3" />
                    <p className="text-slate-400">123 Legal Street</p>
                    <p className="text-slate-500 text-sm">{c.city}</p>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="bg-slate-900/80 border-amber-900/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{c.connect}</h3>
                  <div className="flex gap-4">
                    {[
                      { icon: Linkedin, href: "#", label: "LinkedIn" },
                      { icon: Twitter, href: "#", label: "Twitter" },
                      { icon: Facebook, href: "#", label: "Facebook" },
                      { icon: Instagram, href: "#", label: "Instagram" },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Teaser */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-slate-900 border-amber-500/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{c.faqTitle}</h3>
                  <p className="text-slate-400 mb-4">
                    {c.faqText}
                  </p>
                  <Button 
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    {c.faqButton}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}