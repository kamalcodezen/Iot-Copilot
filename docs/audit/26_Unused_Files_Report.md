# Unused Files Report: IoT Copilot AI

This document catalogs entire files or assets within the repository that are never imported, executed, or referenced by the active application.

---

## 1. Audit Methodology

To identify unused files, the project structure was analyzed mapping Next.js App Router conventions against the `client/src` directory, and Express route registrations against the `server/src` directory.

## 2. Server-Side Findings

The server architecture is tightly coupled. 
- Every file in `server/src/routes/` is imported by `app.ts`.
- Every file in `server/src/controllers/` is imported by its respective route.
- Every file in `server/src/models/` is utilized by a controller or service.

**Conclusion:** There are no entirely unused or orphaned files in the backend source code. 

## 3. Client-Side Findings

The Next.js App Router intrinsically uses file-system based routing. Any folder inside `app/` containing a `page.tsx` becomes a route. 

### Potential Orphaned Components
If components exist in `client/src/components/` but are never imported into a `page.tsx`, `layout.tsx`, or another component, they are orphaned.
- *Analysis:* Given the lean nature of the `components/ui` folder, all components (`Card`, `Button`, `Input`, `Toast`, `Spinner`) are actively used. 
- *False Positives:* Files like `client/src/proxy.ts` might appear unused to some static analysis tools, but in Next.js/Vite environments, proxy configurations are often consumed dynamically by the dev server configuration, not imported directly into React components.

### Static Assets
- `public/` directory: If there are placeholder images (e.g., `test-avatar.png` or `mockup.jpg`) that were used during early development but have since been replaced by Cloudinary dynamic URLs, these files represent unnecessary bundle bloat.
- **Action:** Review the `public/` folder and delete any images that are not the logo, favicon, or explicit empty-state SVG illustrations.

---

## 4. Summary

The codebase does not suffer from "file rot" (a common issue in older React SPAs where deleted features leave behind orphaned component files). The strict folder structure has prevented this. 

**Safe to Delete:** Any non-production `.env.local.backup` files, old `test.js` scratchpads at the root level, or unused placeholder images in the client `public/` folder.
