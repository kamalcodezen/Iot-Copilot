'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { registerSchema } from '@/utils/validation';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/session';
import { getAuthError } from '@/utils/errors';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthShell from '@/components/auth/AuthShell';
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

function getRegisterErrorMessage(error: unknown): string {
  const { code, message } = getAuthError(error);
  if (code === 'USER_ALREADY_EXISTS' || message.includes('already exists')) return 'An account with this email already exists';
  if (code === 'WEAK_PASSWORD' || message.includes('weak')) return 'Password is too weak. Use at least 6 characters';
  if (code === 'INVALID_EMAIL') return 'Please enter a valid email address';
  if (code === 'RATE_LIMIT' || message.includes('rate')) return 'Too many attempts. Please try again later';
  return message || 'Registration failed';
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [apiError, setApiError] = useState('');
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.replace('/');
    }
  }, [isPending, session, router]);

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

  if (!isPending && session) {
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
      const { data: result, error } = await authClient.signUp.email({ name: data.name, email: data.email, password: data.password });
      if (error) throw error;
      const sessionUser = result?.user as SessionUser | undefined;
      toast.success('Account created! Welcome to IoT Copilot.');
      router.push(sessionUser?.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      const message = getRegisterErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <AuthShell
      title="Get Started"
      subtitle="Create your account and start learning IoT"
      apiError={apiError}
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent hover:text-accent-hover transition-colors">
            Sign in
          </Link>
        </>
      }
    >
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                I agree to the <span className="text-accent">Terms &amp; Conditions</span> and <span className="text-accent">Privacy Policy</span>
              </span>
            </label>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </form>
    </AuthShell>
  );
}
