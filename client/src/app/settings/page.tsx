'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, LogOut, Home, User, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import IoTLoader from '@/components/ui/IoTLoader';
import { useAuthStore } from '@/store/authStore';
import { profileSchema } from '@/utils/validation';
import { updateProfileAction } from '@/lib/actions/user';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoading, isAuthenticated, logout, setUser, isLoggingOut } = useAuthStore();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader /></div>;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      skillLevel: user?.skillLevel || 'beginner',
      socialLinks: { github: user?.socialLinks?.github || '', linkedin: user?.socialLinks?.linkedin || '', twitter: user?.socialLinks?.twitter || '' },
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: updated } = await updateProfileAction(user.id, data);
      setUser(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen dashboard-bg max-w-2xl mx-auto space-y-6 px-4 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-text-primary">Settings</h2>
              <p className="text-sm font-semibold text-text-tertiary">Manage your profile and preferences</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Full Name" error={errors.name?.message} {...register('name')} />

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-text-secondary">Bio</label>
              <textarea {...register('bio')} rows={3} placeholder="Tell us about yourself..." className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-text-secondary">Skill Level</label>
              <select {...register('skillLevel')} className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-accent-light flex items-center justify-center">
                  <User size={12} className="text-accent" />
                </div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Social Links</h3>
              </div>
              <Input label="GitHub URL" placeholder="https://github.com/username" {...register('socialLinks.github')} />
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" {...register('socialLinks.linkedin')} />
              <Input label="Twitter URL" placeholder="https://twitter.com/username" {...register('socialLinks.twitter')} />
            </div>

            <Button type="submit" isLoading={saving}><Save size={16} className="mr-2" />Save Changes</Button>
          </form>
        </Card>
      </motion.div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-error/20 to-red-500/10 flex items-center justify-center">
            <LogOut size={13} className="text-error" />
          </div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Sign Out</h3>
        </div>
        <p className="text-sm font-semibold text-text-tertiary mb-4">Sign out of your account on this device.</p>
        <Button variant="danger" onClick={handleLogout} isLoading={isLoggingOut}><LogOut size={16} className="mr-2" />Sign Out</Button>
      </Card>
    </div>
  );
}
