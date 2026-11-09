import { lazy } from 'react';
import Home from './pages/Home';

// Each page except Home loads on first visit, so the first screen downloads less code.
const Features = lazy(() => import('./pages/Features'));
const FindLawyer = lazy(() => import('./pages/FindLawyer'));
const ContractAnalyzer = lazy(() => import('./pages/ContractAnalyzer'));
const DocumentGenerator = lazy(() => import('./pages/DocumentGenerator'));
const RiskChecker = lazy(() => import('./pages/RiskChecker'));
const LegalChat = lazy(() => import('./pages/LegalChat'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const LawUpdates = lazy(() => import('./pages/LawUpdates'));

// Pages anyone can open.
export const publicPages = {
  Home,
  Features,
  FindLawyer,
  Pricing,
  Blog,
  About,
  Contact,
  LawUpdates,
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
