'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { projectSchema } from '@/utils/validation';

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
}

const selectClass =
  'w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 shadow-elevation-low';

export default function ProjectForm({ initialData, onSubmit, isLoading }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || { category: 'other', difficulty: 'beginner', status: 'planning', isPublic: false },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
      <Input label="Project Title" placeholder="e.g., Smart Weather Station" error={errors.title?.message} {...register('title')} />

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-semibold uppercase tracking-wide text-text-secondary">Description</label>
        <textarea id="description" {...register('description')} rows={4} placeholder="Describe your project in detail..."
          className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 resize-y min-h-[100px] shadow-elevation-low"
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-semibold uppercase tracking-wide text-text-secondary">Category</label>
          <select id="category" {...register('category')} className={selectClass}>
            <option value="smart-home">Smart Home</option>
            <option value="agriculture">Agriculture</option>
            <option value="healthcare">Healthcare</option>
            <option value="automation">Automation</option>
            <option value="robotics">Robotics</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="difficulty" className="block text-sm font-semibold uppercase tracking-wide text-text-secondary">Difficulty</label>
          <select id="difficulty" {...register('difficulty')} className={selectClass}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="status" className="block text-sm font-semibold uppercase tracking-wide text-text-secondary">Status</label>
          <select id="status" {...register('status')} className={selectClass}>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="isPublic" {...register('isPublic')}
          className="h-4 w-4 rounded-xl border-border-default bg-bg-elevated text-accent focus:ring-accent focus:ring-2 focus:ring-offset-0"
        />
        <label htmlFor="isPublic" className="text-sm text-text-secondary select-none font-semibold">Make this project public</label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">{initialData ? 'Update Project' : 'Create Project'}</Button>
      </div>
    </form>
  );
}
