import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  userId: string;
  projectId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

commentSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', commentSchema);
