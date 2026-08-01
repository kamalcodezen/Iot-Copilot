'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ChromeIcon, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { getAuthError, getErrorMessage } from '@/utils/errors';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthShell from '@/components/auth/AuthShell';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

type LoginForm = { email: string; password: string };

function getLoginErrorMessage(error: unknown): string {
  const { code, message } = getAuthError(error);
  if (code === 'INVALID_EMAIL_OR_PASSWORD' || message.includes('Invalid email')) return 'Invalid email or password';
  if (code === 'USER_NOT_FOUND') return 'No account found with this email';
  if (code === 'EMAIL_NOT_VERIFIED') return 'Please verify your email before signing in';
  if (code === 'ACCOUNT_SUSPENDED' || message.includes('suspended')) return 'This account has been suspended';
  if (code === 'RATE_LIMIT' || message.includes('rate')) return 'Too many attempts. Please try again later';
  return message || 'Login failed';
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const { isAuthenticated, isLoading, fetchMe, login, signInWithGoogle } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMe();
    }
  }, [fetchMe]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(searchParams.get('redirect') || '/dashboard');
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (!isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError('');
      const user = await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push(user.role === 'admin' ? '/admin' : (searchParams.get('redirect') || '/dashboard'));
    } catch (error) {
      const message = getLoginErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading(true);
      setApiError('');
      await signInWithGoogle();
    } catch (error) {
      const message = getErrorMessage(error, 'Google sign-in failed');
      setApiError(message);
      toast.error(message);
      setSocialLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your IoT journey"
      apiError={apiError}
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-accent hover:text-accent-hover transition-colors">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border-default bg-bg-card text-accent focus:ring-accent/50 accent-accent"
                />
                <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In <ArrowRight size={15} className="ml-1.5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-default" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-bg-elevated px-3 font-semibold text-text-muted">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              isLoading={socialLoading}
              onClick={handleGoogleSignIn}
            >
              <ChromeIcon size={15} className="mr-2" />
              Google
            </Button>
          </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <Spinner size="lg" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
