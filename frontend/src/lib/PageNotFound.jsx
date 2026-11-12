import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function PageNotFound() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <Scale className="h-12 w-12 text-amber-500 mx-auto" />
        <h1 className="text-7xl font-light text-slate-600">404</h1>
        <h2 className="text-2xl font-medium">{t('notFound.title')}</h2>
        <p className="text-slate-400">
          {t('notFound.text', { path: location.pathname })}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-600"
        >
          {t('notFound.home')}
        </Link>
      </div>
    </div>
  );
}
