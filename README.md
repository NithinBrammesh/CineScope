# CineScope

CineScope is a full-stack movie discovery platform built in phases.

## Phase 1 status

This repository currently contains the initial project foundation only:

- Vite React frontend
- Express backend
- environment configuration scaffold
- PostgreSQL connection structure
- database schema template
- backend health endpoint
- frontend-to-backend communication setup
- project documentation

## Current architecture

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- External API: TMDB (not yet integrated in this phase)

## Phase boundary

This project intentionally does not include:

- TMDB integration
- movie discovery/search
- filters/sorting
- movie details
- wishlist
- caching

Those belong to later phases and are excluded from Phase 1.

## Run locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Notes

- The frontend calls the backend through the Vite proxy.
- The backend exposes a health endpoint at /api/health.
- PostgreSQL configuration is prepared, but no feature-level database logic is implemented yet.
