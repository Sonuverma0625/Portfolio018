# Portfolio018

A responsive portfolio for Sonu. The repository root contains the `frontend/` and `backend/` folders. The frontend is written in HTML, CSS, and browser JavaScript modules. An Express server serves the site and API. Local development can save contact messages in JSON; Vercel uses persistent Postgres storage when `DATABASE_URL` is configured.

## Project folders

- `frontend/` has the site pages, styles, scripts, portrait and project images, and resume PDF.
- `backend/` has the Express server, API routes, security middleware, and JSON data store.
- `backend/src/routes/` connects each API path to its controller.
- `backend/src/controllers/` validates requests and prepares API responses.
- `backend/src/models/` reads portfolio content and stores contact messages and analytics.
- `backend/src/config/` contains the allowed browser origins and security headers.
- `backend/src/middleware/` protects private dashboard routes.
- `backend/src/scripts/` has the optional visitor-data reset command.

## Run locally

Use Node.js 20 or newer. From the repository root, copy the example environment file and add a private admin key to `backend/.env`:

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

The contact form saves messages to `backend/db.json` during local development when `DATABASE_URL` is not set. In production, it uses Postgres. It does not send email. Open <http://localhost:3002/admin.html> and enter the same admin key to review, mark as read, or delete saved messages. The key stays in that browser tab only. The public email and phone links can still be used to contact Sonu directly.

To use another port, set `PORT` in `backend/.env`. Local CORS defaults allow localhost. Vercel deployment domains are allowed automatically; use `CORS_ORIGINS` for any custom domain. For multiple origins, use comma-separated URLs with no paths or trailing slashes.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port. Defaults to `3002`; hosting platforms supply their own value. |
| `ADMIN_API_KEY` | Private key required to read or change saved messages and analytics. |
| `CORS_ORIGINS` | Comma-separated allowed browser origins, useful for custom domains or a separately hosted frontend. |
| `PORTFOLIO_DB_PATH` | Optional absolute path override for the local JSON store. |
| `DATABASE_URL` | Postgres connection string. Set this for Vercel so contact messages and analytics persist. |

## Deploy

### Vercel

The repository is configured as one Vercel project. Express serves the API, while the build step copies the frontend into Vercel's static `public/` directory.

1. Import `Sonuverma0625/Portfolio018` from GitHub in Vercel. Keep the root directory blank.
2. Before deploying, open Vercel Marketplace → Neon and create a Postgres resource on a plan that fits your needs. Connect it to this Vercel project for the Production environment. Vercel adds `DATABASE_URL` to the project environment.
3. Add a strong `ADMIN_API_KEY` under Project Settings → Environment Variables.
4. Deploy or redeploy. The API creates its message and analytics tables the first time one of those endpoints is used.

The Vercel function filesystem is temporary. The portfolio API therefore requires a configured Postgres URL before it stores contact messages or analytics on Vercel; it will return a service-unavailable response instead of silently saving data to temporary storage. See [Vercel Marketplace storage](https://vercel.com/docs/marketplace-storage) and the [Neon serverless driver guide](https://vercel.com/marketplace/neon/neon) for details.

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
