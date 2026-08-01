import mongoose, { Document, Schema } from 'mongoose';

export type AIMemoryType = 'mentor' | 'debug' | 'interview' | 'roadmap' | 'recommendation';

export interface IAIMemory extends Document {
  userId: string;
  type: AIMemoryType;
  role: 'user' | 'assistant';
  content: string;
  metadata: {
    topic?: string;
    projectId?: mongoose.Types.ObjectId;
    codeSnippet?: string;
    componentRefs?: string[];
  };
  createdAt: Date;
}

const aiMemorySchema = new Schema<IAIMemory>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['mentor', 'debug', 'interview', 'roadmap', 'recommendation'],
      required: true,
    },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    metadata: {
      topic: { type: String, default: '' },
      projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
      codeSnippet: { type: String, default: '' },
      componentRefs: [{ type: String }],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

aiMemorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IAIMemory>('AIMemory', aiMemorySchema);
