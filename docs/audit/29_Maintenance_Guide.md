# Maintenance Guide: IoT Copilot AI

This document outlines routine tasks required to keep the IoT Copilot application healthy, secure, and performant over time.

---

## 1. Routine Dependency Updates

Keeping dependencies updated prevents security vulnerabilities and ensures compatibility.

### Monthly Update Cycle
1. **Check for Outdated Packages:** 
   Run `npm outdated` in both `client/` and `server/`.
2. **Review Breaking Changes:**
   Before updating major versions (e.g., Next.js 15 to 16, or React 19 to 20), read the official migration guides.
3. **Execute Updates:**
   Use `npm update` for minor/patch versions. For major version bumps, modify `package.json` manually or use a tool like `npm-check-updates` (`ncu -u`).
4. **Test:** Run the full test suite and manually verify the AI streaming functionality, as SSE streaming is sensitive to networking library changes.

## 2. Database Maintenance

MongoDB is largely maintenance-free if hosted on Atlas, but data hygiene requires attention.

### Indexing
As the `Projects` and `Community` collections grow, query performance will degrade if not indexed properly.
- Ensure `isPublic` and `userId` fields in the `Project` schema have indexes applied (`@index`).
- Periodically check the MongoDB Atlas Profiler for slow queries (>100ms) and add indexes accordingly.

### Orphaned Data Cleanup
Users may delete their accounts, but their associated AI chat histories (`AIMemory`), Images (in Cloudinary), and Projects might be left behind depending on the cascade deletion logic.
- **Action:** Write a cron job script (e.g., `server/src/scripts/cleanup.ts`) that runs weekly to find and delete `AIMemory` documents where the associated `userId` no longer exists in the Better Auth `user` table.

## 3. Cloudinary Maintenance

Images uploaded for project avatars or hardware schematics consume storage and bandwidth.
- **Action:** If a user deletes a project, ensure the backend controller captures the Cloudinary `public_id` of the images and calls the Cloudinary API to `destroy` the asset, rather than just deleting the URL string from MongoDB.

## 4. API Cost Management (Gemini)

The Google Gemini API is the core cost driver of this application.
- **Monitoring:** Set up budget alerts in the Google Cloud Console.
- **Rate Limits:** Regularly review the `aiRateLimit` in `server/src/app.ts`. If malicious users are spamming the AI, tighten the limits (e.g., max 20 requests per hour per IP).
- **Prompt Optimization:** Periodically review the system prompts in `server/src/services/ai.ts`. Removing unnecessary context or condensing the system instructions saves tokens on every single request.

## 5. Security Auditing

- **Audit Command:** Run `npm audit` weekly.
- **Better Auth:** Keep the `better-auth` package strictly up to date. Security patches for authentication libraries are critical.
- **Secrets Rotation:** Rotate the `BETTER_AUTH_SECRET` every 6 months. Note that doing so will invalidate all current user sessions, requiring them to log in again. Communicate this maintenance window to users in advance.
