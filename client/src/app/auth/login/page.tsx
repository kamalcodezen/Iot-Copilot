'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/utils/validation';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/session';
import { getAuthError } from '@/utils/errors';
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
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPending && session) {
      router.push(searchParams.get('redirect') || '/dashboard');
    }
  }, [isPending, session, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (!isPending && session) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError('');
      const { data: result, error } = await authClient.signIn.email({ email: data.email, password: data.password });
      if (error) throw error;
      const sessionUser = result?.user as SessionUser | undefined;
      toast.success('Welcome back!');
      router.push(sessionUser?.role === 'admin' ? '/admin' : (searchParams.get('redirect') || '/'));
    } catch (error) {
      const message = getLoginErrorMessage(error);
      setApiError(message);
      toast.error(message);
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
