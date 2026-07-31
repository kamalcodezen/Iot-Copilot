# Database Schema — IoT Copilot AI (MongoDB/Mongoose)

## User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, indexed),
  password: string (hashed),
  avatar: string (Cloudinary URL),
  role: 'user' | 'admin',
  skillLevel: 'beginner' | 'intermediate' | 'advanced',
  bio: string,
  socialLinks: { github: string, linkedin: string, twitter: string },
  badges: [{ name: string, earnedAt: Date }],
  stats: {
    totalProjects: number,
    completedProjects: number,
    learningStreak: number,
    totalSessions: number,
    totalHours: number,
    lastActive: Date
  },
  preferences: {
    theme: 'dark',
    emailNotifications: boolean,
    language: string
  },
  isVerified: boolean,
  refreshToken: string,
  resetPasswordToken: string,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: string,
  description: string,
  category: 'smart-home' | 'agriculture' | 'healthcare' | 'automation' | 'robotics' | 'other',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  status: 'planning' | 'in-progress' | 'completed' | 'paused',
  components: [{ name: string, quantity: number, link: string }],
  circuitDescription: string,
  code: string,
  images: [string],
  learningOutcomes: [string],
  progress: number, // 0-100
  timeline: { start: Date, end: Date },
  isPublic: boolean,
  likes: number,
  tags: [string],
  createdAt: Date,
  updatedAt: Date
}
```

## AIMemory Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  type: 'mentor' | 'debug' | 'interview' | 'roadmap' | 'recommendation',
  role: 'user' | 'assistant',
  content: string,
  metadata: {
    topic: string,
    projectId: ObjectId,
    codeSnippet: string,
    componentRefs: [string]
  },
  embedding: [number], // for vector search
  createdAt: Date
}
```

## LearningPath Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: string,
  description: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  modules: [{
    title: string,
    description: string,
    order: number,
    status: 'locked' | 'available' | 'in-progress' | 'completed',
    resources: [{ title: string, url: string, type: 'video' | 'article' | 'doc' }],
    estimatedHours: number
  }],
  progress: number,
  isActive: boolean,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Activity Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  type: 'project_created' | 'project_completed' | 'mentor_session' | 'debug_session' | 'interview_practice' | 'roadmap_started' | 'roadmap_completed' | 'badge_earned' | 'login',
  description: string,
  metadata: { projectId: ObjectId, badgeName: string, sessionDuration: number },
  createdAt: Date
}
```

## Comment Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  projectId: ObjectId (ref: Project, indexed),
  content: string,
  createdAt: Date,
  updatedAt: Date
}
```
