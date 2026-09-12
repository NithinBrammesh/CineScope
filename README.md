# CineScope — Movie Discovery & Wishlist Platform

CineScope is a full-stack movie discovery application built with **React, Node.js, Express, PostgreSQL, and the TMDB API**.

The application allows users to discover movies, search for movies, filter and sort results, view detailed movie information, and maintain a persistent wishlist.

The project follows a **modular monolith architecture**. The React frontend communicates only with the CineScope backend, while the backend is responsible for communicating with TMDB and PostgreSQL.

---

## 1. Assignment Overview

### Objective

The objective of CineScope is to build a movie discovery application that demonstrates:

- React frontend development
- Node.js and Express backend development
- Third-party API integration
- Persistent database storage
- Movie discovery and search
- Filtering and sorting
- Pagination for large result sets
- Movie details
- Persistent wishlist functionality
- Loading, empty, and error states
- Responsive UI design
- Maintainable application architecture
- Handling of external API failures and slow responses

### Important Requirement

The frontend must **not call TMDB directly**.

All movie-related requests flow through the CineScope backend.

```text
User
 |
 v
React Frontend
 |
 | REST / JSON
 v
CineScope Backend
 |
 | TMDB API
 v
TMDB
```

This keeps the TMDB access token on the backend and prevents the frontend from being tightly coupled to the external API.

---

# 2. Requirements and Completion Status

| Requirement | Status |
|---|---|
| React frontend | Completed |
| Node.js backend | Completed |
| Express REST API | Completed |
| TMDB integration | Completed |
| Backend API abstraction | Completed |
| Movie discovery | Completed |
| Movie search | Completed |
| Genre filtering | Completed |
| Year filtering | Completed |
| Sorting | Completed |
| Pagination | Completed |
| Movie details | Completed |
| Wishlist | Completed |
| Persistent wishlist | Completed |
| Duplicate prevention | Completed |
| Navigation | Completed |
| Loading states | Completed |
| Empty states | Completed |
| Error states | Completed |
| Responsive design | Completed |
| PostgreSQL | Completed |
| Docker Compose database | Completed |
| Timeout handling | Completed |
| Transient retry handling | Completed |
| Documentation | Completed |

---

# 3. Features

## Movie Discovery

Users can browse movies retrieved through the backend.

Movie cards provide relevant information including:

- Poster
- Title
- Release date/year
- Rating
- Vote count where available

## Search

Users can search for movies by title/query.

Example:

```text
Batman
```

Search requests are sent to the backend:

```http
GET /api/movies/search?q=batman&page=1
```

## Filtering

Movies can be filtered by:

- Genre
- Release year

## Sorting

Movie results can be sorted using supported movie attributes such as:

- Rating
- Release date
- Popularity/relevance

## Pagination

Movie results are paginated instead of loading the entire result set at once.

## Movie Details

Users can open a movie to view:

- Title
- Poster
- Backdrop
- Overview
- Release date
- Rating
- Vote count

## Wishlist

Users can:

- Add movies
- Remove movies
- View saved movies
- Persist wishlist data
- Avoid duplicate entries

## Navigation

The application provides navigation between:

- Discover
- Search
- Movie Details
- Wishlist

## Responsive UI

The UI adapts to:

- Desktop
- Tablet
- Mobile

---

# 4. High-Level Architecture

CineScope uses a **three-tier application architecture** with a modular backend.

```text
                         +----------------+
                         |      User      |
                         +-------+--------+
                                 |
                                 v
                    +-------------------------+
                    |     React Frontend      |
                    |                         |
                    | Pages                   |
                    | Components              |
                    | API Client              |
                    | UI State                |
                    +-----------+-------------+
                                |
                           REST / JSON
                                |
                                v
              +---------------------------------------+
              |       Node.js + Express Backend       |
              |                                       |
              | Routes                                |
              |     ↓                                 |
              | Controllers                           |
              |     ↓                                 |
              | Services                              |
              |     ↓                  ↓              |
              | PostgreSQL        TMDB Client         |
              +------+------------------+--------------+
                     |                  |
                     v                  v
              +-------------+     +-----------+
              | PostgreSQL  |     | TMDB API  |
              |             |     |           |
              | Users       |     | Movies    |
              | Wishlist    |     | Search    |
              +-------------+     +-----------+
```

---

# 5. System Design

The backend is organized as a **modular monolith**.

