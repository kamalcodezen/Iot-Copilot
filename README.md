# IoT Copilot

**IoT Copilot: a full-stack AI engineering suite built as a decoupled Next.js and Express architecture.**

## 1. Project Title & Tagline
**IoT Copilot**: An intelligent, AI-powered companion designed to simplify the design, learning, and deployment of Industrial Internet of Things (IIoT) systems by unifying hardware schematics, cloud integrations, and software debugging into a single platform.

## 2. Problem Statement
IoT development is notoriously fragmented across multiple domains: hardware wiring diagrams, microcontroller IDEs, cloud infrastructure setups, and isolated debugging tools. This increases context-switching, slows down rapid prototyping, and creates a steep learning curve for developers transitioning into hardware engineering.

IoT Copilot targets students, software engineers, and hardware architects by providing one platform for:
- **Design** (AI-generated project architecture and component recommendations)
- **Debugging** (Log analysis and root-cause identification for sensors/MCUs)
- **Education** (Personalized learning paths, mock interviews, and an interactive AI Mentor)

## 3. Solution
IoT Copilot combines a highly interactive frontend with a robust, scalable Express backend backed by MongoDB, Better Auth, and Groq AI services.

At a high level:
- Users authenticate securely via Better Auth.
- The Next.js frontend utilizes Server Actions and parallel data fetching for rapid time-to-interactive.
- AI pipelines generate interactive chat responses, project roadmaps, and hardware debugging solutions.
- The Express backend abstracts complex business logic and normalizes all database and AI interactions.
- A comprehensive event-sourcing ledger (Activity model) tracks user progress across the platform.

## 4. Key Features
- **AI Mentor chat** with real-time Server-Sent Events (SSE) streaming responses.
- **AI Debugger pipeline** that analyzes stack traces, compiler errors, and sensor logs to identify root causes and suggest code fixes.
- **Project Planner** generating complete IoT architectures (MCU, sensors, milestones) based on natural language prompts.
- **Interview Coach** simulating technical IoT engineering interviews with strict evaluation scoring.
- **Learning Path engine** generating personalized, modular curriculum based on user activity history.
- **High-performance Dashboard** utilizing `Promise.all` parallel server actions for instantaneous data aggregation.
- **Glassmorphic UI** featuring Framer Motion micro-animations and Lenis smooth scrolling.
- **Secure session management** using HTTP-Only cookies via Better Auth, completely eliminating local-storage JWT risks.

## 5. Tech Stack
- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Lenis (Smooth Scrolling), Recharts, Zustand.
- **Backend:** Node.js, Express.js, TypeScript.
- **Datastore:** MongoDB Atlas via Mongoose ODM.
- **AI:** Groq SDK (Llama 3.3).
- **Auth:** Better Auth (native MongoDB adapter).
- **State Management:** Zustand (for reactive client-side UI caching).

## 6. System Architecture

**High-Level System**
The system is cleanly decoupled. The Next.js client handles all presentation, UI state, and user interactions. The Express backend handles all authorization constraints, Mongoose queries, and Groq API interactions.

**AI Processing Pipeline**
Prompts are enriched with system context on the Express backend before being dispatched to Groq. Responses are formatted either as strict JSON (for roadmaps and debugging) or streamed directly back through the Express pipeline to the client (for chat).

**Authentication Layer**
Better Auth natively manages the `user` and `session` collections directly in MongoDB, bypassing Mongoose to avoid schema collisions, ensuring a highly performant and secure identity lifecycle.

## 7. Core Pipelines
**Chat pipeline:**
1. User message posted to `/api/ai/chat`.
2. The Express controller injects a strict IoT System Prompt.
3. Groq processes the query and generates a response stream.
4. Express pipes the chunks directly to the client via `Content-Type: text/event-stream`.
5. The Next.js client natively renders the incoming stream to the UI.

