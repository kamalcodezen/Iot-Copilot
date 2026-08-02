# API Architecture — IoT Copilot AI

## Base URL
```
Development: http://localhost:5000/api
Production: /api
```

## Authentication Routes
```
POST   /api/auth/register           → Register new user
POST   /api/auth/login              → Login user
POST   /api/auth/logout             → Logout (clear cookie)
POST   /api/auth/google             → Google OAuth
POST   /api/auth/refresh            → Refresh access token
POST   /api/auth/forgot-password    → Send reset email
POST   /api/auth/reset-password     → Reset password
GET    /api/auth/me                 → Get current user
```

## User Routes
```
GET    /api/users/:id               → Get user profile
PUT    /api/users/:id               → Update profile
PUT    /api/users/avatar            → Upload avatar (Cloudinary)
GET    /api/users/:id/projects      → Get user's projects
GET    /api/users/:id/badges        → Get user badges
```

## Project Routes
```
GET    /api/projects                → Get all user projects (paginated)
GET    /api/projects/:id            → Get single project
POST   /api/projects                → Create project
PUT    /api/projects/:id            → Update project
DELETE /api/projects/:id            → Delete project
PATCH  /api/projects/:id/progress   → Update progress
POST   /api/projects/:id/like      → Toggle like
```

## AI Routes
```
POST   /api/ai/chat                 → AI Mentor chat (streaming)
POST   /api/ai/chat/history         → Get chat history
POST   /api/ai/roadmap              → Generate learning roadmap
POST   /api/ai/recommend-components → Recommend components
POST   /api/ai/plan-project         → Generate project plan
POST   /api/ai/debug                → Debug problem
POST   /api/ai/interview            → Generate interview questions
POST   /api/ai/interview/submit     → Submit answer for feedback
POST   /api/ai/recommend            → Recommend next topics
```

## Learning Path Routes
```
GET    /api/learning-paths          → Get user's learning paths
GET    /api/learning-paths/:id      → Get single path
POST   /api/learning-paths          → Create learning path
PUT    /api/learning-paths/:id      → Update progress
DELETE /api/learning-paths/:id      → Delete path
```

## Activity Routes
```
GET    /api/activities              → Get recent activities (paginated)
GET    /api/activities/stats        → Get user stats
```

## Community Routes
```
GET    /api/community/projects      → Get public projects (paginated, search, filter)
GET    /api/community/projects/:id  → Get public project detail
POST   /api/community/projects/:id/comments → Add comment
GET    /api/community/projects/:id/comments → Get comments
```

## Admin Routes
```
GET    /api/admin/users             → Get all users
PATCH  /api/admin/users/:id/role    → Update user role
DELETE /api/admin/users/:id         → Delete user
GET    /api/admin/stats             → Platform statistics
GET    /api/admin/reports           → Get reported content
```

## Response Format
```typescript
// Success
{
  success: true,
  data: T,
  message?: string,
  pagination?: { page: number, limit: number, total: number, pages: number }
}

// Error
{
  success: false,
  error: string,
  details?: any
}

// AI Stream
// Server-Sent Events (SSE)
event: token
data: { token: string }

event: done
data: { full: string }

event: error
data: { error: string }
```
