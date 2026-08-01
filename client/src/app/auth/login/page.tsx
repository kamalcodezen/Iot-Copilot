'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircuitBoard, Eye, EyeOff, ChromeIcon, Signal, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { getAuthError, getErrorMessage } from '@/utils/errors';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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
    <div className="min-h-screen flex items-center justify-center dashboard-bg relative pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(95,161,179,0.06)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-bg-elevated border border-border-default rounded-2xl p-7 sm:p-8 shadow-elevation-high">
          <div className="text-center mb-7">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group justify-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent-light border border-accent/20 group-hover:scale-105 transition-transform">
                <CircuitBoard className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xl font-extrabold">
                <span className="text-text-primary">IoT</span><span className="text-accent">Copilot</span>
              </span>
            </Link>
            <h1 className="text-xl font-extrabold text-text-primary mb-1.5">Welcome back</h1>
            <p className="text-sm font-semibold text-text-tertiary">Sign in to continue your IoT journey</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-error-light border border-error/30 text-sm font-semibold text-error">
              {apiError}
            </div>
          )}

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

          <p className="text-center text-sm font-semibold text-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-accent hover:text-accent-hover transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
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
