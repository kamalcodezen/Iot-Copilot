'use client';

import { BarChart3, Shield } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen dashboard-bg space-y-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Reports</h1>
          <p className="text-sm text-text-tertiary">Platform reports and analytics</p>
        </div>
      </div>
      <div className="bg-bg-elevated border border-border-default rounded-2xl shadow-elevation-high">
        <div className="text-center py-12">
          <Shield className="w-14 h-14 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Reports Yet</h3>
          <p className="text-sm text-text-tertiary">All community content is currently in good standing</p>
        </div>
      </div>
    </div>
  );
}
