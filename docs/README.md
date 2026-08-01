# IoT Copilot

## Project Overview
IoT Copilot is an intelligent, AI-driven platform designed to assist developers in creating, managing, and debugging Internet of Things (IoT) projects. It accelerates IoT development through AI-powered mentoring, debugging, and robust project management features.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **Authentication:** Better Auth
- **AI:** Google Gemini API

## Architecture Overview
The application follows a standard Client-Server architecture. The Next.js frontend communicates with the Express backend via REST APIs. The backend interacts with MongoDB for data persistence and the Gemini API for AI features. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed flows.

## Quick Start
1. **Clone the repository.**
2. **Setup Environment:** Copy `.env.example` to `.env` in both `client/` and `server/` directories. Configure variables (e.g., `MONGO_URI`, `GEMINI_API_KEY`).
3. **Install Dependencies:** Run `npm install` in both `client/` and `server/`.
4. **Run Locally:** Run `npm run dev` in both directories.

## Documentation Index
- [Architecture Guide](./ARCHITECTURE.md)
- [Frontend Documentation](./FRONTEND.md)
- [Backend Documentation](./BACKEND.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [API Documentation](./API.md)
- [Database Documentation](./DATABASE.md)
- [Authentication](./AUTHENTICATION.md)
- [AI Module](./AI_MODULE.md)
- [State Management](./STATE_MANAGEMENT.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Security](./SECURITY.md)
- [Performance](./PERFORMANCE.md)
- [Testing Guide](./TESTING.md)
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Maintenance Guide](./MAINTENANCE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Changelog](./CHANGELOG.md)
- [Roadmap](./ROADMAP.md)
- [FAQ](./FAQ.md)

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** None
- **Revision History:** Initial release (v1.0.0)


<!-- Merged from 01_Project_Overview.md -->

# 01. Project Overview

## 1. Project Purpose
**IoT Copilot** is a state-of-the-art, AI-powered platform engineered to simplify the design, learning, and deployment of Industrial Internet of Things (IIoT) systems. It bridges the gap between hardware engineering and software development by providing an intelligent companion that assists users throughout the entire lifecycle of an IoT project—from initial concept and architectural design to debugging and deployment.

## 2. Why This Project Exists
The complexity of IoT ecosystems (involving sensors, microcontrollers, edge gateways, cloud infrastructure, and data analytics) often creates a steep learning curve for developers and engineers. IoT Copilot exists to:
- **Lower the Barrier to Entry:** Provide step-by-step guidance for beginners and students.
- **Accelerate Development:** Offer AI-driven architectural suggestions, code generation, and hardware recommendations for professionals.
- **Centralize Knowledge:** Consolidate disparate documentation, tutorials, and debugging tools into a single, cohesive dashboard.

## 3. The Problem It Solves
- **Fragmented Workflows:** Engineers typically juggle multiple tools for hardware schematics, backend coding, and project management. IoT Copilot brings project tracking and AI assistance into one interface.
- **Debugging Complexity:** Diagnosing hardware-software integration issues is notoriously difficult. The **AI Debugger** feature analyzes stack traces and sensor data to pinpoint root causes.
- **Skill Gaps:** The **AI Mentor**, **Interview Coach**, and **Learning Path** modules provide personalized education, helping users upskill exactly where they have knowledge gaps.

## 4. Target Users
1. **Students & Hobbyists:** Individuals looking to learn IoT concepts, build their first smart home device, or prepare for technical interviews.
2. **Software Developers:** Web/Mobile engineers wanting to expand into hardware integration without getting bogged down by electrical engineering minutiae.
3. **Hardware Engineers:** Electronics experts needing assistance with cloud connectivity, API design, or modern software stacks.
4. **IoT Solutions Architects:** Professionals designing enterprise-scale deployments who need to rapidly prototype system architectures and validate component compatibility.

## 5. Business Value
- **Educational Impact:** Can be utilized by bootcamps, universities, or online courses as a primary learning companion.
- **Productivity Multiplier:** Reduces the time spent on boilerplate code, component research, and frustrating hardware bugs, allowing engineers to focus on business logic.
- **Scalable Architecture:** Built with enterprise-grade technologies (Next.js, Node.js, MongoDB, Gemini AI), ensuring the platform itself can handle significant user growth and complex data interactions.

## 6. Real-World Use Cases
- **Smart Agriculture Prototype:** A user inputs "I want to build a soil moisture monitor using ESP32". The AI Planner generates a project roadmap, hardware list, and initial Arduino C++ skeleton code.
- **Industrial Maintenance:** An engineer pastes an erratic MQTT connection log into the AI Debugger. The system identifies a QoS mismatch and suggests the exact configuration change needed.
- **Career Preparation:** A junior developer uses the Interview Coach to practice answering questions about IoT security protocols (e.g., TLS over MQTT, LoRaWAN security keys).
- **Skill Tracking:** As a user completes AI-guided modules on Edge Computing, their Skill Radar on the Dashboard dynamically updates to reflect their new proficiency level.
