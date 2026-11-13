import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/lib/app';
import { Button, Card, ErrorState, Field, Input, LogoMark } from '@/components/ui';
// Only follow ?next= paths inside this site.
function nextPath(search) {
  const next = new URLSearchParams(search).get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

export default function Auth({ register: signup = false }) {
  const { t, user, signIn, register, go, toast, tError } = useApp();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const next = nextPath(location.search);

  if (user && !loading) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (username.trim().length < 3)
      errs.username = t('Use at least 3 letters or numbers', 'কমপক্ষে ৩টি অক্ষর বা সংখ্যা দিন');
    if (password.length < 8)
      errs.password = t('Password must be at least 8 characters', 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      if (signup) await register(username.trim(), password);
      else await signIn(username.trim(), password);
      toast(
        signup
          ? t('Account created. Welcome!', 'অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!')
          : t('Signed in', 'সাইন ইন হয়েছে'),
      );
      go(next);
    } catch (err) {
      setFormError(tError(err.message));
    } finally {
      setLoading(false);
    }
  };
  const switchMode = () => {
    setErrors({});
    setFormError('');
    go((signup ? '/signin' : '/register') + location.search);
  };
  return (
    <main className="anim-fade-up flex min-h-[calc(100dvh-57px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[400px] p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent-text [--logo-ink:var(--surface)]">
            <LogoMark className="size-11" />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold tracking-tight">
            {signup
              ? t('Create your account', 'অ্যাকাউন্ট তৈরি করুন')
              : t('Sign in to Bidhanshala', 'বিধানশালায় সাইন ইন')}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {signup
              ? t('Save chats, contracts and documents.', 'চ্যাট, চুক্তি ও দলিল সংরক্ষণ করুন।')
              : t('Welcome back.', 'আবার স্বাগতম।')}
          </p>
        </div>
        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-4">
          {formError && (
            <ErrorState
              title={formError}
              body={t('Check your details and try again.', 'তথ্য যাচাই করে আবার চেষ্টা করুন।')}
            />
          )}
          <Field label={t('Username', 'ইউজারনেম')} htmlFor="a-user" error={errors.username}>
            <Input
              id="a-user"
              autoComplete="username"
              icon={<UserIcon className="size-[18px]" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              invalid={!!errors.username}
            />
          </Field>
          <Field
            label={t('Password', 'পাসওয়ার্ড')}
            htmlFor="a-pass"
            error={errors.password}
            hint={signup ? t('At least 8 characters', 'কমপক্ষে ৮ অক্ষর') : undefined}
          >
            <Input
              id="a-pass"
              type={show ? 'text' : 'password'}
              autoComplete={signup ? 'new-password' : 'current-password'}
              icon={<Lock className="size-[18px]" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              invalid={!!errors.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={
                    show ? t('Hide password', 'পাসওয়ার্ড লুকান') : t('Show password', 'পাসওয়ার্ড দেখান')
                  }
                  className="flex size-9 items-center justify-center rounded-lg text-muted hover:text-fg"
                >
                  {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              }
            />
          </Field>
          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            {signup ? t('Create account', 'অ্যাকাউন্ট তৈরি করুন') : t('Sign in', 'সাইন ইন')}
          </Button>
        </form>
        <p className="mt-6 text-center text-[14px] text-muted">
          {signup
            ? t('Already have an account?', 'অ্যাকাউন্ট আছে?')
            : t('New to Bidhanshala?', 'বিধানশালায় নতুন?')}{' '}
          <button onClick={switchMode} className="rounded font-medium text-accent-text hover:underline">
            {signup ? t('Sign in', 'সাইন ইন') : t('Create an account', 'অ্যাকাউন্ট তৈরি করুন')}
          </button>
        </p>
      </Card>
    </main>
  );
}
