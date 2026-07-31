# Service Layer Documentation: IoT Copilot AI

This document outlines the Service Layer of the backend, which encapsulates all the core business logic of the application. 

## Overview
By extracting logic away from Express Controllers and into `server/src/services`, the backend adheres to the "Fat Model / Fat Service, Thin Controller" paradigm. This makes the code highly testable and reusable.

---

## 1. AI Service (`ai.ts`)
- **Purpose:** Manages all interactions with the Google Gemini API.
- **Key Responsibilities:**
  - Validating the `GEMINI_API_KEY`.
  - Exposing prompt-building factory functions (`buildMentorPrompt`, `buildDebugPrompt`, etc.).
  - Exposing `generateContent` for synchronous AI responses.
  - Exposing `generateContentStream` for streaming Server-Sent Events (SSE) back to the client.
  - Translating raw Google API errors (like Quota Exceeded) into human-readable, safe error messages.

## 2. Cloudinary Service (`cloudinary.ts`)
- **Purpose:** Handles external image hosting.
- **Key Responsibilities:**
  - Initializing the Cloudinary SDK using API credentials.
  - Providing an `uploadImage` function that takes a local file buffer (usually processed by `multer` in the route middleware) and uploads it to Cloudinary.
  - Returning the secure URL of the hosted image so it can be saved in the MongoDB `Project` or `User` document.

## 3. Email Service (`email.ts`)
- **Purpose:** Handles outbound transactional emails.
- **Key Responsibilities:**
  - Configuring a NodeMailer transport (likely using SMTP or an API like SendGrid/Resend).
  - Exposing functions like `sendPasswordResetEmail`.
  - Generating HTML email templates for consistent branding.

## 4. Memory Service (`memory.ts`)
- **Purpose:** Manages the AI's short-term and long-term conversation context.
- **Key Responsibilities:**
  - Fetching the last N messages from the `AIMemory` collection for a specific user.
  - Formatting these messages into a single string (or a structured array) that can be injected into the Gemini prompt context window.
  - Providing CRUD operations for saving new user prompts and AI responses to the database asynchronously.

## 5. Language Service (`language.ts`)
- **Purpose:** Assists the AI in detecting and matching user languages.
- **Key Responsibilities:**
  - Often uses a lightweight NLP library (like `franc` or `cld`) to detect the language of the incoming user string.
  - Passes this detected language string to the AI service (e.g., `buildAssistantPrompt`) to enforce that the AI responds in the exact same language and script, preserving a native-feeling experience for non-English speakers.

---

## Evaluation
- **Can it be simplified?** The separation of concerns here is excellent.
- **Suggested Improvements:** As the AI service grows, `ai.ts` (currently very large) could be split into a folder (`services/ai/`) containing `prompts.ts`, `api.ts`, and `streaming.ts`.
