'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';

interface ProgressChartProps {
  data: Array<{ date: string; count: number }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-bg-elevated border border-border-default rounded-2xl px-4 py-3 text-sm shadow-elevation-high animate-scale-fade-in">
        <p className="text-text-tertiary text-xs font-semibold tracking-wide">{label}</p>
        <p className="text-accent font-extrabold mt-1 text-base tabular-nums">
          {payload[0].value}
          <span className="text-xs font-bold text-text-tertiary ml-1.5">
            {payload[0].value === 1 ? 'activity' : 'activities'}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const [focused, setFocused] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="dashboard-card p-5 sm:p-6" role="region" aria-label="Learning activity chart">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center shrink-0">
            <Activity size={14} className="text-accent" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Learning Activity</h3>
        </div>
        <p className="text-xs font-semibold text-text-tertiary mb-6 uppercase tracking-wide">Track your daily learning progress</p>
        <div className="h-64 flex flex-col items-center justify-center text-text-tertiary">
          <div className="h-12 w-12 rounded-2xl bg-accent-light flex items-center justify-center mb-3">
            <BarChart3 size={24} className="text-accent/60" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-text-secondary">No activity data yet</p>
          <p className="text-xs mt-1 font-medium text-text-muted text-center max-w-[200px]">Start learning to see your progress here</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const avg = data.length > 0 ? (total / data.length).toFixed(1) : '0';

  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6" role="region" aria-label="Learning activity chart">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center shrink-0">
            <Activity size={14} className="text-accent" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Learning Activity</h3>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-bg-surface border border-border-default">
          <TrendingUp size={12} className="text-accent" />
          <span className="text-[11px] font-bold text-text-secondary tabular-nums">{avg}/day</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Daily learning sessions &middot; 30 days</p>
      <div
        className="h-56 sm:h-64"
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(230,240,244,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#7ca3b5', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: string) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: '#7ca3b5', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5fa1b3" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5fa1b3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="count"
              stroke="#5fa1b3"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: '#5fa1b3', stroke: '#102330', strokeWidth: 2 }}
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
