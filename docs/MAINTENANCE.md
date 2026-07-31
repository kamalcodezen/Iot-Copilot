# Maintenance Guide

## Architecture Rules (Strict)
- **DO NOT** use direct `fetch` or `axios` in React components. Always use `lib/api/`.
- **DO NOT** put Mongoose queries in Express Controllers. Always use Services.

## Do's and Don'ts
- **DO** keep components small and focused.
- **DO** use TypeScript for all new code.
- **DON'T** mix Server Actions with `lib/api` randomly. Stick to the REST `lib/api` pattern for uniformity unless a specific feature strongly benefits from actions.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)
