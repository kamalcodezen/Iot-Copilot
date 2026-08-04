'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, LogOut, Shield, KeyRound } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import IoTLoader from '@/components/ui/IoTLoader';
import SectionHeader from '@/components/layout/SectionHeader';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/session';
import { getErrorMessage } from '@/utils/errors';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user as SessionUser | undefined;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!isPending && !sessionUser) router.push('/auth/login');
    if (sessionUser && !name) setName(sessionUser.name);
  }, [isPending, sessionUser, router, name]);

  if (isPending || !sessionUser) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader /></div>;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setSavingProfile(true);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) throw error;
      const { data: fresh } = await authClient.getSession();
      if (fresh?.user?.name) setName(fresh.user.name);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both password fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    setSavingPassword(true);
    try {
      const { error } = await authClient.changePassword({ 
        currentPassword, 
        newPassword,
        revokeOtherSessions: true 
      });
      if (error) throw error;
      
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to change password'));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
    } finally {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen dashboard-bg max-w-2xl mx-auto space-y-6 px-4 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Profile Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-text-primary">Profile Settings</h2>
              <p className="text-sm font-semibold text-text-tertiary">Manage your public information</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <Input 
              label="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your full name"
            />
            <Input 
              label="Email Address" 
              value={sessionUser.email} 
              disabled 
            />
            
            <Button type="submit" isLoading={savingProfile}>
              <Save size={16} className="mr-2" />
              Save Profile
            </Button>
          </form>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-text-primary">Security</h2>
              <p className="text-sm font-semibold text-text-tertiary">Update your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <Input 
              label="Current Password" 
              type="password"
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              placeholder="Enter current password"
            />
            <Input 
              label="New Password" 
              type="password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="Must be at least 8 characters"
            />
            
            <Button type="submit" variant="secondary" isLoading={savingPassword}>
              <KeyRound size={16} className="mr-2" />
              Change Password
            </Button>
          </form>
        </Card>

        {/* Logout */}
        <Card>
          <SectionHeader icon={LogOut} title="Sign Out" tone="error" iconSize={13} />
          <p className="text-sm font-semibold text-text-tertiary mb-4">Sign out of your account on this device.</p>
          <Button variant="danger" onClick={handleLogout} isLoading={isLoggingOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </Card>

      </motion.div>
    </div>
  );
}
