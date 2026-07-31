import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type:
    | 'project_created'
    | 'project_completed'
    | 'mentor_session'
    | 'debug_session'
    | 'interview_practice'
    | 'roadmap_started'
    | 'roadmap_completed'
    | 'badge_earned'
    | 'login';
  description: string;
  metadata: {
    projectId: mongoose.Types.ObjectId;
    badgeName: string;
    sessionDuration: number;
  };
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        'project_created',
        'project_completed',
        'mentor_session',
        'debug_session',
        'interview_practice',
        'roadmap_started',
        'roadmap_completed',
        'badge_earned',
        'login',
      ],
      required: true,
    },
    description: { type: String, required: true },
    metadata: {
      projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
      badgeName: String,
      sessionDuration: Number,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', activitySchema);
