# State Management

## Strategy

### 1. Server State
Managed primarily by Next.js App Router mechanisms and custom API fetch wrappers (`lib/api`).
For complex caching, React Query/SWR can be integrated on top of the `lib/api` clients.

### 2. Local State
Standard React `useState` and `useReducer` are used for component-level UI state (e.g., form inputs, toggles, modal visibility).

### 3. Global State
React Context API is used for application-wide state that changes infrequently (e.g., ThemeContext, AuthContext).

## Caching
- Backend responses include standard cache headers where appropriate.
- Next.js fetches may leverage aggressive caching for static data. Dynamic data (like user projects) skips caching.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [FRONTEND.md](./FRONTEND.md)
- **Revision History:** Initial release (v1.0.0)
