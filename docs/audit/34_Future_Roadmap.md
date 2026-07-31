# Future Roadmap: IoT Copilot AI

This document outlines the strategic vision for the next iterations of the IoT Copilot platform.

---

## Phase 1: Near-Term Enhancements (Q3/Q4)

### 1. Monorepo Migration
- **Goal:** Resolve code duplication (specifically Zod schemas and TypeScript interfaces) by moving the `client` and `server` folders into an NPM/PNPM workspace with a shared `packages/common` folder.
- **Impact:** Drastically reduces the chance of bugs caused by the frontend and backend validation rules drifting out of sync.

### 2. In-Browser Hardware Simulation
- **Goal:** Integrate a WASM-based simulator like Wokwi.
- **Impact:** Users will be able to test the AI-generated C++ code on virtual Arduino/ESP32 boards directly in the browser without having to purchase physical hardware first. This will massively increase user retention and time-on-site.

### 3. Multimodal Vision Diagnostics
- **Goal:** Upgrade the Gemini Model implementation to `gemini-1.5-pro` and enable image uploads in the AI Debugger chat.
- **Impact:** Users can take a photo of their breadboard wiring, and the AI can visually identify if a resistor is plugged into the wrong GPIO pin or if an LED is backward.

---

## Phase 2: Medium-Term Expansion (Next Year)

### 1. Collaborative Projects
- **Goal:** Allow multiple users to edit the same project.
- **Implementation:** Introduce a `Team` Mongoose schema. Use WebSockets (Socket.io) instead of SSE to allow real-time collaborative text editing in the project code viewer, similar to Google Docs.

### 2. Physical Code Flashing (Web Serial API)
- **Goal:** Allow users to compile and flash their ESP32/Arduino directly from the web browser.
- **Implementation:** Utilize the experimental `Web Serial API` available in Chromium browsers to talk directly to the USB port. The server would compile the C++ code into a `.bin` file, send it to the client, and the client would push it over serial to the board.

### 3. Subscription Tier (Stripe Integration)
- **Goal:** Monetize the platform to offset the Gemini API token costs.
- **Implementation:** Add Stripe billing. Free tier gets rate-limited to `gemini-1.5-flash`. Pro tier gets unlimited access to `gemini-1.5-pro` and priority hardware simulation resources.

---

## Phase 3: Long-Term Vision

### The Enterprise IoT Copilot
Transition the tool from an educational platform for hobbyists to an enterprise tool for hardware teams.
- **Feature:** Connect the platform to AWS IoT Core or Azure IoT Hub.
- **Value:** The AI Copilot could monitor live telemetry data from a fleet of deployed physical sensors and alert engineers in natural language if anomalous readings suggest hardware failure in the field.
