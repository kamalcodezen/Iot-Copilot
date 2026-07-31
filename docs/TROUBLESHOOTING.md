# Troubleshooting

## Common Issues

### CORS Errors
**Symptom:** API requests from the frontend fail with a CORS policy error.
**Solution:** Ensure `CORS_ORIGIN` in the backend `.env` matches the exact frontend URL (e.g., `http://localhost:3000`). No trailing slashes.

### Database Connection Fails
**Symptom:** Backend crashes on startup.
**Solution:** Verify `MONGO_URI`. Ensure your IP is whitelisted if using MongoDB Atlas.

### Module Not Found (TypeScript)
**Symptom:** Next.js fails to build.
**Solution:** Ensure all imports in the frontend use the `@/` alias or correct relative paths. Run `npm run build` to catch these early.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [README.md](./README.md)
- **Revision History:** Initial release (v1.0.0)
