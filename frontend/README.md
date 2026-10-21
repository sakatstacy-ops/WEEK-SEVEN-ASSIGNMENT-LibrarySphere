# Library Catalog Frontend

React/Vite patron and librarian interface for the [library catalog service](https://github.com/sakatstacy-ops/WEEK-6-ASSIGNMENT-library-catalog-service). It uses the live API for catalog browsing/search, account access, reading-list actions, borrow requests, and space bookings.

## Run locally

Requires Node.js 20+ and npm. Run the backend separately and create `.env` from `.env.example`. For local development, Vite proxies `/api` to `http://localhost:4000`.

```powershell
npm install
npm run dev
```

Open <http://localhost:5173>. To build and test:

```powershell
npm test
npm run build
```

The UI has a patron reading-list and booking flow plus librarian-only books, borrow-request, and bookings pages. The backend API enforces role access; hiding admin links is not the security control.

## Production API configuration

Set `VITE_API_BASE_URL` in the frontend hosting build environment to the public backend API base URL, including `/api`, for example `https://your-service.onrender.com/api`. Production builds intentionally fail API calls with a visible configuration error if this value is missing; they never silently call localhost. Configure the backend's `FRONTEND_ORIGIN` to the exact deployed frontend origin so browser CORS requests are allowed.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the deployment setup and outstanding live URLs.

Registration rejects duplicate email addresses; login returns a visible `401` response for invalid credentials. The frontend shows these API errors beside the form.