'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircuitBoard } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import IoTLoader from '@/components/ui/IoTLoader';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, fetchMe, isLoggingOut } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const router = useRouter();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMe();
    }
  }, [fetchMe]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router]);

  if (isLoading || (!isAuthenticated && !isLoggingOut)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dashboard-bg relative">
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-accent/[0.03] via-accent/[0.01] to-transparent pointer-events-none" />
        <IoTLoader size="lg" />
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-accent transition-colors mt-8">
          <ArrowLeft size={13} />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg text-text-primary pt-20">
      <Sidebar />

      <div className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "lg:pl-[260px]" : "lg:pl-0")}>
        <main className="pb-24 lg:pb-6 relative z-10">
          <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-accent/[0.03] via-accent/[0.01] to-transparent pointer-events-none" />

          <div className="sticky top-20 z-20 bg-bg-primary/40 backdrop-blur-md border-b border-border-default px-4 sm:px-6 lg:px-8 py-2.5 lg:hidden">
            <div className="flex items-center gap-3">
              <MobileNav />
              <div className="flex items-center gap-2">
                <CircuitBoard size={14} className="text-accent" />
                <span className="text-xs font-bold text-text-secondary tracking-wider uppercase">Dashboard</span>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto relative z-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
