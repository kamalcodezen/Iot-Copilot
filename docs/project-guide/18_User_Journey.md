# 18. User Journey

This document explores the typical pathways different user archetypes take through the IoT Copilot platform.

## 1. The Guest Journey (Unauthenticated)

**Goal:** Understand what the platform does and evaluate if it's worth signing up.

1. **Discovery:** Arrives at the landing page (`/`).
2. **Engagement:** Reads the "Intelligence for Connected Industry" hero text. Sees the live SVG network animation demonstrating edge-to-cloud connectivity.
3. **Exploration:** Scrolls down to view the features section: AI Mentor, Debugger, Project Planner.
4. **Decision:** Clicks the magnetic "Start Building Free" CTA button.
5. **Onboarding:** Is routed to `/auth/register`. The guest fills out their details, successfully authenticates via Better Auth, and is transitioned into a "Logged-in User".

## 2. The Learner / Student Journey

**Goal:** Learn IoT fundamentals and successfully build a beginner hardware project.

1. **Dashboard Check-in:** Logs in and lands on `/dashboard`. Sees their Learning Activity chart and a "Skill Radar" that is currently empty.
2. **AI Recommendation:** Notices an AI Suggestion to try the "Learning Path".
3. **Learning Module:** Navigates to `/learning-path` and completes a module on Basic Sensors.
4. **Project Creation:** Navigates to `/projects/new` and uses the AI Planner to generate a "Smart Weather Station" project.
5. **Execution & Mentorship:** While building, the student gets stuck writing I2C code for a sensor. They open `/ai-mentor`, paste their code, and ask for help. The Gemini AI provides the corrected C++ code.
6. **Completion:** The student marks milestones as completed in the Project timeline, which updates their global stats (Streak, Total Projects) on the dashboard.

## 3. The Professional Engineer Journey

**Goal:** Rapidly prototype an architecture or debug a complex integration issue.

1. **Bypassing Basics:** Logs in and immediately navigates to the `/ai-debugger`.
2. **Debugging:** The engineer pastes a dense MQTT broker stack trace and a snippet of their Node.js edge script. The AI quickly highlights a misconfigured Keep-Alive interval.
3. **Architecture Planning:** The engineer navigates to the Projects feature to map out a new Enterprise deployment. Instead of writing tasks manually, they prompt the AI to generate a full roadmap including OTA (Over-The-Air) updates, AWS IoT Core integration, and Edge ML deployment.
4. **Interview Prep:** The engineer is preparing for a Senior Solutions Architect role and uses the `/interview-coach` to run a mock interview on IoT Security and TLS mutual authentication.

## 4. The Administrator Journey (Future Roadmap)

**Goal:** Monitor platform health and manage user quotas.

1. **Overview:** Logs into a dedicated `/admin` route (Currently static/mocked in Next.js structure).
2. **Monitoring:** Views total active users, database size, and Gemini AI API quota consumption.
3. **Management:** Can view user reports, reset accounts, or manage global system broadcasts.

---

*Note: The platform is designed to seamlessly adapt to the user's intent—hiding complex architectural tools from beginners while keeping them accessible for professionals.*
