import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Contract Analyzer', path: 'ContractAnalyzer' },
    { name: 'Document Generator', path: 'DocumentGenerator' },
    { name: 'Risk Checker', path: 'RiskChecker' },
    { name: 'Legal Chat', path: 'LegalChat' },
    { name: 'Find a Lawyer', path: 'FindLawyer' },
  ],
  company: [
    { name: 'About Us', path: 'About' },
    { name: 'Blog', path: 'Blog' },
    { name: 'Pricing', path: 'Pricing' },
    { name: 'Contact', path: 'Contact' },
  ],
  legal: [
    { name: 'Privacy Policy', path: 'Home' },
    { name: 'Terms of Service', path: 'Home' },
    { name: 'Cookie Policy', path: 'Home' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-amber-900/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-700/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-6">
              <Scale className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                LexAI
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              AI-powered legal assistant transforming how you handle contracts, compliance, and legal documents. Find the perfect lawyer for your needs.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="h-4 w-4 text-amber-500" />
                contact@lexai.com
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="h-4 w-4 text-amber-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5" />
                <span>123 Legal Street<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 LexAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="text-slate-500 hover:text-amber-400 transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}