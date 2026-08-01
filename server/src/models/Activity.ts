import mongoose, { Document, Schema } from 'mongoose';
import { ACTIVITY_TYPES } from '../utils/constants';
import type { ActivityType } from '../utils/constants';

export interface IActivity extends Document {
  userId: string;
  type: ActivityType;
  description: string;
  metadata: {
    projectId?: mongoose.Types.ObjectId;
    badgeName?: string;
    sessionDuration?: number;
  };
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [...ACTIVITY_TYPES],
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
