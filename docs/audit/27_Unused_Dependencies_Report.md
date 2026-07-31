# Unused Dependencies Report: IoT Copilot AI

This document provides a detailed breakdown of the `package.json` dependencies in both the `client` and `server` directories to identify bloat.

---

## 1. Server Dependencies (`server/package.json`)

The server has a lean dependency tree. However, due to a likely transition in authentication strategies (perhaps moving from a custom JWT/Bcrypt implementation to Better Auth), several development dependencies were left behind.

**Safe to Remove (DevDependencies):**
- `@types/bcryptjs`
- `@types/cookie-parser`
- `@types/jsonwebtoken`

*Action:* Run `npm uninstall -D @types/bcryptjs @types/cookie-parser @types/jsonwebtoken` in the `server` directory.

**Dependencies to Monitor:**
- If Cloudinary is ultimately replaced by AWS S3 for image hosting, the `cloudinary` and `multer` packages will become unused. Currently, they are active.

---

## 2. Client Dependencies (`client/package.json`)

The client dependency tree is complex due to Next.js and Tailwind v4. 

**False Positives (Do NOT Remove):**
Static analysis tools (like `depcheck`) will flag the following as unused because they are injected via configuration files rather than imported directly into `.ts/.tsx` files:
- `@tailwindcss/postcss`
- `postcss`
- `tailwindcss`
- `@types/node`
- `@types/react-dom`
- `typescript`

**Dependencies Requiring Manual Verification:**
- `@tanstack/react-query`: Flagged as unused. If the application relies exclusively on Server Actions and standard `fetch` API for data fetching, this library (and its DevTool companion) is dead weight and should be uninstalled.
- `axios`: Flagged as unused. If `fetch` is used globally, Axios is redundant.

*Action:* Perform a global grep for `import { useQuery` and `import axios` across the `client/src` directory. If 0 results are returned, run `npm uninstall @tanstack/react-query axios`.

---

## 3. Why This Matters
1. **Security:** Every unused dependency is a potential vector for supply-chain attacks.
2. **Build Times:** Removing unused packages speeds up CI/CD pipelines (Vercel/Render) because `npm install` has less to download.
3. **Bundle Size:** While DevDependencies don't impact the final client bundle, unused production dependencies (like Axios, if unused) can significantly increase the initial JavaScript payload sent to the browser, hurting Lighthouse performance scores.
