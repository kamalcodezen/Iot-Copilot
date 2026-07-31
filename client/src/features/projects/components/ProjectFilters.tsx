'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface FilterState { search: string; status: string; category: string; difficulty: string; }
interface ProjectFiltersProps { onFilter: (filters: FilterState) => void; }

const selectClass =
  'px-3 py-2 rounded-xl border border-border-default bg-bg-elevated text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 shadow-elevation-low';

export default function ProjectFilters({ onFilter }: ProjectFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({ search: '', status: '', category: '', difficulty: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const cleared = { search: '', status: '', category: '', difficulty: '' };
    setFilters(cleared);
    onFilter(cleared);
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
          <input type="text" placeholder="Search projects..." value={filters.search} onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-default bg-bg-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 shadow-elevation-low" />
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn('flex items-center justify-center h-10 w-10 rounded-xl border transition-all shrink-0 touch-target',
            showAdvanced ? 'border-accent/30 bg-accent-light text-accent' : 'border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface'
          )} aria-label={showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'} aria-expanded={showAdvanced}
        ><SlidersHorizontal size={16} /></button>
        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center justify-center h-10 w-10 rounded-xl border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all shrink-0 touch-target shadow-elevation-low"
          ><X size={16} /></button>
        )}
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-2 sm:gap-3 animate-fade-in-up" role="group" aria-label="Advanced filters">
          <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)} className={selectClass}>
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)} className={selectClass}>
            <option value="">All Categories</option>
            <option value="smart-home">Smart Home</option>
            <option value="agriculture">Agriculture</option>
            <option value="healthcare">Healthcare</option>
            <option value="automation">Automation</option>
            <option value="robotics">Robotics</option>
            <option value="other">Other</option>
          </select>
          <select value={filters.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)} className={selectClass}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      )}
    </div>
  );
}
