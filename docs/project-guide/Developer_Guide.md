

<!-- Content from DEVELOPER_GUIDE.md -->

# Developer Guide

## How to Run Locally
1. Clone the repo.
2. `npm install` in both `client/` and `server/`.
3. Set up `.env` files based on `.env.example`.
4. Run `npm run dev` in both folders.

## How to Add an API Endpoint
1. Create a route in `server/src/routes/`.
2. Map it to a Controller in `server/src/controllers/`.
3. Put the actual logic in `server/src/services/`.
4. Validate input using `server/src/validators/`.
5. Finally, expose it to the frontend via `client/src/lib/api/`.

## How to Debug
- Backend: Use `console.log` or attach a Node debugger to port `9229`.
- Frontend: Use Chrome DevTools. Check the Network tab for failed `lib/api` requests.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- **Revision History:** Initial release (v1.0.0)


<!-- Content from CODING_STANDARDS.md -->

# Coding Standards

## Naming Conventions
- **Files/Folders:** `kebab-case` for routes/directories. `PascalCase` for React components (`Button.tsx`). `camelCase` for utils (`formatDate.ts`).
- **Variables/Functions:** `camelCase`.
- **Types/Interfaces:** `PascalCase`. Prefix interfaces only if necessary; generally prefer plain descriptive names (`User`, not `IUser`).

## Imports
- Use absolute imports (e.g., `@/components/ui/Button`) instead of relative hell (`../../../components/ui/Button`).

## Architecture Rules
1. **Frontend:** No direct `fetch()` or `axios` calls in components. Use `lib/api`.
2. **Backend:** Controllers do not talk to the database directly. Use Services.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)


<!-- Content from 13_Developer_Guide.md -->

# 13. Developer Guide

Welcome to the IoT Copilot engineering team. This guide outlines how to set up your environment, our coding standards, and how to debug the application.

## 1. Quick Start / Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamalcodezen/Iot-Copilot.git
   cd Iot-Copilot
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill out MONGODB_URI, BETTER_AUTH_SECRET, GEMINI_API_KEY
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   cp .env.local.example .env.local
   # Ensure NEXT_PUBLIC_API_URL is set to http://localhost:5000/api
   npm run dev
   ```

## 2. Coding Rules & Standards

### Frontend (Next.js & React)
- **Use the App Router:** All new pages must be created inside `client/src/app`.
- **Feature-Driven Architecture:** Do not dump everything into `components/`. If a component contains heavy business logic (e.g., `ProjectTimeline`), place it in `features/projects/components/`.
- **Styling:** Use Tailwind CSS exclusively. Use the `cn()` utility to merge dynamic classes safely. Do not use inline styles unless absolutely necessary for dynamic layout calculations.
- **Client Components:** Next.js App Router defaults to Server Components. If you need `useState` or `useEffect` (which is common in this app), you must add `'use client';` at the very top of the file.

### Backend (Express & Node.js)
- **Thin Controllers:** Controllers should only parse requests and format responses. Heavy business logic must live in `services/`.
- **Validation:** Always use Zod schemas in `validators/` to check incoming request bodies before they reach the controller.
- **Async/Await:** Do not use `.then()`. Use `async/await` and wrap route handlers in an error-catching utility or `try/catch` blocks.

## 3. How to Debug

### Frontend Debugging
- **React Developer Tools:** Use the browser extension to inspect component state, especially the Zustand `authStore`.
- **Framer Motion Issues:** If animations are glitching, ensure you are not passing `undefined` to SVG attributes (e.g., `r={node.r || 10}`). This will cause hydration/rendering errors.

### Backend Debugging
- **Better Auth:** If authentication fails, check the server console. Better Auth logs errors verbosely in development mode.
- **Gemini API:** If the AI features stop working, check if a `429 Quota Exceeded` error is being returned from Google. Ensure your `.env` contains a valid, funded API key.


<!-- Content from 22_Architecture_Refactor_Report_Part_3.md -->

# Complete Project Documentation Report - Part 3

> [!NOTE]
> This is Part 3 of the comprehensive technical report covering the recent architecture refactor. It covers AI Features, Database Flow, Backend endpoints, User Journey, Developer Guide, Code Examples, and the Final Summary.

## SECTION 10 — AI Features

### IoT AI Copilot
- **How user uses it**: The user accesses the `/ai` page or clicks the floating Copilot button. They type a question about IoT hardware or software.
- **What happens internally**:
  1. The user's prompt is captured by the UI.
  2. If using Server Actions: `sendAiMessageAction(message)` is called.
  3. If using streaming (for typing effect): The client connects to the SSE endpoint defined via `lib/api/ai-stream.ts`.
- **Backend Flow**:
  1. The Express route `POST /ai/message` or `GET /ai/stream` receives the prompt.
  2. The prompt is augmented with context (user's past projects, IoT domain specific instructions).
  3. Sent to the **Gemini API** for completion.
  4. Response is streamed back to the client.
- **Database Interaction**:
  - The conversation is saved in the `AIMemory` collection.
  - Previous messages are fetched from `AIMemory` to provide conversation history to the Gemini API.

---

## SECTION 11 — Database Flow

### Collections Used
1. **Users**: Stores credentials, profile data, roles, and preferences.
   - Written by: Registration, Profile Update.
   - Read by: Session validation, Profile views.
2. **Projects**: Stores IoT project details (code, hardware, descriptions).
   - Written by: `createProjectAction`, `updateProjectAction`.
   - Read by: Project Feed, User Profile.
3. **LearningPath**: Courses and modules.
   - Read heavily by `/learning` pages.
4. **Activity**: Tracks user progress, enrollments, and interactions.
5. **Community (Post / Comment)**: Forum data.
   - Relational logic: A `Comment` references a `Post` (via `postId`) and a `User` (via `authorId`).
6. **AIMemory**: Stores chat logs for the AI copilot.

---

## SECTION 12 — Backend Communication

Here are the primary backend endpoints consumed by the client's `lib/` layer:

- **Auth**
  - `POST /auth/register` (Registration)
  - `POST /auth/login` (Login)
  - `GET /auth/get-session` (Session validation)

- **Users**
  - `GET /users/:id` (Fetch profile)
  - `PUT /users/:id` (Update profile)

- **Projects**
  - `GET /projects` (List projects)
  - `POST /projects` (Create project)
  - `GET /projects/:id` (Get details)
  - `PUT /projects/:id` (Update)
  - `DELETE /projects/:id` (Delete)

- **AI**
  - `GET /ai/history` (Chat logs)
  - `POST /ai/message` (Send prompt)

- **Community / Learning**
  - `GET /community` (List posts)
  - `GET /learningPath` (List paths)

---

## SECTION 13 — User Journey

**Pretend I am a completely new user.**

1. **Landing Page**: You arrive at `Iot-copilot.com`. You see an overview of the platform's features (AI, Projects, Learning).
2. **Registration**: You click "Sign Up" and are taken to `/auth/register`. You enter your details. The backend creates your account and issues a session cookie.
3. **Dashboard**: You are redirected to `/dashboard`. Here you see an overview of your non-existent projects and recommended learning paths.
4. **Learning**: You click on "Learning" in the nav. You browse paths and click "Enroll" on "Intro to Arduino".
5. **AI Copilot**: While learning, you get stuck. You click the floating AI button, type "How do I wire a resistor to an LED?", and the AI streams back a detailed answer using Gemini.
6. **Community**: You want to share your progress, so you go to `/community`, click "New Post", and say hello.
7. **Projects**: You finish your first LED project. You go to `/projects/new`, upload your code snippet, hardware list, and a photo, and publish it.
8. **Profile**: You visit your profile `/profile` to admire your new project and update your avatar.

---

## SECTION 14 — Developer Guide

### Adding a New API (Query)
1. Navigate to `client/src/lib/api/`.
2. Create or open the relevant file (e.g., `devices.ts`).
3. Export an async function utilizing `protectedFetch` for authenticated calls.
4. Add the `"use server"` directive at the top if it's a new file.

### Adding a New Server Action (Mutation)
1. Navigate to `client/src/lib/actions/`.
2. Open/create the file (e.g., `devices.ts`).
3. Export an async function utilizing `serverMutation`.
4. Call `revalidatePath` to ensure the UI updates after the mutation.

### Adding a New Page
1. Create a folder in `client/src/app/`, e.g., `app/devices/page.tsx`.
2. Make it an async Server Component.
3. Call `const session = await requireAuth();` to protect it.
4. Call your new API function: `const devices = await getDevices();`.

---

## SECTION 15 — Code Examples

### 1. Creating a new API query (`lib/api/devices.ts`)
```typescript
"use server";
import { protectedFetch } from '../core/server';

