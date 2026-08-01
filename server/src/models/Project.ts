import mongoose, { Document, Schema } from 'mongoose';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, SKILL_LEVELS } from '../utils/constants';
import type { ProjectCategory, ProjectStatus, SkillLevel } from '../utils/constants';

export interface IProject extends Document {
  userId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: SkillLevel;
  status: ProjectStatus;
  components: Array<{ name: string; quantity: number; link: string }>;
  circuitDescription: string;
  code: string;
  images: string[];
  learningOutcomes: string[];
  progress: number;
  timeline: { start: Date; end: Date };
  isPublic: boolean;
  likes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [...PROJECT_CATEGORIES],
      default: 'other',
    },
    difficulty: {
      type: String,
      enum: [...SKILL_LEVELS],
      default: 'beginner',
    },
    status: {
      type: String,
      enum: [...PROJECT_STATUSES],
      default: 'planning',
    },
    components: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        link: { type: String, default: '' },
      },
    ],
    circuitDescription: { type: String, default: '' },
    code: { type: String, default: '' },
    images: [{ type: String }],
    learningOutcomes: [{ type: String }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    timeline: {
      start: Date,
      end: Date,
    },
    isPublic: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IProject>('Project', projectSchema);
