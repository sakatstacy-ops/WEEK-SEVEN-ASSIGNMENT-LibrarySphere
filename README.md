# LibrarySphere — Week 7 Submission

Full-stack library catalog with patron borrowing and room booking, librarian admin pages, automated behavior/component tests, and separate deployment configurations for an Express/MongoDB API and a React frontend.

## Repositories and layout

This repository contains both deployable projects:

```text
backend/    Express + Mongoose API, Jest/Supertest tests, Render blueprint
frontend/   React + Vite client, Vitest component tests, Netlify config
```

## Run locally

Requirements: Node.js 20+, npm, and a MongoDB Atlas replica-set URI (or another MongoDB replica set; borrow/inventory updates use database transactions).

1. Install and configure the backend:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

   Set `MONGODB_URI` and a private `JWT_SECRET` of at least 32 characters in `backend/.env`. Seed a disposable development database and start the API:

   ```powershell
   npm run seed
   npm run dev
   ```

   The seed replaces `books` and `genres`; use a dedicated assignment database.

2. In a second terminal, configure and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open <http://localhost:5173>. The local Vite server proxies `/api` to `http://localhost:4000`.

3. For librarian UI access, register a patron, then promote that account in a trusted database admin shell. Public registration cannot choose a role:

   ```javascript
   db.users.updateOne(
     { username: "your-librarian-username" },
     { $set: { role: "librarian" } }
   )
   ```

   Sign out and in again to reload the account role.

## Tests

Run each repository's required `npm test` script from its directory:

```powershell
cd backend
npm test

cd ..\frontend
npm test
npm run build
```

Backend tests exercise unauthorized and patron-forbidden responses, a partial booking overlap conflict including HTTP status/response, and a known late fine amount. Frontend tests verify book content/reading-list interaction and that typed search text reaches the search handler.

Both directories include GitHub Actions workflows to run their test suites (and the frontend build) on pushes and pull requests.

## Deployment

Deployment setup and environment variables are documented in [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) and [frontend/DEPLOYMENT.md](./frontend/DEPLOYMENT.md). The API includes a root Render blueprint (with `backend/` as its service root); the frontend includes Netlify build/SPA configuration (set Netlify's base directory to `frontend`).

The public hosting projects have not yet been provisioned, so there are no verified live URLs to claim. After deployment:

1. Set the Netlify build variable `VITE_API_BASE_URL` to the public backend API base URL ending in `/api`, then redeploy.
2. Set the backend `FRONTEND_ORIGIN` to the exact Netlify site origin and configure `MONGODB_URI` and `JWT_SECRET` in Render. Do not commit secrets or add them to this repository.
3. Verify `<backend-origin>/api/health`, `<backend-origin>/api/books/genres`, and browser API requests from the frontend origin.

Deployment preparation identified and fixed a real configuration issue: a relative `/api` fallback would direct production requests to the static frontend host. Production now requires the explicit backend URL instead of silently falling back to a local or same-origin address. The deployment notes correctly identify this as a preparation-stage issue, not a claim of an incident on an unprovisioned live service.

## Week 6 borrow and booking behavior

- Borrow requests must reference a title in the patron's reading list. The API rejects out-of-stock requests and atomically updates inventory and request records.
- Only librarians can update request statuses. When a request is returned, the server computes `$0.25 per started 24-hour period after dueAt`; client-supplied fines are ignored.
- Booking conflicts are checked by the API for the same space/date using `existing.startTime < requested.endTime AND existing.endTime > requested.startTime`. This rejects partial and full overlaps and permits adjacent reservations.

For the separate screen-recording deliverable, record the patron borrow request, librarian late return/fine, and an attempted partially overlapping space booking.
