# Developer Guide

## How to Run Locally
1. Clone the repo.
2. `npm install` in both `client/` and `server/`.
3. Set up `.env` files based on `.env.example`.
4. Run `npm run dev` in both folders.

## How to Add an API Endpoint
1. Create a route in `server/src/routes/`.
2. Map it to a Controller in `server/src/controllers/`.
3. Put the actual logic in `server/src/services/`.
4. Validate input using `server/src/validators/`.
5. Finally, expose it to the frontend via `client/src/lib/api/`.

## How to Debug
- Backend: Use `console.log` or attach a Node debugger to port `9229`.
- Frontend: Use Chrome DevTools. Check the Network tab for failed `lib/api` requests.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- **Revision History:** Initial release (v1.0.0)
