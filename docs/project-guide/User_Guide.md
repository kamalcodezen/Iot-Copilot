

<!-- Content from USER_GUIDE.md -->

# User Guide

## Logging In
Navigate to the login page and authenticate using your credentials. Upon success, you will see the Dashboard.

## Dashboard
Provides a high-level view of your current IoT projects and recent AI mentor interactions.

## Creating a Project
1. Navigate to the Projects tab.
2. Click "New Project".
3. Enter the required details and save.

## Using the AI Mentor
Click the chat icon on the bottom right. Type your question (e.g., "How do I wire an I2C LCD to an ESP32?") and wait for the streamed response.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [README.md](./README.md)
- **Revision History:** Initial release (v1.0.0)


<!-- Content from 11_User_Guide.md -->

# 11. User Guide

Welcome to IoT Copilot! This guide explains how to use the platform step-by-step.

## 1. Getting Started
1. **Sign Up:** Click the "Register" button on the homepage. Enter your Name, Email, and a secure password.
2. **Dashboard:** Once logged in, you will be redirected to the Dashboard. This is your command center.
   - **Top Bar:** Shows your current learning streak and total projects.
   - **Charts:** The Activity chart shows your engagement over the last 30 days.

## 2. Planning a Project
1. Navigate to the **Projects** tab in the sidebar.
2. Click **Create Project**.
3. Choose **Generate with AI**.
4. Type what you want to build (e.g., "I want to build a temperature sensor that sends data to AWS using an ESP32").
5. The AI will generate a complete roadmap, hardware list, and milestones.
6. Click into the project and mark milestones as "completed" as you build the physical device.

## 3. Getting Help (AI Mentor)
If you get stuck writing code or wiring a breadboard:
1. Click **AI Mentor** in the sidebar.
2. Type your question (e.g., "What is the difference between I2C and SPI?").
3. The Mentor will stream a detailed, context-aware answer back to you immediately.

## 4. Debugging Errors
If your code throws an error (e.g., a massive red stack trace in the Arduino IDE):
1. Navigate to the **Debugger** tab.
2. Paste the exact error output into the "Logs" field.
3. Paste the code you suspect is causing the issue into the "Code" field.
4. Click **Debug**. The AI will analyze the mismatch and provide a corrected code snippet.

## 5. Profile & Settings
1. Click your Avatar in the top right corner and select **Settings**.
2. Here you can change your display name or update your password. Changes are saved securely and instantly.


<!-- Content from 18_User_Journey.md -->

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
