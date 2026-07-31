# IoT Copilot AI

> Your AI Senior IoT Engineer — Learn, build, and debug IoT projects with personalized AI guidance.

## Overview

IoT Copilot AI is a full-stack Agentic AI platform that helps beginners and intermediate learners master IoT through personalized AI mentorship. Instead of scattered YouTube tutorials, forum posts, and documentation, it provides a single intelligent platform that acts like an experienced Senior IoT Engineer.

## Architecture

```
iot-copilot/
├── PLANNING/           # Architecture & planning documents
├── server/             # Express.js + TypeScript backend
│   ├── src/
│   │   ├── config/     # DB, env, cloudinary config
│   │   ├── models/     # Mongoose schemas (6 models)
│   │   ├── routes/     # REST API routes (8 modules)
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/  # Auth, admin, validation, rate limiting
│   │   ├── services/   # Gemini AI, Cloudinary, Email, Memory
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── client/             # Next.js 16 + React 19 frontend
│   ├── src/
│   │   ├── app/        # App router pages (15+ routes)
│   │   ├── components/ # UI, Layout, Landing, Dashboard, AI, Projects
│   │   ├── lib/        # Axios, utils, validations (Zod)
│   │   ├── services/   # API service layer
│   │   ├── store/      # Zustand state management
│   │   └── types/      # TypeScript interfaces
│   └── package.json
└── .gitignore
```

## Tech Stack

### Frontend
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, Framer Motion
- TanStack React Query, Recharts
- Zustand, React Hook Form, Zod
- Lucide Icons, React Hot Toast

### Backend
- Node.js, Express.js, TypeScript
- MongoDB, Mongoose
- Better Auth (JWT + refresh tokens)
- Google Gemini AI API
- Cloudinary (image upload)
- Nodemailer (emails)

## Features

1. **AI IoT Mentor** — Personalized IoT explanations with memory
2. **AI Learning Path** — Dynamic roadmap generation
3. **Component Recommender** — Smart hardware suggestions
4. **Project Planner** — Complete IoT project architecture
5. **AI Debugger** — Step-by-step diagnostic engineer
6. **Interview Coach** — Real IoT interview practice with feedback
7. **Progress Memory** — Context-aware AI responses
8. **Recommendation Engine** — Smart next-topic suggestions

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Google Gemini API key
- Cloudinary account (for images)

### 1. Clone & Install
```bash
git clone <repo-url>
cd iot-copilot

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Variables
```bash
# server/.env
cp server/.env.example server/.env
# Fill in: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, etc.

# client/.env.local
cp client/.env.example client/.env.local
# Fill in: NEXT_PUBLIC_API_URL
```

### 3. Run Development
```bash
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client
cd client && npm run dev
```

Visit http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| POST | /api/ai/chat | AI Mentor (SSE streaming) |
| POST | /api/ai/debug | AI Debugger (SSE streaming) |
| POST | /api/ai/roadmap | Generate learning path |
| POST | /api/ai/interview | Generate interview questions |
| CRUD | /api/projects | Project management |
| GET | /api/activities/stats | User dashboard stats |
| GET | /api/community/projects | Public projects |
| GET | /api/admin/stats | Admin analytics |

## Database Models

- **User** — Auth, profile, stats, badges, preferences
- **Project** — CRUD, components, progress, timeline
- **AIMemory** — Conversation history, context, metadata
- **LearningPath** — Modules, resources, progress tracking
- **Activity** — User activity feed and analytics
- **Comment** — Community project comments
