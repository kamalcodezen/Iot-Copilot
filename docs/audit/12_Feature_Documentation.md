# Feature Documentation: IoT Copilot AI

This document provides a deep dive into every core feature of the platform, explaining why it exists, how it works under the hood, and its value proposition.

---

## 1. AI IoT Mentor (The Core Feature)
- **Why it exists:** Beginners often get stuck on basic concepts (e.g., pull-up resistors, I2C vs SPI). Traditional forums can be hostile or assume prior knowledge. 
- **How it works:** Uses `buildMentorPrompt` via the Gemini API. It injects the user's skill level (e.g., 'beginner') and their active project context so the AI doesn't have to ask "What board are you using?". Responses are streamed back via SSE for a conversational feel.
- **Business/User Value:** Lowers the barrier to entry for electronics engineering. Provides a safe, judgment-free zone to ask "stupid" questions.

## 2. AI Debugger
- **Why it exists:** Hardware debugging is notoriously difficult because errors could be in the code, the wiring, the power supply, or a faulty component.
- **How it works:** A structured form collects initial state (`board`, `components`, `error`). The AI uses `buildDebugPrompt` to act as a diagnostic engineer. It forces a systematic approach (e.g., checking power first, then logic).
- **Business/User Value:** Saves hours of frustration. Teaches users *how* to debug methodically rather than just giving them the answer.

## 3. Project Planner
- **Why it exists:** Users often have ideas but don't know what components to buy or how to structure the architecture.
- **How it works:** The user describes an idea (e.g., "Automated plant waterer"). The AI uses `buildProjectPlanPrompt` to generate a full spec, including a bill of materials (BOM), circuit description, code architecture, and timeline. The server saves this output directly into the `Projects` MongoDB collection.
- **Business/User Value:** Turns vague ideas into actionable execution plans.

## 4. Component Recommender
- **Why it exists:** Navigating the ecosystem of sensors and microcontrollers (ESP8266 vs ESP32 vs Arduino Uno) is overwhelming.
- **How it works:** Triggered via `buildComponentPrompt`. It evaluates a user's budget and project idea and suggests the exact hardware they should buy, including reasoning.
- **Business/User Value:** Prevents users from buying the wrong hardware, saving them money and time.

## 5. Dynamic Learning Paths
- **Why it exists:** Static tutorials don't adapt to what a user already knows.
- **How it works:** The AI evaluates user goals via `buildRoadmapPrompt` and returns a structured JSON curriculum. This is parsed by the backend and saved into the `LearningPath` collection.
- **Business/User Value:** Provides structured education, keeping users engaged longer on the platform (retention).

## 6. Interview Coach
- **Why it exists:** Helps aspiring professionals transition from hobbyists to employable engineers.
- **How it works:** Two-step process. First, `buildInterviewPrompt` generates 5 technical questions based on a topic. The user answers. Second, `buildInterviewFeedbackPrompt` grades the answer 1-10, highlighting strengths and missing knowledge.
- **Business/User Value:** Highly valuable for university students and job seekers.

## 7. Global AI Assistant
- **Why it exists:** Context-switching is bad for productivity. If a user is looking at code, they shouldn't have to navigate to a chat page.
- **How it works:** A floating UI component that reads the current URL (e.g., `/dashboard`) and passes it to `buildAssistantPrompt`. It can also detect the user's language and respond natively without translation APIs.
- **Business/User Value:** Creates a truly "Agentic" feel, where the platform feels "alive" and aware of what the user is doing.

## 8. Community Project Hub
- **Why it exists:** To foster a maker community and allow users to show off their work.
- **How it works:** Users can set a project to `isPublic: true`. These appear on the `/community` route. Other users can view, like, and comment on them.
- **Business/User Value:** Drives network effects, organic growth, and user retention.

---

## Future Feature Improvements
- **Hardware Simulation:** Integrating a WASM-based circuit simulator (like Wokwi) so users can test AI-generated code directly in the browser before buying physical components.
- **Image/Schematic Parsing:** Allowing the AI to "see" a user's wiring diagram using Gemini 1.5 Pro's multimodal capabilities to spot misplaced wires.
