import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useApp } from '@/lib/app';
import { Footer, NavBar, UpdateBar } from '@/components/Layout';
import { ConfirmHost, Spinner, ToastViewport } from '@/components/ui';
import Home from '@/pages/Home';

// Every page except Home loads on first visit, so the first screen downloads less code.
const Ask = lazy(() => import('@/pages/Ask'));
const Contract = lazy(() => import('@/pages/Contract'));
const RiskChecker = lazy(() => import('@/pages/Risk'));
const Documents = lazy(() => import('@/pages/Documents'));
const Updates = lazy(() => import('@/pages/Updates'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Auth = lazy(() => import('@/pages/Auth'));
const Admin = lazy(() => import('@/pages/Admin'));
const Lawyers = lazy(() => import('@/pages/Lawyers'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const About = lazy(() => import('@/pages/Info').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/Info').then((m) => ({ default: m.Contact })));
const Blog = lazy(() => import('@/pages/Info').then((m) => ({ default: m.Blog })));
const Article = lazy(() => import('@/pages/Info').then((m) => ({ default: m.Article })));
const NotFound = lazy(() => import('@/pages/Info').then((m) => ({ default: m.NotFound })));

// Addresses used before the redesign.
const OLD_PATHS = {
  '/LegalChat': '/ask',
  '/ContractAnalyzer': '/contract',
  '/RiskChecker': '/risk',
  '/DocumentGenerator': '/documents',
  '/LawUpdates': '/updates',
  '/FindLawyer': '/lawyers',
  '/Login': '/signin',
  '/Features': '/',
};

function Loading() {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center text-muted">
      <Spinner className="size-6" />
    </div>
  );
}

// Tools call the AI, so they need an account; Admin also needs the admin flag.
function Private({ children, admin }) {
  const { user, authLoading } = useApp();
  const location = useLocation();
  if (authLoading) return <Loading />;
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (admin && !user.admin) return <Navigate to="/dashboard" replace />;
  return children;
}

function ArticleRoute() {
  const { slug } = useParams();
  return <Article slug={slug} />;
}

export default function App() {
  const { path } = useApp();
  // The chat and sign-in screens use the whole window.
  const bare = path === '/ask' || path === '/signin' || path === '/register';
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-[90] rounded-lg bg-surface px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      {!bare && <UpdateBar />}
      <NavBar />
      <div id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<Private><Ask /></Private>} />
            <Route path="/contract" element={<Private><Contract /></Private>} />
            <Route path="/risk" element={<Private><RiskChecker /></Private>} />
            <Route path="/documents" element={<Private><Documents /></Private>} />
            <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
            <Route path="/admin" element={<Private admin><Admin /></Private>} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/register" element={<Auth register />} />
            <Route path="/lawyers" element={<Lawyers />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<ArticleRoute />} />
            {Object.entries(OLD_PATHS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!bare && <Footer />}
      <ToastViewport />
      <ConfirmHost />
    </div>
  );
}
