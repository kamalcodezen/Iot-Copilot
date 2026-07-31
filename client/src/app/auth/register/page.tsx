'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircuitBoard, Eye, EyeOff, ChromeIcon, ArrowRight } from 'lucide-react';
import { registerSchema } from '@/utils/validation';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

type RegisterForm = { name: string; email: string; password: string; confirmPassword: string };

function getPasswordStrength(password: string): { level: number; label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 0, label: 'Weak', color: 'bg-error', width: 'w-1/4' };
  if (score === 2) return { level: 1, label: 'Fair', color: 'bg-warning', width: 'w-2/4' };
  if (score === 3) return { level: 2, label: 'Good', color: 'bg-warning', width: 'w-3/4' };
  return { level: 3, label: 'Strong', color: 'bg-success', width: 'w-full' };
}

function getErrorMessage(err: any): string {
  if (!err) return 'Registration failed';
  const code = err?.code || err?.status || '';
  const msg = err?.message || err?.error || '';
  if (code === 'USER_ALREADY_EXISTS' || msg.includes('already exists')) return 'An account with this email already exists';
  if (code === 'WEAK_PASSWORD' || msg.includes('weak')) return 'Password is too weak. Use at least 6 characters';
  if (code === 'INVALID_EMAIL') return 'Please enter a valid email address';
  if (code === 'RATE_LIMIT' || msg.includes('rate')) return 'Too many attempts. Please try again later';
  return msg || 'Registration failed';
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [apiError, setApiError] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const { isAuthenticated, isLoading, fetchMe, register: registerUser, signInWithGoogle } = useAuthStore();
  const router = useRouter();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMe();
    }
  }, [fetchMe]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = watch('password');
  const strength = useMemo(() => getPasswordStrength(watchedPassword || ''), [watchedPassword]);

  if (!isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  const onSubmit = async (data: RegisterForm) => {
    if (!agreeTerms) {
      setApiError('You must agree to the Terms & Conditions');
      return;
    }
    try {
      setApiError('');
      const user = await registerUser(data.name, data.email, data.password);
      toast.success('Account created! Welcome to IoT Copilot.');
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      const message = getErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading(true);
      setApiError('');
      await signInWithGoogle();
    } catch (error: any) {
      const message = error?.message || 'Google sign-in failed';
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
            <h1 className="text-xl font-extrabold text-text-primary mb-1.5">Get Started</h1>
            <p className="text-sm font-semibold text-text-tertiary">Create your account and start learning IoT</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-error-light border border-error/30 text-sm font-semibold text-error">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password', { onChange: (e) => setPasswordValue(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {watchedPassword && (
              <div className="space-y-1 -mt-1">
                <div className="h-1.5 rounded-full bg-bg-card overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: strength.width }}
                    className={`h-full rounded-full ${strength.color} transition-all duration-300`}
                  />
                </div>
                <p className={`text-xs font-bold ${strength.level >= 3 ? 'text-success' : strength.level >= 2 ? 'text-warning' : 'text-error'}`}>
                  Password strength: {strength.label}
                </p>
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-border-default bg-bg-card text-accent focus:ring-accent/50 accent-accent"
              />
              <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                I agree to the{' '}
                <Link href="/terms" className="text-accent hover:text-accent-hover">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-accent hover:text-accent-hover">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account <ArrowRight size={15} className="ml-1.5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-default" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-bg-elevated px-3 font-semibold text-text-muted">or sign up with</span>
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
