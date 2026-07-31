# Authentication

The project uses [Better Auth](https://better-auth.com/) for secure authentication.

## Session Flow
1. User logs in via credentials.
2. Better Auth validates the credentials against the DB.
3. Upon success, Better Auth generates a session and assigns an `HttpOnly`, `Secure` (in production) cookie.
4. Subsequent requests automatically include this cookie.

## Protected Routes
- **Frontend:** Handled by layout wrappers or higher-order components checking the user's session state. Unauthenticated users are redirected to `/login`.
- **Backend:** A `requireAuth` middleware extracts the cookie and validates the session via Better Auth before proceeding.

## Role-based Access
- Currently relies on a simple authentication check. Roles (like admin) can be extended in the `Users` schema.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [SECURITY.md](./SECURITY.md)
- **Revision History:** Initial release (v1.0.0)
