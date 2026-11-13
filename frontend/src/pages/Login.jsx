import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';

// Only allow redirects to paths inside this app.
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/Dashboard';
}

export default function Login({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const { t, tError } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(username.trim(), password);
      } else {
        await login(username.trim(), password);
      }
      navigate(safeNext(params.get('next')), { replace: true });
    } catch (err) {
      setError(tError(err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md py-12"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/20 mb-4">
            <Scale className="w-7 h-7 text-brand-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isRegister ? t('login.createTitle') : t('login.welcome')}
          </h1>
          <p className="text-slate-400 mt-2">
            {isRegister ? t('login.createText') : t('login.welcomeText')}
          </p>
        </div>

        <Card className="bg-slate-900/80 border-brand-900/30">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">{t('login.username')}</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                  minLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                  minLength={isRegister ? 8 : undefined}
                />
                {isRegister && <p className="text-xs text-slate-500">{t('login.passwordHint')}</p>}
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isRegister ? t('login.createAccount') : t('login.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-400 mt-6">
          {isRegister ? t('login.haveAccount') : t('login.noAccount')}
          <Link to={isRegister ? '/Login' : '/Register'} className="text-brand-400 hover:text-brand-300">
            {isRegister ? t('login.signIn') : t('login.createOne')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
