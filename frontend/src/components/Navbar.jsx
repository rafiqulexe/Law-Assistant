import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
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
  { name: 'Home', path: 'Home' },
  { name: 'Features', path: 'Features' },
  { name: 'Law Updates', path: 'LawUpdates' },
  { name: 'Find a Lawyer', path: 'FindLawyer' },
  { name: 'Pricing', path: 'Pricing' },
  { name: 'Blog', path: 'Blog' },
  { name: 'About', path: 'About' },
  { name: 'Contact', path: 'Contact' },
];

const toolsMenu = [
  { name: 'Contract Analyzer', path: 'ContractAnalyzer', icon: FileSearch },
  { name: 'Document Generator', path: 'DocumentGenerator', icon: FileText },
  { name: 'Risk Checker', path: 'RiskChecker', icon: ShieldCheck },
  { name: 'Legal Chat', path: 'LegalChat', icon: MessageSquare },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="relative">
              <Scale className="h-8 w-8 text-amber-500 group-hover:text-amber-400 transition-colors" />
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              LexAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={createPageUrl(link.path)}
                className="px-4 py-2 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium flex items-center gap-1">
                  AI Tools <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-amber-900/30 w-56">
                {toolsMenu.map((tool) => (
                  <DropdownMenuItem key={tool.path} asChild>
                    <Link
                      to={createPageUrl(tool.path)}
                      className="flex items-center gap-3 text-slate-300 hover:text-amber-400 cursor-pointer"
                    >
                      <tool.icon className="h-4 w-4 text-amber-500" />
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={createPageUrl(link.path)}
                className="px-4 py-2 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Link to="/Admin" className="text-sm text-slate-300 hover:text-amber-400">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to={createPageUrl('Dashboard')}>
                  <Button 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/25"
                  >
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-amber-400"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/Login">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/25"
                >
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-amber-400"
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
            className="lg:hidden bg-slate-900/98 border-t border-amber-900/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={createPageUrl(link.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-800 pt-2 mt-2">
                <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">AI Tools</p>
                {toolsMenu.map((tool) => (
                  <Link
                    key={tool.path}
                    to={createPageUrl(tool.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <tool.icon className="h-4 w-4 text-amber-500" />
                    {tool.name}
                  </Link>
                ))}
              </div>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/Admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg"
                    >
                      Admin
                    </Link>
                  )}
                  <Link to={createPageUrl('Dashboard')} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full mt-2 border-amber-900/30 text-slate-300"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Link to="/Login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                    Sign in
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