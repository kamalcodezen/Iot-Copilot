# Environment Variables

| Variable | Description | Required | Example Value | Where Used |
|---|---|---|---|---|
| `MONGO_URI` | MongoDB Connection String | Yes | `mongodb://localhost:27017/iot` | Backend |
| `GEMINI_API_KEY` | Google Gemini Key | Yes | `AIzaSy...` | Backend |
| `PORT` | Backend server port | No | `5000` | Backend |
| `CORS_ORIGIN` | Allowed frontend URL | Yes | `http://localhost:3000` | Backend |
| `NEXT_PUBLIC_API_URL` | Backend URL for client | Yes | `http://localhost:5000/api` | Frontend |

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Revision History:** Initial release (v1.0.0)
