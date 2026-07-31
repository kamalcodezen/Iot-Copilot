# 20. Complete Project Reference

This document serves as the master index for the IoT Copilot documentation system.

## Documentation Index

### High-Level Architecture & Guides
- [01. Project Overview](./01_Project_Overview.md)
- [02. Project Architecture](./02_Project_Architecture.md)
- [03. Folder Guide](./03_Folder_Guide.md)
- [17. Project Flow](./17_Project_Flow.md)
- [18. User Journey](./18_User_Journey.md)

### Core Engineering & Backend
- [08. Authentication](./08_Authentication.md)
- [09. Database](./09_Database.md)
- [10. API Documentation](./10_API_Documentation.md)
- [14. Deployment Guide](./14_Deployment_Guide.md)
- [19. Code Flow](./19_Code_Flow.md)

### Frontend Engineering & UI
- [04. File Guide](./04_File_Guide.md)
- [05. Component Guide](./05_Component_Guide.md)
- [06. Page Guide](./06_Page_Guide.md)
- [16. Design System](./16_Design_System.md)

### Features & Project Management
- [07. AI System](./07_AI_System.md)
- [11. User Guide](./11_User_Guide.md)
- [12. Admin Guide](./12_Admin_Guide.md)
- [13. Developer Guide](./13_Developer_Guide.md)
- [15. Feature Guide](./15_Feature_Guide.md)

---

## Technical Debt & Unused Code
During the documentation process, the following areas were identified as potential technical debt or requiring future cleanup:

1. **Unused Code / Dead Code:**
   - The original custom JWT authentication logic (`server/src/middlewares/old_auth.ts` or similar remnants) if any remain, as the project has fully migrated to Better Auth.
   - Any hardcoded JWT token generation utilities in the backend.

2. **Security Improvements:**
   - **Rate Limiting:** Implement a strict Express rate limiter (`express-rate-limit`) on all `/api/ai/*` routes to prevent abuse of the Gemini API key.
   - **Environment Variables:** Rotate `BETTER_AUTH_SECRET` before pushing to a production environment.

3. **Performance Improvements:**
   - **Database Indexes:** Ensure compound indexes on the `Activity` collection are utilized effectively, as this collection will grow exponentially compared to others.
   - **Frontend Bundle Size:** Monitor the impact of `framer-motion` and `recharts`. Consider dynamically importing heavy chart components only when they scroll into view.

4. **Scalability:**
   - **WebSockets:** Transition the Dashboard from HTTP Polling to WebSockets or Server-Sent Events (SSE) for real-time activity updates.
   - **Microservices:** If the AI processing becomes computationally expensive or requires heavy background jobs (e.g., parsing massive log files), consider offloading the AI logic to a dedicated Python/FastAPI microservice, leaving Express to handle pure CRUD.

## Final Note
This documentation system is designed to be the single source of truth for IoT Copilot. Any architectural changes, new API endpoints, or database schema modifications **must** be reflected in these documents immediately to prevent knowledge drift.