export const getDevices = async () => {
  return await protectedFetch('/devices');
};
```

### 2. Creating a new Server Action (`lib/actions/devices.ts`)
```typescript
"use server";
import { serverMutation } from '../core/server';
import { revalidatePath } from 'next/cache';

export const addDeviceAction = async (data: any) => {
  const result = await serverMutation('/devices', data, 'POST');
  revalidatePath('/devices');
  return result;
};
```

### 3. Using them inside a Component (`app/devices/page.tsx`)
```tsx
import { getDevices } from '@/lib/api/devices';
import { addDeviceAction } from '@/lib/actions/devices';

export default async function DevicesPage() {
  const devices = await getDevices();

  return (
    <div>
      <h1>My Devices</h1>
      <ul>
        {devices.map(d => <li key={d.id}>{d.name}</li>)}
      </ul>
      <form action={addDeviceAction}>
        <input name="name" type="text" />
        <button type="submit">Add Device</button>
      </form>
    </div>
  );
}
```

---

## SECTION 16 — Final Summary

### Complete Folder Tree (lib)
```text
client/src/lib/
 ├── core/
 │   ├── server.ts
 │   └── session.ts
 ├── actions/
 │   ├── admin.ts, ai.ts, community.ts, learning.ts, project.ts, user.ts
 └── api/
     ├── admin.ts, ai-stream.ts, ai.ts, client-api.ts, community.ts, dashboard.ts, learning.ts, project.ts, user.ts
```

### Architecture Advantages
- **Security**: Sensitive tokens remain on the server.
- **Performance**: Heavy data fetching is done on the server (Server Components) before shipping HTML to the client.
- **Maintainability**: Clear separation between fetching (`lib/api`) and mutating (`lib/actions`).

### Coding Standards & Naming Conventions
- **Action Files**: Must include `"use server"`. Functions should be suffixed with `Action` (e.g., `createProjectAction`).
- **API Files**: Functions should be prefixed with `get` (e.g., `getProfile`).
- **Routing**: Use Next.js App Router conventions (`page.tsx`, `layout.tsx`).

### Future Scalability
This decoupled structure allows the Next.js frontend to scale independently from the Express backend. If the backend needs to switch to a microservice architecture in the future, only the `API_URL` and routes inside the `lib/` wrappers will need to be updated. The Next.js components remain untouched.
