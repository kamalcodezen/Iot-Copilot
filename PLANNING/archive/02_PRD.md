# Product Requirements Document — IoT Copilot AI

## 1. User Stories

### Authentication
- US-01: User can register with email/password
- US-02: User can log in with email/password
- US-03: User can log in with Google OAuth
- US-04: User can reset forgotten password
- US-05: User stays logged in with JWT refresh tokens

### Dashboard
- US-06: User sees learning statistics (streak, completed, progress %)
- US-07: User sees a learning progress graph (last 30 days)
- US-08: User sees recent activity feed
- US-09: User sees AI-generated suggestions for next steps
- US-10: User sees project progress cards
- US-11: User sees a skill radar chart

### AI Mentor
- US-12: User can ask any IoT question
- US-13: AI responds like a Senior IoT Engineer
- US-14: AI remembers context from previous conversations
- US-15: AI can generate code snippets, wiring diagrams, and explanations

### AI Learning Path
- US-16: User can generate a personalized learning roadmap
- US-17: Roadmap adapts based on user skill level (Beginner/Intermediate/Advanced)
- US-18: Roadmap shows milestones with estimated completion time

### AI Component Recommendation
- US-19: User describes a project and gets component recommendations
- US-20: Recommendations include board, sensors, modules with reasons
- US-21: Direct links to purchase (Amazon, AliExpress, etc.)

### AI Project Planner
- US-22: User describes an idea and gets a complete project plan
- US-23: Plan includes components, circuit diagram description, code structure, timeline

### AI Debugger
- US-24: User describes a problem and gets step-by-step diagnosis
- US-25: Debugger asks clarifying questions like a real engineer
- US-26: Provides code fixes, wiring fixes, and testing steps

### AI Interview Coach
- US-27: User generates IoT interview questions
- US-28: User can practice answering and get feedback
- US-29: Questions adapt to user's experience level

### Projects (CRUD)
- US-30: User can create a new project
- US-31: User can edit an existing project
- US-32: User can delete a project
- US-33: User can view all their projects with pagination
- US-34: User can search projects
- US-35: User can filter by status, category, difficulty

### Community
- US-36: User can view public projects
- US-37: User can like/favorite projects
- US-38: User can comment on projects

### Profile
- US-39: User can view their profile
- US-40: User can edit profile (avatar, bio, social links)
- US-41: User can see their skill badges

### Admin
- US-42: Admin can view all users
- US-43: Admin can manage reported content
- US-44: Admin can view platform analytics

## 2. Non-Functional Requirements
- NFR-01: Page load < 2s (LCP)
- NFR-02: 99.9% uptime for API
- NFR-03: Responsive on mobile (320px+), tablet, desktop
- NFR-04: Dark mode only (consistent brand)
- NFR-05: AI responses < 5s generation time
- NFR-06: Secure JWT with HTTP-only cookies
- NFR-07: Rate limiting on AI endpoints