```text
                    CineScope Backend
                           |
             +-------------+-------------+
             |                           |
             v                           v
       Movie Module                Wishlist Module
             |                           |
       +-----+------+               +----+-----+
       |            |               |          |
       v            v               v          v
 Controller     Service          Controller  Service
                    |                           |
                    v                           v
              TMDB Client                  PostgreSQL
```

The application remains one deployable backend while separating responsibilities into modules.

### Why this architecture?

A microservice architecture would add unnecessary complexity for the current scope.

The modular monolith provides:

- Clear separation of concerns
- Simple development
- Simple deployment
- Easier debugging
- Easier testing
- Lower infrastructure requirements
- A path to future service extraction

Technologies such as Kafka, Kubernetes, or multiple independent services are not required for the current application.

---

# 6. Frontend Architecture

```text
frontend/src/
|
+-- components/
|   +-- MovieCard
|   +-- MovieGrid
|   +-- SearchBar
|   +-- FilterBar
|   +-- SortSelector
|   +-- LoadingSkeleton
|   +-- EmptyState
|   +-- ErrorState
|
+-- pages/
|   +-- Home
|   +-- Search
|   +-- MovieDetails
|   +-- Wishlist
|
+-- services/
|   +-- api.js
|
+-- hooks/
+-- context/
+-- utils/
|
+-- App.jsx
+-- App.css
+-- main.jsx
```

### Frontend Responsibilities

The frontend is responsible for:

- Rendering the UI
- Managing UI state
- Handling user interactions
- Calling backend APIs
- Displaying loading states
- Displaying empty states
- Displaying errors
- Navigation
- Responsive presentation

The frontend does not contain the TMDB access token.

---

# 7. Backend Architecture

```text
backend/src/
|
+-- config/
|   +-- env.js
|
+-- controllers/
|   +-- movieController.js
|   +-- wishlistController.js
|
+-- services/
|   +-- movieService.js
|   +-- wishlistService.js
|
+-- clients/
|   +-- tmdbClient.js
|
+-- routes/
|   +-- movieRoutes.js
|   +-- wishlistRoutes.js
|
+-- middleware/
|   +-- errorHandler.js
|   +-- validation.js
|
+-- cache/
|   +-- movieCache.js
|
+-- db/
|   +-- connection.js
|   +-- schema.sql
|
+-- utils/
|
+-- app.js
```

---

# 8. Backend Layer Responsibilities

## Routes

Routes define the public API endpoints.

```text
GET    /api/health
GET    /api/movies
GET    /api/movies/search
GET    /api/movies/:id
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:movieId
```

## Controllers

Controllers handle HTTP-specific responsibilities:

- Read request parameters
- Validate input
- Call services
- Return HTTP responses

Business logic is kept in the service layer.

## Services

Services contain application/business logic.

### Movie Service

Responsible for:

- Movie discovery
- Search
- Filters
- Sorting
- Pagination
- Movie details
- Movie data normalization

### Wishlist Service

Responsible for:

- Add movie
- Remove movie
- Get wishlist
- Duplicate prevention
- Database persistence
- Wishlist fallback behavior

## TMDB Client

The TMDB client centralizes:

- TMDB base URL
- Authentication
- HTTP requests
- Timeout handling
- Error handling
- Limited transient retries

---

# 9. External API Abstraction

The frontend communicates only with the CineScope API.

```text
React
 |
 | GET /api/movies
 | GET /api/movies/search
 | GET /api/movies/:id
 v
CineScope Backend
 |
 v
TMDB Client
 |
 v
TMDB API
```

The frontend does not need to know:

- TMDB API URLs
- TMDB authentication
- TMDB access token
- TMDB raw response format

This provides a clean application API contract.

It also makes changing the movie provider easier in the future.

---

# 10. Movie Data Model

TMDB responses are normalized into an application-level model:

```javascript
{
  id,
  title,
  overview,
  posterUrl,
  backdropUrl,
  releaseDate,
  rating,
  voteCount
}
```

The frontend therefore depends on the CineScope movie model rather than directly depending on TMDB's response structure.

---

# 11. Database Design

PostgreSQL is used for persistent application data.

```text
+----------------------+
|        users         |
+----------------------+
| id                   |
| ...                  |
+----------+-----------+
           |
           | user_id
           v
+----------------------+
|       wishlist       |
+----------------------+
| id                   |
| user_id              |
| movie_id             |
| movie_title          |
| poster_url           |
| added_at             |
+----------------------+
```

The wishlist is stored in PostgreSQL so that it survives application and backend restarts.

