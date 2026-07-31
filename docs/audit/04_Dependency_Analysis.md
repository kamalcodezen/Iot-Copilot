# Dependency Analysis: IoT Copilot AI

This document provides a line-by-line review of every dependency inside `package.json` for both the client and the server.

---

## Client Dependencies (`client/package.json`)

### `dependencies`
- **`@hookform/resolvers`**: Bridges React Hook Form with validation libraries (Zod). Necessary for form validation.
- **`@tanstack/react-query`**: State management for server data (fetching, caching). Core to the app's data flow. Necessary.
- **`axios`**: Promise-based HTTP client for making API requests to the Express server. Necessary.
- **`better-auth`**: Handles authentication state on the client. Core dependency.
- **`clsx`**: Utility for constructing `className` strings conditionally. Used with `tailwind-merge`. Necessary for flexible UI components.
- **`framer-motion`**: Animation library for React. Provides micro-animations. Necessary for the premium UI experience.
- **`lucide-react`**: Icon library. Provides all the UI icons. Necessary.
- **`next`**: The React framework powering the frontend (App Router). Essential.
- **`react` & `react-dom`**: Core libraries for rendering the UI. Essential.
- **`react-hook-form`**: Manages form state and validation. Highly performant alternative to controlled inputs. Necessary.
- **`react-hot-toast`**: Provides toast notifications for success/error messages. Necessary.
- **`recharts`**: Charting library used for the dashboard (e.g., activity stats). Necessary if charts are present.
- **`tailwind-merge`**: Merges Tailwind CSS classes without style conflicts. Used with `clsx`. Necessary.
- **`typescript`**: Adds static typing. Essential.
- **`zod`**: Schema declaration and validation library. Used for form schemas. Necessary.
- **`zustand`**: Small, fast global state management. Used for UI states not handled by React Query. Necessary.

### `devDependencies`
- **`@playwright/test` & `playwright`**: End-to-end testing framework. Useful, but can be removed if E2E tests are not written.
- **`@tailwindcss/postcss` & `postcss` & `tailwindcss`**: The Tailwind v4 CSS engine and PostCSS plugin. Essential for styling.
- **`@types/*`**: TypeScript definitions for Node, React, and React-DOM. Essential.

---

## Server Dependencies (`server/package.json`)

### `dependencies`
- **`@google/genai`**: Google's official Gemini API SDK. Used to communicate with the AI model. Essential.
- **`better-auth`**: Authentication framework for handling JWTs, sessions, and routes. Essential.
- **`cloudinary`**: SDK for uploading images (e.g., user avatars, project diagrams) to Cloudinary. Necessary if image upload is a feature.
- **`cors`**: Express middleware to allow cross-origin requests from the Next.js client. Essential.
- **`dotenv`**: Loads environment variables from a `.env` file into `process.env`. Essential.
- **`express`**: The core web framework for the backend. Essential.
- **`express-mongo-sanitize`**: Middleware to prevent MongoDB Operator Injection by sanitizing inputs. Essential for security.
- **`express-rate-limit`**: Middleware to prevent DDoS and brute force attacks by limiting requests. Essential for security.
- **`helmet`**: Secures Express apps by setting various HTTP headers. Essential for security.
- **`mongoose`**: ODM for MongoDB. Provides schemas and querying. Essential.
- **`multer`**: Middleware for handling `multipart/form-data` (file uploads) before sending to Cloudinary. Necessary.
- **`nodemailer`**: Used for sending emails (e.g., password reset, welcome emails). Necessary if email features exist.
- **`zod`**: Used on the backend to validate incoming request bodies/params before they hit controllers. Essential.

### `devDependencies`
- **`@types/*`**: TypeScript definitions for various packages (`bcryptjs`, `cookie-parser`, `cors`, `express`, `jsonwebtoken`, `multer`, `nodemailer`). *Note: Some of these types (like bcryptjs or jsonwebtoken) might be unused if Better Auth handles all auth internally. This requires a deeper code audit to confirm.*
- **`eslint`**: Linter to maintain code quality. Necessary.
- **`tsx`**: Executes TypeScript files directly without manual compilation. Used for the `dev` script. Essential for DX.
- **`typescript`**: Adds static typing. Essential.

---

## Redundancy Check
- The client and server both use `zod`. This is good, but in a monorepo setup, these schemas could be shared to avoid duplication.
- The server has `@types/bcryptjs` and `@types/jsonwebtoken` in `devDependencies`, but neither `bcryptjs` nor `jsonwebtoken` are in `dependencies`. If `better-auth` is handling all of this, those `@types` packages are likely **dead weight and should be removed**.
