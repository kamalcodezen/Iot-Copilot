# Extensibility Guide: IoT Copilot AI

This document provides a framework for scaling the platform. It outlines how a developer can safely add new features, models, and AI capabilities without breaking existing functionality.

---

## 1. Adding a New Database Model

Suppose you want to add a "Teams" feature so users can collaborate on projects.

**Step 1: Define the Mongoose Schema**
Create `server/src/models/Team.ts`. Ensure it references the Better Auth user ID as a string, not an ObjectId, since Better Auth uses strings for IDs by default.
```typescript
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, ref: 'User' }], // String ID for Better Auth compat
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

export const Team = mongoose.model('Team', teamSchema);
```

**Step 2: Define Zod Validation**
Create `server/src/validators/team.ts` (and if not using a monorepo, duplicate it to `client/src/utils/validation.ts`).

**Step 3: Create Controller & Route**
Create `server/src/controllers/teamController.ts` and `server/src/routes/team.ts`. Wire the route into `app.ts` (`app.use('/api/teams', teamRoutes)`). Ensure you apply the `authenticate` middleware to protect the routes.

---

## 2. Adding a New AI Feature

Suppose you want to add an "AI Code Review" button that scans a user's C++ code and suggests optimizations.

**Step 1: Add the Prompt Builder**
Open `server/src/services/ai.ts`. Export a new function:
```typescript
export function buildCodeReviewPrompt(code: string): string {
  return `You are a Senior Embedded C++ Developer. Review the following code for memory leaks, inefficient loops, and logic errors. Code: ${code}`;
}
```

**Step 2: Add the Backend Route**
In `server/src/routes/ai.ts` and `aiController.ts`, create a POST endpoint `/api/ai/review-code`. Ensure you apply `aiRateLimit` to prevent abuse. If you want the response to be instant, use `generateContent`. If it's a long review, use `generateContentStream` and SSE.

**Step 3: Build the UI**
In the client `ProjectDetails` component, add a "Review Code" button. Connect it to a React Query mutation or an SSE listener depending on how you implemented Step 2.

---

## 3. Adding Support for More Hardware (e.g., Raspberry Pi)

Currently, the AI is optimized for microcontrollers (Arduino/ESP32). To extend this to Single Board Computers (SBCs):

**Step 1: Update the Context Injection**
The AI performs best when it has context. If a user is working on a Raspberry Pi, the AI should know they are using Linux, Python, and `RPi.GPIO` instead of C++ and `analogRead()`. 
Update the `buildMentorPrompt` to explicitly ask the LLM to format code for SBCs if the user's active project lists "Raspberry Pi" in its components array.

**Step 2: UI Additions**
Update any dropdowns or `Badge` components on the frontend to explicitly include "Raspberry Pi" or "Linux" as skill/hardware categories.

---

## 4. Swapping the LLM Provider

If you wish to move away from Google Gemini to OpenAI (GPT-4o) or Anthropic (Claude 3.5 Sonnet):

1. Go to `server/src/services/ai.ts`.
2. This is the *only* file you need to change. The controllers and UI are completely abstracted away from the LLM provider.
3. Replace the `@google/genai` SDK with the OpenAI SDK.
4. Update `generateContentStream` to parse the specific chunk formatting of the new provider and yield it to the controller. The Express SSE implementation in the controller requires zero changes as long as the service yields string chunks.
