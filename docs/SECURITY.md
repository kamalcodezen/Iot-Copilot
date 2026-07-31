# Security

## Mechanisms
- **Cookies:** HttpOnly and Secure flags ensure session tokens cannot be stolen via XSS.
- **CORS:** Strict origin matching prevents unauthorized domains from accessing the API.
- **Validation:** Zod schemas sanitize and strictly type-check all incoming payload data, preventing injection attacks.

## Security Checklist for Development
- [ ] Never log sensitive information (keys, passwords).
- [ ] Always validate user input.
- [ ] Ensure middleware is applied to ALL protected routes.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [AUTHENTICATION.md](./AUTHENTICATION.md)
- **Revision History:** Initial release (v1.0.0)
