import Home from './pages/Home';
import Features from './pages/Features';
import FindLawyer from './pages/FindLawyer';
import ContractAnalyzer from './pages/ContractAnalyzer';
import DocumentGenerator from './pages/DocumentGenerator';
import RiskChecker from './pages/RiskChecker';
import LegalChat from './pages/LegalChat';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Pages anyone can open.
export const publicPages = {
  Home,
  Features,
  FindLawyer,
  Pricing,
  Blog,
  About,
  Contact,
};

// Pages that need a signed-in user (the AI tools call the backend).
export const privatePages = {
  Dashboard,
  LegalChat,
  ContractAnalyzer,
  DocumentGenerator,
  RiskChecker,
};

export const adminPages = {
  Admin,
};
