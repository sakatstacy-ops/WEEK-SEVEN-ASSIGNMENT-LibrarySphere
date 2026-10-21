# Deployment notes

## Hosting plan and required configuration

The frontend is prepared for **Netlify** using `netlify.toml` (Vite build, `dist` output, and SPA route fallback). Its build environment must set:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Public backend URL ending in `/api`, such as `https://<render-service>.onrender.com/api` |

Do not use a localhost URL in the hosted frontend build. Vite embeds this variable at build time, so redeploy after changing it.

The API is prepared for **Render** using `render.yaml`. Set `MONGODB_URI` to the Atlas replica-set connection string and `FRONTEND_ORIGIN` to the exact Netlify site origin (scheme and hostname, no path). Render generates `JWT_SECRET` from the blueprint. The API also uses `PORT`, provided by Render.

## Production verification

The hosted frontend and API URLs are not published yet. Do not treat the example hostnames as live. Once provisioned:

1. Open the frontend URL and verify `GET <VITE_API_BASE_URL>/books` returns catalog data in the browser Network tab.
2. Directly open `<backend-origin>/api/health` and `<backend-origin>/api/books/genres` and verify successful JSON responses.
3. Confirm a browser request from the frontend succeeds with the configured CORS origin, then log in and test search, borrow requests, and booking conflicts.

## Deployment issue found and fix

While preparing this split-origin deployment, the frontend's local `/api` fallback was identified as a production misconfiguration: on a static host, `/api` resolves against the frontend host, not the separately deployed API. The production API client now requires `VITE_API_BASE_URL` and reports a clear configuration error instead of quietly using localhost or the static-site origin. This is a pre-deployment issue found during deployment preparation; no live hosting incident is claimed because the hosting services have not yet been provisioned.
