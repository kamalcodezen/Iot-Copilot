# Coding Standards

## Naming Conventions
- **Files/Folders:** `kebab-case` for routes/directories. `PascalCase` for React components (`Button.tsx`). `camelCase` for utils (`formatDate.ts`).
- **Variables/Functions:** `camelCase`.
- **Types/Interfaces:** `PascalCase`. Prefix interfaces only if necessary; generally prefer plain descriptive names (`User`, not `IUser`).

## Imports
- Use absolute imports (e.g., `@/components/ui/Button`) instead of relative hell (`../../../components/ui/Button`).

## Architecture Rules
1. **Frontend:** No direct `fetch()` or `axios` calls in components. Use `lib/api`.
2. **Backend:** Controllers do not talk to the database directly. Use Services.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)
