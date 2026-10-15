# Portfolio018

A responsive portfolio for Sonu. The repository root contains the `frontend/` and `backend/` folders. The frontend is written in HTML, CSS, and browser JavaScript modules. A small Express server serves the site, provides the portfolio API, and saves contact form messages in a local JSON file.

## Project folders

- `frontend/` has the site pages, styles, scripts, portrait and project images, and resume PDF.
- `backend/` has the Express server, API routes, security middleware, and JSON data store.
- `backend/src/routes/` connects each API path to its controller.
- `backend/src/controllers/` validates requests and prepares API responses.
- `backend/src/models/` reads and writes the portfolio JSON file.
- `backend/src/config/` contains the allowed browser origins and security headers.
- `backend/src/middleware/` protects private dashboard routes.
- `backend/src/scripts/` has the optional visitor-data reset command.

## Run locally

Use Node.js 18 or newer. From the repository root, copy the example environment file and add a private admin key to `backend/.env`:

```powershell
Copy-Item backend/.env.example backend/.env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Paste the generated value after `ADMIN_API_KEY=` in `backend/.env`. Then install and run the backend:

```powershell
cd backend
npm ci
npm start
```

Open <http://localhost:3002>. The site and API use the same address. To stop the server, press `Ctrl+C` in the terminal.

The contact form saves messages to `backend/db.json`. It does not send email. Open <http://localhost:3002/admin.html> and enter the same admin key to review, mark as read, or delete saved messages. The key stays in that browser tab only. The public email and phone links can still be used to contact Sonu directly.

To use another port, set `PORT` in `backend/.env`. The local CORS defaults allow localhost. On Render, set `CORS_ORIGINS` to your deployed service's exact origin (for example, `https://your-site.onrender.com`). If the frontend is hosted separately, use its origin instead. For multiple origins, use comma-separated URLs with no paths or trailing slashes.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port. Defaults to `3002`; Render supplies its own value. |
| `ADMIN_API_KEY` | Private key required to read or change saved messages and analytics. |
| `CORS_ORIGINS` | Comma-separated allowed browser origins. Set this to your Render URL, or to the static frontend origin when hosted separately. |
| `PORTFOLIO_DB_PATH` | Optional absolute path for `db.json`, useful when the host provides persistent storage. |

## Deploy

### One Render web service

This is the simplest setup because Express serves both the frontend and API:

1. Create a Render **Web Service** from the GitHub repository. Leave the root directory blank; `frontend/` and `backend/` are at the repository root.
2. Set the build command to `npm --prefix backend ci`.
3. Set the start command to `npm --prefix backend start`.
4. In Environment, set a strong `ADMIN_API_KEY` and set `CORS_ORIGINS` to the service's exact public URL, such as `https://your-site.onrender.com`.
5. If you attach persistent storage, mount it at `/var/data` and set `PORTFOLIO_DB_PATH=/var/data/db.json`.

Messages are saved in the JSON database. Render's default filesystem is ephemeral, so new contact messages and analytics can disappear after a restart or redeploy unless the service has persistent storage. Persistent disks require a paid Render service. See [Render's persistent disk guide](https://render.com/docs/disks) for setup and limitations.

### Separate static site and API

You can deploy `protfolio/frontend/` to Netlify or a Render Static Site, and deploy `protfolio/backend/` as a Render Web Service. In `frontend/js/config.js`, set `API_BASE_URL` to the backend's full origin, such as `https://your-api.onrender.com` (no trailing slash). Set `CORS_ORIGINS` on the backend to the static site's full origin. The backend still needs persistent storage if contact submissions should survive restarts.

## Useful API paths

- `GET /api/portfolio`
- `GET /api/projects` (optional filters: `?featured=true` or `?tag=React`)
- `GET /api/skills`
- `GET /api/certificates`
- `GET /api/experience`
- `POST /api/contact`
- `POST /api/analytics/visit`
- `GET /api/messages`, `PUT /api/messages/:id/read`, and `DELETE /api/messages/:id` (admin key required)
- `GET /api/analytics` (admin key required)

Run `npm run seed` inside `backend/` only when you intend to clear saved messages and reset analytics.
