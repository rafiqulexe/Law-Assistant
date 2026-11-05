import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { legal } from '@/api/client';
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

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    content: "support@lexai.com",
    subtitle: "We respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "+1 (555) 123-4567",
    subtitle: "Mon-Fri, 9am-6pm EST"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    content: "123 Legal Street",
    subtitle: "San Francisco, CA 94102"
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Monday - Friday",
    subtitle: "9:00 AM - 6:00 PM EST"
  },
];

export default function Contact() {
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
      toast.error(error.message);
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
              <span className="text-amber-400 text-sm font-medium">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Get in </span>
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-slate-400">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                  <CardTitle className="text-2xl text-white">Send Us a Message</CardTitle>
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
                      <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                      <p className="text-slate-400">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-6 border-amber-900/30 text-slate-300 hover:text-amber-400"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Full Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Email Address</Label>
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
                        <Label className="text-slate-300">Subject</Label>
                        <Select 
                          value={formData.subject}
                          onValueChange={(value) => setFormData({...formData, subject: value})}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales & Pricing</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Message</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="How can we help you?"
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
                        {isSending ? 'Sending...' : 'Send Message'}
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
                    <p className="text-slate-500 text-sm">San Francisco, CA 94102</p>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="bg-slate-900/80 border-amber-900/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
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
                  <h3 className="text-lg font-semibold text-white mb-2">Have Questions?</h3>
                  <p className="text-slate-400 mb-4">
                    Check out our FAQ section for quick answers to common questions.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    View FAQs
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