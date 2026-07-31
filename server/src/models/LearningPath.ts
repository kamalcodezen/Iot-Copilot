import mongoose, { Document, Schema } from 'mongoose';

interface IModule {
  title: string;
  description: string;
  order: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  resources: Array<{ title: string; url: string; type: 'video' | 'article' | 'doc' }>;
  estimatedHours: number;
}

export interface ILearningPath extends Document {
  userId: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: IModule[];
  progress: number;
  isActive: boolean;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const learningPathSchema = new Schema<ILearningPath>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    modules: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        order: { type: Number, required: true },
        status: {
          type: String,
          enum: ['locked', 'available', 'in-progress', 'completed'],
          default: 'locked',
        },
        resources: [
          {
            title: String,
            url: String,
            type: { type: String, enum: ['video', 'article', 'doc'] },
          },
        ],
        estimatedHours: { type: Number, default: 1 },
      },
    ],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<ILearningPath>('LearningPath', learningPathSchema);