```text
Browser Refresh
      |
      v
Backend Restart
      |
      v
PostgreSQL
      |
      v
Wishlist remains persisted
```

---

# 12. Wishlist Design

Authentication was not required by the assignment, so the current implementation uses a simple default-user model.

### Add Movie

```text
User
 |
 v
React
 |
 | POST /api/wishlist
 v
Wishlist Controller
 |
 v
Wishlist Service
 |
 v
PostgreSQL
 |
 v
Saved Movie
```

### Remove Movie

```text
User
 |
 v
React
 |
 | DELETE /api/wishlist/:movieId
 v
Wishlist Service
 |
 v
PostgreSQL
 |
 v
Movie Removed
```

### Duplicate Prevention

The backend checks whether the movie is already saved for the current/default user.

```text
Not saved
    ↓
Add to Wishlist

Already saved
    ↓
Remove from Wishlist
```

---

# 13. Wishlist Data Enrichment

Wishlist records contain basic movie information.

When displaying saved movies, the backend can retrieve current movie details through the existing movie service.

The wishlist can therefore display:

- Movie title
- Poster
- Release year
- Rating
- Vote count

If an individual TMDB detail request fails, stored PostgreSQL information can be used as fallback data rather than failing the entire wishlist response.

---

# 14. API Documentation

Base URL:

```text
http://localhost:4000
```

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API/database health |
| GET | `/api/movies` | Discover movies |
| GET | `/api/movies/search` | Search movies |
| GET | `/api/movies/:id` | Get movie details |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add movie |
| DELETE | `/api/wishlist/:movieId` | Remove movie |

## Health Check

```http
GET /api/health
```

Example:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "CineScope API",
    "database": "connected"
  }
}
```

## Movie Discovery

```http
GET /api/movies
```

Pagination:

```http
GET /api/movies?page=1
```

Year filter:

```http
GET /api/movies?page=1&year=2024
```

Genre filter:

```http
GET /api/movies?page=1&genre=28
```

## Movie Search

```http
GET /api/movies/search?q=batman&page=1
```

## Movie Details

```http
GET /api/movies/:id
```

Example:

```http
GET /api/movies/414906
```

## Get Wishlist

```http
GET /api/wishlist
```

## Add Wishlist Movie

```http
POST /api/wishlist
```

## Remove Wishlist Movie

```http
DELETE /api/wishlist/:movieId
```

---

# 15. Request Flows

## Movie Discovery

```text
User
 |
 v
React Home
 |
 v
GET /api/movies
 |
 v
Route
 |
 v
Controller
 |
 v
Movie Service
 |
 v
TMDB Client
 |
 v
TMDB API
 |
 v
Normalize Results
 |
 v
Movie Grid
```

## Search

```text
User enters "Batman"
 |
 v
SearchBar
 |
 v
Frontend API Client
 |
 v
GET /api/movies/search
 |
 v
Movie Controller
 |
 v
Movie Service
 |
 v
TMDB Client
 |
 v
TMDB Search API
 |
 v
Normalized Results
 |
 v
Movie Grid
```

## Movie Details

```text
User clicks movie
 |
 v
/movies/:id
 |
 v
GET /api/movies/:id
 |
 v
Backend
 |
 v
TMDB
 |
 v
Normalized Movie
 |
 v
Movie Details Page
```

## Wishlist

```text
User
 |
 v
React
 |
 v
POST /api/wishlist
 |
 v
Backend
 |
 v
Wishlist Service
 |
 v
PostgreSQL
 |
 v
Persistent Wishlist
```

---

# 16. Error Handling and Reliability

The application handles failures at both backend and frontend levels.

## TMDB Failure

```text
TMDB Request
     |
     +---- Success ------> Return Data
     |
     +---- Failure
             |
             v
       Retry if transient
             |
             v
       Return Error
             |
             v
       Frontend Error State
```

## Slow External Service

```text
Backend
   |
   v
TMDB Request
   |
   +---- Fast Response ---> Success
   |
   +---- Slow Response ---> Timeout
                              |
                              v
                             Error
```

## Empty Search

```text
Search
  |
  v
TMDB
  |
  v
No Results
  |
  v
Backend
  |
  v
Empty Result
  |
  v
Frontend Empty State
```

---

# 17. Retry Strategy

The TMDB client implements limited retries for appropriate transient failures.

```text
Request
  |
  +---- Success ------> Return
  |
  +---- Transient Failure
              |
              v
            Retry
              |
              v
            Retry
              |
              v
        Final Response/Error
