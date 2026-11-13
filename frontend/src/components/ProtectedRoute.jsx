import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/Login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}
