import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import Layout from '@/Layout';
import PageNotFound from '@/lib/PageNotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { adminPages, privatePages, publicPages } from './pages.config';

function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}

function page(element) {
  // Navbar and footer stay on screen while a page's code downloads.
  return (
    <Layout>
      <Suspense fallback={<PageLoading />}>{element}</Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={page(<Home />)} />
            <Route path="/Login" element={page(<Login />)} />
            <Route path="/Register" element={page(<Login mode="register" />)} />

            {Object.entries(publicPages).map(([name, Page]) => (
              <Route key={name} path={`/${name}`} element={page(<Page />)} />
            ))}

            {Object.entries(privatePages).map(([name, Page]) => (
              <Route
                key={name}
                path={`/${name}`}
                element={page(<ProtectedRoute><Page /></ProtectedRoute>)}
              />
            ))}

            {Object.entries(adminPages).map(([name, Page]) => (
              <Route
                key={name}
                path={`/${name}`}
                element={page(<ProtectedRoute adminOnly><Page /></ProtectedRoute>)}
              />
            ))}

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster theme="dark" richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}
