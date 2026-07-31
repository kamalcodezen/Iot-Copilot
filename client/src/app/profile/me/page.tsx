'use client';

import { motion } from 'framer-motion';
import { User, Settings, Github, Linkedin, Twitter, Award, Mail, Calendar, Home, Medal, Target, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import IoTLoader from '@/components/ui/IoTLoader';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/date';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader /></div>;

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 max-w-4xl mx-auto px-4 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="text-center py-10">
          <div className="relative inline-block">
            <Avatar src={user.avatar} name={user.name} size="xl" status="online" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary mt-4">{user.name}</h1>
          <p className="text-text-secondary font-semibold">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="accent" dot>{user.skillLevel}</Badge>
            <Badge variant={user.role === 'admin' ? 'warning' : 'default'}>{user.role}</Badge>
          </div>
          {user.bio && <p className="text-sm font-medium text-text-tertiary mt-4 max-w-md mx-auto leading-relaxed">{user.bio}</p>}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Link href="/settings" className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-hover transition-colors px-4 py-2 rounded-xl hover:bg-accent-light">
              <Settings size={15} /> Edit Profile
            </Link>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Medal size={14} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Projects', value: user.stats.totalProjects, gradient: 'from-accent/20 to-blue-500/10', color: 'text-accent' },
              { label: 'Completed', value: user.stats.completedProjects, gradient: 'from-emerald-500/20 to-teal-500/10', color: 'text-emerald-400' },
              { label: 'Streak', value: `${user.stats.learningStreak}d`, gradient: 'from-orange-500/20 to-amber-500/10', color: 'text-orange-400' },
              { label: 'Hours', value: Math.floor(user.stats.totalHours), gradient: 'from-violet-500/20 to-purple-500/10', color: 'text-violet-400' },
            ].map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} border border-border-default rounded-xl p-4 text-center transition-all duration-200 hover:shadow-elevation-medium`}>
                <p className={`text-2xl font-extrabold ${stat.color} tabular-nums`}>{stat.value}</p>
                <p className="text-xs font-bold text-text-tertiary mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
              <User size={14} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Details</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-bg-surface border border-border-default">
              <Mail size={15} className="text-text-muted shrink-0" />
              <span className="font-semibold text-text-secondary">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-bg-surface border border-border-default">
              <Calendar size={15} className="text-text-muted shrink-0" />
              <span className="font-semibold text-text-secondary">Joined {formatDate(user.createdAt)}</span>
            </div>
            {user.socialLinks.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-bg-surface border border-border-default text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                <Github size={15} className="text-text-muted shrink-0" /> <span className="font-bold">GitHub</span>
              </a>
            )}
            {user.socialLinks.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-bg-surface border border-border-default text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                <Linkedin size={15} className="text-text-muted shrink-0" /> <span className="font-bold">LinkedIn</span>
              </a>
            )}
            {user.socialLinks.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-bg-surface border border-border-default text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                <Twitter size={15} className="text-text-muted shrink-0" /> <span className="font-bold">Twitter</span>
              </a>
            )}
          </div>
        </Card>
      </div>

      {user.badges && user.badges.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Award size={14} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Badges</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((badge: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl px-4 py-3 text-center transition-all duration-200 hover:shadow-elevation-medium hover:-translate-y-0.5">
                <p className="text-sm font-bold text-amber-400">{badge.name}</p>
                <p className="text-xs font-semibold text-text-muted mt-0.5">{formatDate(badge.earnedAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
