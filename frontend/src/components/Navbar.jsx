import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { LanguageToggle, useI18n } from '@/lib/i18n';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Scale, 
  Menu, 
  X, 
  ChevronDown,
  FileSearch,
  FileText,
  ShieldCheck,
  MessageSquare,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { key: 'nav.home', path: 'Home' },
  { key: 'nav.features', path: 'Features' },
  { key: 'nav.lawUpdates', path: 'LawUpdates' },
  { key: 'nav.findLawyer', path: 'FindLawyer' },
  { key: 'nav.pricing', path: 'Pricing' },
  { key: 'nav.blog', path: 'Blog' },
  { key: 'nav.about', path: 'About' },
  { key: 'nav.contact', path: 'Contact' },
];

const toolsMenu = [
  { key: 'tool.contract', path: 'ContractAnalyzer', icon: FileSearch },
  { key: 'tool.document', path: 'DocumentGenerator', icon: FileText },
  { key: 'tool.risk', path: 'RiskChecker', icon: ShieldCheck },
  { key: 'tool.chat', path: 'LegalChat', icon: MessageSquare },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-brand-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="relative">
              <Scale className="h-8 w-8 text-brand-500 group-hover:text-brand-400 transition-colors" />
              <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              LexAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0.5 xl:gap-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={createPageUrl(link.path)}
                className="px-2.5 xl:px-4 py-2 whitespace-nowrap text-slate-300 hover:text-brand-400 transition-colors text-sm font-medium"
              >
                {t(link.key)}
              </Link>
            ))}
            
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-2.5 xl:px-4 py-2 whitespace-nowrap text-slate-300 hover:text-brand-400 transition-colors text-sm font-medium flex items-center gap-1">
                  {t('nav.aiTools')} <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-brand-900/30 w-56">
                {toolsMenu.map((tool) => (
                  <DropdownMenuItem key={tool.path} asChild>
                    <Link
                      to={createPageUrl(tool.path)}
                      className="flex items-center gap-3 text-slate-300 hover:text-brand-400 cursor-pointer"
                    >
                      <tool.icon className="h-4 w-4 text-brand-500" />
                      {t(tool.key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={createPageUrl(link.path)}
                className="px-2.5 xl:px-4 py-2 whitespace-nowrap text-slate-300 hover:text-brand-400 transition-colors text-sm font-medium"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageToggle />
            {isAdmin && (
              <Link to="/Admin" className="text-sm text-slate-300 hover:text-brand-400">
                {t('nav.admin')}
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to={createPageUrl('Dashboard')}>
                  <Button 
                    className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold shadow-lg shadow-brand-500/25"
                  >
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-brand-400"
                  title={t('nav.signOut')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/Login">
                <Button 
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold shadow-lg shadow-brand-500/25"
                >
                  {t('nav.signIn')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-brand-400"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-slate-950 border-t border-brand-900/20 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-2">
              <LanguageToggle className="mb-2" />
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={createPageUrl(link.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-slate-300 hover:text-brand-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="border-t border-slate-800 pt-2 mt-2">
                <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">{t('nav.aiTools')}</p>
                {toolsMenu.map((tool) => (
                  <Link
                    key={tool.path}
                    to={createPageUrl(tool.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-brand-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <tool.icon className="h-4 w-4 text-brand-500" />
                    {t(tool.key)}
                  </Link>
                ))}
              </div>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/Admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-slate-300 hover:text-brand-400 hover:bg-slate-800/50 rounded-lg"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link to={createPageUrl('Dashboard')} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold">
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full mt-2 border-brand-900/30 text-slate-300"
                  >
                    {t('nav.signOut')}
                  </Button>
                </>
              ) : (
                <Link to="/Login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold">
                    {t('nav.signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}