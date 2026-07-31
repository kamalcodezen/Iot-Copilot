# AI System Documentation: IoT Copilot AI

This document explains how the Gemini AI integration works under the hood, from prompt generation to error handling.

---

## Core AI Architecture

The AI system is built around the `@google/genai` SDK and uses the `GEMINI_MODEL` (defined in `.env`) to process requests. All core AI logic is located in `server/src/services/ai.ts`.

### 1. How AI Works
The system acts as a specialized wrapper around Gemini. Instead of exposing a raw chat interface, the application enforces specific "roles" (e.g., Mentor, Debugger, Interviewer) by injecting highly engineered system prompts. The AI is stateless by default; the application manually injects conversational context (memory) into every prompt.

### 2. How Prompts are Generated
Prompts are built using factory functions in `ai.ts`. Each function takes user inputs and context and returns a formatted string.
- `buildMentorPrompt(message, skillLevel, context)`: Instructs the AI to act as a Senior IoT Engineer, teaching the "why" and adapting to the user's skill level.
- `buildDebugPrompt(problem, board, components, error)`: Instructs the AI to be a methodical Hardware Debug Engineer, asking clarifying questions.
- `buildInterviewPrompt(level, topic)`: Generates 5 real-world interview questions.
- `buildAssistantPrompt(message, page, pageInfo, history, language)`: The general Copilot prompt that uses the user's current page context and enforces language matching.

### 3. How Requests Reach Gemini
- The client makes an HTTP request to the Express backend (e.g., `/api/ai/chat`).
- The controller extracts the user's message and fetches context (like active projects or past conversations from the `AIMemory` collection).
- The controller calls the appropriate prompt builder function.
- The controller passes the assembled prompt to `generateContent` or `generateContentStream`.
- The `getGenAI()` singleton initializes the SDK using `env.GEMINI_API_KEY`.
- The request is sent to Google's servers with a `maxOutputTokens` config of 4096.

### 4. How Streaming Works
For a responsive UI (like typing effects), the system uses Server-Sent Events (SSE).
- `generateContentStream` uses the SDK's `generateContentStream` method, returning an `async generator`.
- As chunks of text arrive from Gemini, they are yielded.
- The Express controller iterates over this generator and writes `data: {chunk}\n\n` to the HTTP response stream (`res.write()`).
- The Next.js client reads this stream and incrementally updates the UI state.

### 5. How Context & Memory Works
Gemini is inherently stateless in this API mode.
- **Short-term memory:** The client sends recent chat history, or the server fetches the last N messages from the `AIMemory` MongoDB collection.
- **Long-term memory:** User preferences (skill level, hardware) are fetched from the `User` document.
- **Context injection:** This data is concatenated into the `context` or `history` string inside the prompt builders before sending to Gemini.

### 6. Error Handling
The `handleGeminiError` function intercepts raw API errors and translates them into user-friendly messages:
- **429 / Quota / Resource Exhausted:** Throws "AI quota exceeded. Please try again later."
- **400 / Invalid API Key:** Throws "AI service is not configured."
- **503 / Unavailable:** Throws "AI provider error. Please try again."

### 7. Quota Handling
Quota is handled entirely by catching Google's `429` errors. There is no local token counting or rate-limiting implemented specifically for AI tokens in `ai.ts`, though the general Express rate limiter prevents API abuse at the network level. If the quota is hit, the user is notified via the translated error message.
