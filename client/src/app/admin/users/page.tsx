'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Trash2, Shield } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import IoTLoader from '@/components/ui/IoTLoader';
import { getAdminUsers } from '@/lib/api/admin';
import { updateUserRoleAction, deleteUserAction } from '@/lib/actions/admin';
import { formatDate } from '@/utils/date';
import { AdminUser } from '@/types';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const { data } = await getAdminUsers(params);
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRoleAction(id, role);
      toast.success('Role updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user and all their data?')) return;
    try {
      await deleteUserAction(id);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen dashboard-bg space-y-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">User Management</h1>
          <p className="text-sm text-text-tertiary">Manage platform users</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-default bg-bg-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><IoTLoader size="md" /></div>
      ) : (
        <div className="bg-bg-elevated border border-border-default rounded-2xl overflow-hidden shadow-elevation-high">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-surface/80">
                  <th className="text-left p-4 text-xs text-text-tertiary font-semibold tracking-wide uppercase">User</th>
                  <th className="text-left p-4 text-xs text-text-tertiary font-semibold tracking-wide uppercase">Role</th>
                  <th className="text-left p-4 text-xs text-text-tertiary font-semibold tracking-wide uppercase">Level</th>
                  <th className="text-left p-4 text-xs text-text-tertiary font-semibold tracking-wide uppercase">Joined</th>
                  <th className="text-right p-4 text-xs text-text-tertiary font-semibold tracking-wide uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border-subtle hover:bg-bg-surface/60 transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-xs font-bold text-accent shadow-elevation-low">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' && <Shield size={13} className="text-warning" />}
                        <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-xs px-2.5 py-1.5 rounded-xl border border-border-default bg-bg-elevated text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/25 transition-all duration-200">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="accent" size="sm">{user.skillLevel}</Badge></td>
                    <td className="p-4 text-sm text-text-secondary">{formatDate(user.createdAt)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-xl text-text-muted hover:text-error hover:bg-error/10 transition-all duration-200"><Trash2 size={16} /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
