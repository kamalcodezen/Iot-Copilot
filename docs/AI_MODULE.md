# AI Module Documentation

The AI capabilities are powered by the **Google Gemini API**.

## Core Features
- **AI Mentor:** Chat interface answering queries about IoT development, electronics, and coding.
- **AI Debugger:** Analyzes user code snippets and hardware errors, providing structured fixes.

## Prompt Flow
1. Frontend captures user input.
2. The request is enriched with contextual data (e.g., current project stack).
3. The Backend Service formats the system instructions and user prompt.
4. Sent to Gemini API.

## Streaming
For a fast UX, the backend streams the Gemini response back to the client using Server-Sent Events (SSE) or chunked transfer encoding, allowing real-time text rendering.

## Error Handling
- Rate limits or API outages are caught in the backend.
- The user is shown a friendly fallback message via a toast notification.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [FRONTEND.md](./FRONTEND.md)
- **Revision History:** Initial release (v1.0.0)
