'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, FolderKanban, BarChart3, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import IoTLoader from '@/components/ui/IoTLoader';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/layout/SectionHeader';
import { getAdminStats } from '@/lib/api/admin';
import { formatDate } from '@/utils/date';
import { AdminStats } from '@/types';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader /></div>;
  if (error) return (
    <div className="min-h-screen dashboard-bg flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="h-14 w-14 rounded-2xl bg-error-light flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-error" />
      </div>
      <h2 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h2>
      <p className="text-sm font-semibold text-text-tertiary mb-6 max-w-[280px]">{error}</p>
      <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-accent rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15">
        <RefreshCw size={14} />Retry
      </button>
    </div>
  );

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.totals?.totalUsers || 0, gradient: 'from-accent/20 to-blue-500/10', color: 'text-accent' },
    { icon: FolderKanban, label: 'Total Projects', value: stats?.totals?.totalProjects || 0, gradient: 'from-emerald-500/20 to-teal-500/10', color: 'text-emerald-400' },
    { icon: BarChart3, label: 'Public Projects', value: stats?.totals?.totalPublicProjects || 0, gradient: 'from-violet-500/20 to-purple-500/10', color: 'text-violet-400' },
    { icon: Shield, label: 'Completed', value: stats?.totals?.totalCompletedProjects || 0, gradient: 'from-orange-500/20 to-amber-500/10', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <PageHeader icon={Shield} title="Admin Dashboard" subtitle="Platform overview and management" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className="dashboard-card p-5 hover-lift"
          >
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-text-primary tracking-tight tabular-nums">{item.value}</p>
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wide">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <Card>
          <SectionHeader icon={Users} title="Recent Users" />
          <div className="space-y-2">
            {stats?.recentUsers?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle hover:bg-bg-hover hover:shadow-elevation-low transition-all duration-200">
                <div>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                  <p className="text-xs font-semibold text-text-muted">{user.email}</p>
                </div>
                <span className="text-xs font-bold text-text-tertiary">{formatDate(user.createdAt)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={BarChart3} title="Projects by Category" tone="info" />
          <div className="space-y-2">
            {stats?.projectsByCategory?.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle hover:bg-bg-hover hover:shadow-elevation-low transition-all duration-200">
                <span className="text-sm font-bold text-text-secondary capitalize truncate">{cat._id.replace('-', ' ')}</span>
                <span className="text-sm font-extrabold text-accent tabular-nums">{cat.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
