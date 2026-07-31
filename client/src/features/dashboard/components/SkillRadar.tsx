'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, Target } from 'lucide-react';

const data = [
  { skill: 'Hardware', value: 70, fullMark: 100 },
  { skill: 'Programming', value: 65, fullMark: 100 },
  { skill: 'Sensors', value: 55, fullMark: 100 },
  { skill: 'Protocols', value: 45, fullMark: 100 },
  { skill: 'Cloud', value: 40, fullMark: 100 },
  { skill: 'Debugging', value: 60, fullMark: 100 },
];

export default function SkillRadar() {
  const avgScore = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  if (!data || data.length === 0) {
    return (
      <div className="dashboard-card p-5 sm:p-6" role="region" aria-label="Skill radar chart">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center shrink-0">
            <Target size={14} className="text-violet-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Skill Radar</h3>
        </div>
        <p className="text-xs font-semibold text-text-tertiary mb-6 uppercase tracking-wide">Your IoT skill levels</p>
        <div className="h-64 flex flex-col items-center justify-center text-text-tertiary">
          <div className="h-12 w-12 rounded-2xl bg-accent-light flex items-center justify-center mb-3">
            <BarChart3 size={24} className="text-accent/60" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-text-secondary">No skill data available</p>
          <p className="text-xs mt-1 font-medium text-text-muted">Complete a skill assessment to see your radar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6" role="region" aria-label="Skill radar chart">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center shrink-0">
            <Target size={14} className="text-violet-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Skill Radar</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-surface border border-border-default">
          <span className="text-[11px] font-bold text-text-secondary tabular-nums">{avgScore}%</span>
          <span className="text-[10px] font-semibold text-text-tertiary">avg</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Your IoT skill levels</p>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <PolarGrid stroke="rgba(230,240,244,0.05)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#a9c6d2', fontSize: 10, fontWeight: 600 }} tickLine={false} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Skills" dataKey="value" stroke="#5fa1b3" fill="#5fa1b3" fillOpacity={0.1} strokeWidth={2} animationDuration={600} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
