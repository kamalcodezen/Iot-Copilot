# Information Architecture — IoT Copilot AI

## Site Map
```
/                           → Landing Page
/auth/login                 → Login
/auth/register              → Register
/auth/forgot-password       → Forgot Password
/dashboard                  → Dashboard (protected)
/ai-mentor                  → AI Mentor Chat (protected)
/learning-path              → Learning Roadmap (protected)
/projects                   → My Projects (protected)
/projects/new               → New Project (protected)
/projects/:id               → Project Details (protected)
/projects/:id/edit          → Edit Project (protected)
/explore                    → Explore Projects (public)
/ai-debugger                → AI Debugger (protected)
/interview-coach            → Interview Practice (protected)
/community                  → Community (protected)
/profile/:id                → User Profile (protected)
/settings                   → User Settings (protected)
/admin                      → Admin Dashboard (admin only)
/admin/users                → Admin Users (admin only)
/admin/reports              → Admin Reports (admin only)
```

## Content Hierarchy
```
Dashboard
├── Stats Bar (streak, projects, sessions, hours)
├── Learning Progress Chart (30-day line graph)
├── Recent Activity (timeline feed)
├── AI Suggestions (smart cards)
├── Project Progress (cards with status)
└── Skill Radar (radar chart)

AI Mentor Chat
├── Conversation Thread
│   ├── User Messages
│   └── AI Responses (code, diagrams, links)
├── Suggested Questions
├── History Sidebar
└── Memory Context Indicator

Project Detail
├── Project Header (title, status, difficulty)
├── Description
├── Components Used
├── Circuit Diagram Description
├── Code Files
├── Progress Tracker
├── Timeline
└── AI Suggestions for Improvement
```
