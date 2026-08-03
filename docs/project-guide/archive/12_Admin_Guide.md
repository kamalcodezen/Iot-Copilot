# 12. Admin Guide

*Note: The Admin interface is currently in development and is a roadmap feature.*

## Future Capabilities
- **User Management:** View all registered users, revoke sessions, or reset passwords manually.
- **Quota Management:** Monitor global Groq API usage to prevent unexpected billing spikes.
- **Content Moderation:** Review community comments on public projects.

## How to Access (Once Implemented)
1. Your account must have the `admin` role assigned in the MongoDB database (via Better Auth plugins).
2. Navigate to `/admin`.
3. The dashboard will bypass standard user telemetry and instead pull from server-level aggregation endpoints.