```

Permanent client errors are not repeatedly retried.

The retry strategy is intentionally limited to avoid uncontrolled request amplification.

---

# 18. Timeout Handling

External API requests use timeout protection.

The purpose is to prevent an unavailable or slow external service from keeping backend requests open indefinitely.

```text
Backend
   |
   v
TMDB Request
   |
   +---- Fast ---> Success
   |
   +---- Slow ---> Timeout ---> Error
```

---

# 19. UI State Handling

## Loading

A loading skeleton is displayed while data is being fetched.

## Empty

If a search produces no results, an empty state is displayed.

## Error

If the backend or external API fails, an error state is displayed with retry behavior where appropriate.

## Success

Movie cards are displayed after successful data retrieval.

---

# 20. Large Result Handling

The application uses pagination rather than loading the entire movie catalog into the browser.

```text
Large Dataset
     |
     v
Pagination
     |
     +---- Page 1
     +---- Page 2
     +---- Page 3
     +---- ...
```

Benefits:

- Lower network usage
- Lower browser memory usage
- Faster rendering
- Better user experience

---

# 21. Responsive Design

The interface supports desktop, tablet, and mobile layouts.

Desktop:

```text
+------+ +------+ +------+ +------+ +------+
| M1   | | M2   | | M3   | | M4   | | M5   |
+------+ +------+ +------+ +------+ +------+
```

Mobile:

```text
+----------+ +----------+
|    M1    | |    M2    |
+----------+ +----------+

+----------+ +----------+
|    M3    | |    M4    |
+----------+ +----------+
```

Responsive behavior includes:

- Movie grid
- Wishlist grid
- Mobile spacing
- Mobile typography
- Responsive pagination

---

# 22. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Language | JavaScript |
| Styling | CSS |
| Backend | Node.js + Express |
| API | REST / JSON |
| Database | PostgreSQL |
| External API | TMDB |
| Database Infrastructure | Docker + Docker Compose |
| Version Control | Git + GitHub |

---

# 23. Project Structure

```text
CineScope/
|
+-- backend/
|   +-- src/
|   |   +-- cache/
|   |   +-- clients/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- db/
|   |   +-- middleware/
|   |   +-- routes/
|   |   +-- services/
|   |   +-- utils/
|   |   +-- app.js
|   |
|   +-- .env.example
|   +-- package.json
|   +-- package-lock.json
|
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- pages/
|   |   +-- services/
|   |   +-- hooks/
|   |   +-- context/
|   |   +-- utils/
|   |   +-- App.jsx
|   |   +-- App.css
|   |   +-- main.jsx
|   |
|   +-- package.json
|   +-- package-lock.json
|
+-- docker-compose.yml
+-- .gitignore
+-- README.md
```

---

# 24. Docker Setup

PostgreSQL runs through Docker Compose.

```text
+--------------------------------------+
|           Local Machine              |
|                                      |
| React          Node.js / Express     |
|   |                   |              |
|   +-------------------+              |
|               |                      |
|               v                      |
|        PostgreSQL Container          |
|                                      |
+--------------------------------------+
```

PostgreSQL image:

```text
postgres:16-alpine
```

Local database port:

```text
5433
```

Container PostgreSQL port:

```text
5432
```

---

# 25. Environment Configuration

Create:

```text
backend/.env
```

Example:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/cinescope
NODE_ENV=development
TMDB_ACCESS_TOKEN=your_tmdb_access_token
TMDB_BASE_URL=https://api.themoviedb.org/3
```

The actual TMDB access token must remain local.

Do not commit:

```text
backend/.env
```

The repository contains:

```text
backend/.env.example
```

instead.

The root `.gitignore` also excludes environment files and dependencies.

---

# 26. Local Development Setup

## Prerequisites

Install:

- Node.js
- npm
- Docker
- Docker Compose
- Git

PostgreSQL does not need to be installed directly because it runs through Docker.

## Clone Repository

```bash
git clone https://github.com/NithinBrammesh/CineScope.git
cd CineScope
```

## Start PostgreSQL

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

## Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

using:

```text
backend/.env.example
```

Add the TMDB access token.

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:4000
```

Health endpoint:

```text
http://localhost:4000/api/health
```

## Frontend

Open another terminal:

```bash
cd CineScope/frontend
npm install
npm run dev
```

---

# 27. Frontend → Backend Proxy

During local development:

```text
Browser
   |
   v
