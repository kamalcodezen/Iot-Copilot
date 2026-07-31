# Deployment Guide

## Frontend Deployment (Vercel / Netlify)
1. Link the repository to the hosting provider.
2. Set the build command: `npm run build`
3. Set the output directory: `.next`
4. Configure required Environment Variables (see `ENVIRONMENT_VARIABLES.md`).

## Backend Deployment (Render / Railway / AWS)
1. Provision a Node.js runtime.
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Configure required Environment Variables.

## Production Checklist
- [ ] Database credentials are secure.
- [ ] CORS is configured strictly to the frontend domain.
- [ ] Better Auth secret is generated and set.
- [ ] Gemini API key is valid.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- **Revision History:** Initial release (v1.0.0)