**Dashboard rendering pipeline:**
1. Next.js component mounts and verifies the Zustand auth state.
2. Parallel Server Actions (`getActivityStats`, `getActivities`, `getProjects`) are fired simultaneously.
3. Server Fetch utilities attach the HTTP-only cookie and forward requests to Express.
4. Mongoose executes optimized aggregations (e.g., matching by `user` and sorting by `createdAt: -1`).
5. Client hydrates the Recharts and Framer Motion components instantly.

**Debugging pipeline:**
1. User pastes a hardware log into the UI.
2. The payload is sent to `/api/ai/debug`.
3. Groq analyzes the stack trace and generates a structured JSON fix.
4. The client renders the specific root cause and code correction.

## 8. Project Structure
```text
client/
  src/
    app/            # Next.js App Router (Pages & Layouts)
    features/       # Domain-specific UI (ai, dashboard, projects)
    components/     # Reusable UI & Layout shells
    lib/            # Server actions, API wrappers, Core fetchers
    store/          # Zustand global state
server/
  src/
    controllers/    # Request parsing & HTTP response formatting
    routes/         # Express router definitions
    services/       # Core business logic & AI interactions
    models/         # Mongoose schemas
    middlewares/    # Auth, Validation (Zod), Error Handling
    config/         # Better Auth & DB initialization
docs/               # Numbered Project Learning Path (01-11)
```

## 9. How the System Works
- User signs in with Better Auth credentials.
- The `useAuthStore` fetches the session and redirects the user to the Dashboard.
- The user accesses tools (AI Mentor, Debugger, Learning Paths, Projects).
- Client wrappers securely forward requests with HTTP-Only cookies to the Express backend.
- The backend validates access via middleware and invokes the corresponding service.
- The service interacts with MongoDB or Groq, processes the result, and returns it to the client.
- The client UI updates reactively using Framer Motion for polished transitions.

## 10. Installation
```bash
git clone https://github.com/kamalcodezen/Iot-Copilot.git
cd Iot-Copilot

# Install Backend
cd server
npm install

# Install Frontend
cd ../client
npm install
```

## 11. Running the Project
```bash
# Start Backend
cd server
npm run dev

# Start Frontend (in a new terminal)
cd client
npm run dev
```

## 12. Environment Variables
Required variables to run the current code paths:

**Backend (`server/.env`)**
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=
```

**Frontend (`client/.env.local`)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 13. Performance Optimizations
- **Parallel Data Fetching:** Dashboard components utilize `Promise.all` across Server Actions to prevent sequential request waterfalls.
- **Streaming AI Responses:** The AI Mentor utilizes SSE to render text instantly, eliminating long-polling perceived latency.
- **Client-Side Caching:** Zustand acts as a reactive cache for the user session, preventing redundant `/api/auth/get-session` calls on every render.
- **Database Indexing:** Mongoose schemas employ strategic compound indexes (e.g., `{ user: 1, createdAt: -1 }` on Activities) to ensure rapid timeline rendering as user data grows.
- **Smooth Rendering:** Lenis scroll hijacking combined with hardware-accelerated Framer Motion guarantees 60fps UX across all platforms.

## 14. Performance Benchmarking & Architecture Decisions
IoT Copilot uses a decoupled Next.js + Express architecture to separate the presentation layer from heavy backend processing and AI streaming.

A major architectural shift involved moving from sequential client-side `fetch` calls to parallelized Server Actions. By shifting data aggregation to `Promise.all` on the server and utilizing native Express middleware for security, the Dashboard's "Time to Interactive" (TTI) was significantly reduced.

This architecture ensures that the backend can scale independently (e.g., for heavy AI processing or WebSockets) without bogging down the Next.js React tree, while maintaining strict separation of concerns via thin controllers and thick service layers.

## 15. Rights and License
Repository ownership: This repository belongs to kamalcodezen.
License status: No top-level LICENSE file is currently present.
Rights notice: Until a license is explicitly added, all rights are reserved by the repository owner.
Third-party notice: External services, SDKs, logos, and trademarks used by this project remain under their respective licenses and terms.