Vite Dev Server
localhost:5173
   |
   | /api/*
   v
Express Backend
localhost:4000
```

This allows frontend API requests to be routed through the CineScope backend.

---

# 28. Production Build

Build the frontend:

```bash
npm run build
```

The frontend production build was successfully validated during development.

---

# 29. Testing and Verification

The application was manually tested against the main assignment requirements.

## Backend

- [x] Server starts successfully
- [x] PostgreSQL connection works
- [x] Health endpoint works
- [x] TMDB connectivity works
- [x] Movie discovery works
- [x] Search works
- [x] Genre filtering works
- [x] Year filtering works
- [x] Sorting works
- [x] Pagination works
- [x] Movie details work
- [x] Wishlist API works
- [x] Wishlist persistence works
- [x] Wishlist removal works
- [x] Duplicate prevention works
- [x] Timeout handling works
- [x] Transient retry handling works

## Frontend

- [x] Movie discovery loads
- [x] Search works
- [x] Empty search state works
- [x] Genre filter works
- [x] Year filter works
- [x] Sorting works
- [x] Pagination works
- [x] Movie details page works
- [x] Add to wishlist works
- [x] Remove from wishlist works
- [x] Wishlist page works
- [x] Wishlist persists after backend restart
- [x] Loading state works
- [x] Error state works
- [x] Responsive layout works
- [x] Mobile layout verified

### Code Validation

Backend syntax checks:

```bash
node --check src/app.js
node --check src/clients/tmdbClient.js
node --check src/services/movieService.js
node --check src/services/wishlistService.js
```

Frontend production build:

```bash
npm run build
```

---

# 30. Engineering Decisions

## Backend API Abstraction

**Decision:** The frontend communicates only with CineScope backend endpoints.

**Reason:** Keeps TMDB credentials private and prevents frontend coupling to the external provider.

## Modular Monolith

**Decision:** Use one Node.js backend with clear modules.

**Reason:** The current application does not require the operational complexity of microservices.

## PostgreSQL

**Decision:** Use PostgreSQL for wishlist persistence.

**Reason:** Wishlist data must survive application and backend restarts.

## REST

**Decision:** Use REST/JSON.

**Reason:** The application has straightforward resources and operations that fit REST naturally.

## Normalized Movie Model

**Decision:** Normalize TMDB responses before returning them.

**Reason:** The frontend should depend on the application's API contract instead of TMDB's raw response structure.

## Limited Retry

**Decision:** Retry only appropriate transient failures.

**Reason:** Temporary failures may recover, while permanent client errors should not be repeatedly retried.

## Default User

**Decision:** Use a default-user model.

**Reason:** Authentication was outside the assignment scope.

---

# 31. Performance Considerations

The application considers several performance concerns.

### Pagination

Only the requested result page is loaded.

### Backend Abstraction

External API communication is centralized.

### Normalized Responses

The frontend receives only the required application-level movie model.

### Retry Limits

Retries are limited to prevent request amplification.

### Persistent Storage

Wishlist data is stored in PostgreSQL.

---

# 32. Caching Strategy

Repeated movie discovery and search requests can create unnecessary calls to TMDB.

The project contains a cache module where caching can be introduced.

A future production implementation could use Redis:

```text
Request
  |
  v
Cache
  |
  +---- HIT ------> Cached Result
  |
  +---- MISS
          |
          v
        TMDB
          |
          v
       Store Cache
          |
          v
       Return Result
```

Potential cache policies:

- Short TTL for search results
- Longer TTL for movie details
- Cache keys based on query/filter/page
- Request deduplication

A distributed cache is not required for the current assignment implementation.

---

# 33. Scalability Considerations

### Current

```text
React
  |
  v
Node/Express
  |
  +---- PostgreSQL
  |
  +---- TMDB
```

### Possible Future

```text
                         Load Balancer
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
             API 1         API 2          API 3
                |             |             |
                +-------------+-------------+
                              |
                     +--------+--------+
                     |                 |
                     v                 v
                   Redis          PostgreSQL
                     |
                     v
                  TMDB API
```

Future improvements could include:

- Multiple backend instances
- Redis
- CDN
- Rate limiting
- Authentication
- Background jobs
- Monitoring
- Centralized logging

The current architecture is intentionally simpler because the application does not yet require distributed infrastructure.

---

# 34. Rate Limit Considerations

TMDB is an external dependency and may impose API usage limits.

Production improvements could include:

- Server-side caching
- Request deduplication
- Rate limiting
- Exponential backoff
- External API usage monitoring

Because TMDB communication is centralized in the backend, these improvements can be added without changing the frontend API contract.

---

# 35. Security Considerations

The TMDB access token is stored on the backend.

```text
React
  |
  X
  +------> TMDB

React
  |
  v
Backend
  |
  | Authorization Token
  v
TMDB
```

The real environment file is excluded from Git.

This prevents the external API credential from being exposed in the repository or browser.

---

# 36. Maintainability

The backend follows:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Database / External Client
```

This keeps responsibilities separated.

Examples:

- Routes handle HTTP paths.
- Controllers handle requests/responses.
- Services contain business logic.
- The database layer handles persistence.
- The TMDB client handles external API communication.

This structure makes future modifications easier.

For example, changing the external movie provider would primarily affect the integration layer rather than the entire application.

---

# 37. Limitations

The current implementation intentionally has several limitations.

### Authentication

A complete authentication system is not implemented because it was outside the assignment scope.

### Default User

The wishlist currently uses a default-user model.

### External Dependency

Movie discovery and details depend on TMDB availability.

### Production Cache

A distributed Redis cache is not deployed.

### Rate Limiting

Production-level rate limiting can be added.

### Observability

Centralized logging, metrics, tracing, and alerting are future improvements.

### Production Deployment

The project is primarily structured for local development and assignment evaluation.

---

# 38. Future Improvements

## Authentication

- User registration
- Login
- JWT/session authentication
- User-specific wishlists

## Performance

- Redis caching
- Search debouncing
- Request cancellation
- Request deduplication
- CDN

## API Protection

- Rate limiting
- Stronger request validation
- Security headers

## Observability

- Structured logging
- Metrics
- Distributed tracing
- Error monitoring
- Health dashboards

## Deployment

- Cloud-hosted PostgreSQL
- Containerized backend
- Static frontend hosting/CDN
- HTTPS
- CI/CD

---

# 39. AI Usage

AI-assisted development tools were used during development for:

- Implementation suggestions
- Boilerplate generation
- Debugging
- UI improvements
- Architecture review
- Error-handling suggestions
- Documentation assistance

Generated code was reviewed, tested, and integrated into the project.

Validation included:

- Manual application testing
- API testing
- Database verification
- Frontend testing
- Node.js syntax checks
- Production frontend build

AI was used as a development aid, while the final implementation was reviewed and understood by the developer.

---

# 40. Design Principles

The project follows these principles:

### Separation of Concerns

Each layer has a clear responsibility.

### Backend Abstraction

External API implementation is hidden behind the backend.

### Secure Configuration

Secrets remain in environment variables.

### Graceful Failure

External failures are handled using errors, timeouts, limited retries, and fallback data where applicable.

### Pagination

Large result sets are handled incrementally.

### Persistence

Important wishlist data is stored in PostgreSQL.

### Maintainability

Functionality is divided into focused modules.

### Simplicity

Complex infrastructure is introduced only when justified by the requirements.

---

# 41. Final Architecture Summary

```text
                         USER
                          |
                          v
                  +---------------+
                  | React + Vite  |
                  |   Frontend    |
                  +-------+-------+
                          |
                       REST/JSON
                          |
                          v
                +-------------------+
                | Node.js + Express |
                |     Backend       |
                +---------+---------+
                          |
                +---------+---------+
                |                   |
                v                   v
        +---------------+   +---------------+
        |   PostgreSQL  |   |   TMDB API    |
        |               |   |               |
        |   Wishlist    |   | Movie Data    |
        +---------------+   +---------------+
```

The backend acts as the central application layer, providing a stable API contract to the frontend while isolating TMDB integration and database operations.

---

# 42. Submission Checklist

Before submission, verify:

- [x] Frontend runs successfully
- [x] Backend runs successfully
- [x] PostgreSQL starts through Docker
- [x] TMDB integration works
- [x] Search works
- [x] Filters work
- [x] Sorting works
- [x] Pagination works
- [x] Movie details work
- [x] Wishlist works
- [x] Wishlist persists
- [x] Duplicate wishlist entries are prevented
- [x] Loading state works
- [x] Empty state works
- [x] Error state works
- [x] Mobile UI works
- [x] Production frontend build succeeds
- [x] Secrets are excluded from Git
- [x] `.env.example` is included
- [x] README documentation is included

---

# 43. Repository

GitHub repository:

https://github.com/NithinBrammesh/CineScope

---

## Author

**Nithin B**