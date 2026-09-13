# CineScope — Movie Discovery & Wishlist Platform
CineScope is a full-stack movie discovery application built with **React, Node.js, Express, PostgreSQL, Docker Compose, and the TMDB API**.

The application allows users to discover movies, search for movies, filter and sort results, view movie details, and maintain a persistent wishlist.

The project uses a **modular monolith architecture**. The React frontend communicates only with the CineScope backend. The backend handles TMDB communication and PostgreSQL persistence.

---
### Quick Links

- **Live Frontend:** https://cinescope-web.netlify.app
- **Backend API:** https://cinescope-api-5mjg.onrender.com
- **Backend Health:** https://cinescope-api-5mjg.onrender.com/api/health
- **GitHub Repository:** https://github.com/NithinBrammesh/CineScope
- **Loom Demo Video:** https://www.loom.com/share/23bf34e0174e4f99a87f88880a2ad245
- **Mobile Responsive View:** https://drive.google.com/file/d/1tptvVkxkAZB6O52Avrhntb0uIenA8hGm/view

---

## 1. Project Overview
### Objective
The project demonstrates:
- React frontend development
- Node.js and Express backend development
- REST API design
- Third-party API integration
- PostgreSQL persistence
- Movie discovery and search
- Filtering and sorting
- Pagination
- Movie details
- Persistent wishlist functionality
- Loading, empty, and error states
- Responsive UI
- External API reliability handling
- Maintainable application structure
### Core Architecture
```text
User
 |
 v
React Frontend
 |
 | REST / JSON
 v
Node.js + Express
 |             |
 v             v
PostgreSQL    TMDB API
```
The frontend never communicates directly with TMDB.
---

### Scope

The application is intentionally focused on the assignment requirements.

The primary user journey is discovering a movie, narrowing the result set, opening details, and saving a movie.

The implementation avoids adding unrelated product functionality.

The architecture is small enough to understand while still demonstrating separation of concerns.

The same structure can be extended without replacing the existing request flow.


## 2. Architecture
CineScope follows a three-tier architecture with a layered backend.
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
              |   ↓                                   |
              | Controllers                           |
              |   ↓                                   |
              | Services                              |
              |   ↓                  ↓                |
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
### Why this architecture?
A modular monolith is appropriate for the current assignment because it provides:
- Clear separation of responsibilities
- Simple local development
- Simple deployment
- Low infrastructure complexity
- Easier debugging
- Easier testing
- A path to future scaling
Microservices, Kafka, Kubernetes, or other distributed infrastructure are not necessary for the current scope.
---

### Component Boundaries

The frontend is responsible for presentation and interaction.

The backend is responsible for application behavior and external integration.

PostgreSQL is responsible for persistent wishlist data.

TMDB remains an external source of movie information.

Each boundary has a clear interface.

This makes the application easier to reason about during development and debugging.


## 3. System Design
The backend is organized into logical modules while remaining one deployable application.
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
### Backend request pattern
```text
HTTP Request
     |
     v
Route
     |
     v
Controller
     |
     v
Service
     |
     +---------> PostgreSQL
     |
     +---------> TMDB Client
     |
     v
Normalized Response
     |
     v
HTTP Response
```
This structure keeps HTTP handling, business logic, persistence, and external API integration separate.
---

### Module Interaction

Movie discovery and wishlist persistence are treated as separate backend responsibilities.

Movie requests normally travel through the route, controller, service, and TMDB client.

Wishlist requests travel through the route, controller, service, and database layer.

The controller does not contain the external API implementation.

The service layer coordinates the required operations.

This keeps the main application flow readable.


## 4. Backend Architecture
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
### Layer responsibilities
**Routes**
Define the HTTP endpoints.
**Controllers**
Handle HTTP requests and responses.
**Services**
Contain application and business logic.
**TMDB Client**
Handles communication with the external movie API.
**Database Layer**
Handles PostgreSQL connectivity and persistence.
**Middleware**
Provides shared validation and error-handling behavior.

---

### Backend Maintainability

The backend avoids placing all logic inside Express route handlers.

Configuration is isolated from application logic.

External API communication is isolated inside the TMDB client.

Database access remains separate from HTTP response formatting.

Shared error behavior is handled through middleware.

This organization makes individual files easier to inspect and change.


## 5. Frontend Architecture
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
### Frontend responsibilities
The frontend handles:
- UI rendering
- User interaction
- Navigation
- UI state
- API calls to the CineScope backend
- Loading states
- Empty states
- Error states
- Responsive presentation
The frontend does **not** contain the TMDB access token.
---

### UI Organization

Pages represent major application screens.

Reusable components handle repeated visual patterns.

The API client centralizes frontend communication with the backend.

The application state controls loading, results, errors, and wishlist behavior.

Responsive CSS adapts the same application to smaller screens.

The frontend therefore remains focused on user experience rather than external API details.


## 6. Request and Data Flow
### Movie Discovery
```text
User
 |
 v
Home Page
 |
 v
GET /api/movies
 |
 v
Movie Route
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
TMDB API
 |
 v
Normalize Movie Data
 |
 v
React Movie Grid
```
### Search
```text
User enters "Batman"
 |
 v
Search Bar
 |
 v
Frontend API Client
 |
 v
GET /api/movies/search?q=batman&page=1
 |
 v
Backend
 |
 v
TMDB Search API
 |
 v
Normalized Results
 |
 v
Search Results
```
### Movie Details
```text
User selects movie
 |
 v
Movie Details Page
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
Details Page
```
### Wishlist
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
Wishlist Controller
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

### End-to-End Responsibility

A request begins with a user interaction in React.

The frontend sends a request to the CineScope API.

Express routes the request to the appropriate controller.

The controller delegates application behavior to a service.

The service communicates with PostgreSQL or the TMDB client as required.

The response is normalized before it reaches the UI.


## 7. External API Abstraction
The frontend does not call TMDB directly.
```text
React
 |
 | CineScope REST API
 v
CineScope Backend
 |
 | TMDB Client
 v
TMDB
```
This abstraction provides several benefits:
- Keeps TMDB credentials on the server
- Prevents frontend coupling to TMDB
- Provides a stable application API
- Allows response normalization
- Centralizes timeout and retry behavior
- Makes future provider changes easier
### Normalized movie model
The backend exposes an application-level movie object:
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
The frontend therefore depends on CineScope's model instead of TMDB's raw response structure.

---

### Provider Isolation

TMDB is treated as an implementation detail of the backend.

Changing the external provider would not require the frontend to understand a new provider API.

The normalized response also reduces the amount of provider-specific data exposed to the browser.

Credentials remain server-side.

Timeout and retry rules are centralized.

This is the main reason for keeping a dedicated TMDB client.


## 8. Database Design
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
The wishlist is stored in PostgreSQL so that it survives:
- Browser refreshes
- Backend restarts
- Application restarts
### Persistence flow
```text
React
 |
 v
Express
 |
 v
Wishlist Service
 |
 v
PostgreSQL
 |
 v
Saved Wishlist
```
---

### Data Ownership

Movie discovery data comes from TMDB.

Wishlist ownership belongs to the CineScope database.

The database stores the information required to reconstruct the wishlist view.

A movie can be removed without affecting the external movie catalogue.

The database therefore represents user application state rather than attempting to replace TMDB.

PostgreSQL provides the persistence boundary for this state.


## 9. API Design
Base URL:
```text
http://localhost:4000
```
### API summary
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API/database health |
| GET | `/api/movies` | Discover movies |
| GET | `/api/movies/search` | Search movies |
| GET | `/api/movies/:id` | Movie details |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add movie |
| DELETE | `/api/wishlist/:movieId` | Remove movie |
### Health
```http
GET /api/health
```
### Discovery
```http
GET /api/movies
```
With pagination:
```http
GET /api/movies?page=1
```
With year filtering:
```http
GET /api/movies?page=1&year=2024
```
### Search
```http
GET /api/movies/search?q=batman&page=1
```
### Details
```http
GET /api/movies/414906
```
### Wishlist
```http
GET /api/wishlist
```
```http
POST /api/wishlist
```
```http
DELETE /api/wishlist/414906
```
---

### API Contract

The API uses predictable resource-oriented paths.

Query parameters are used for search, filtering, sorting, and pagination.

Movie responses follow a normalized application-level shape.

Wishlist operations use the movie identifier to add or remove saved items.

The health endpoint provides a simple operational check.

The API contract keeps frontend code independent from TMDB response details.


## 10. Wishlist Design
The assignment did not require authentication, so the current implementation uses a simple default-user model.
### Add
```text
Movie
 |
 v
POST /api/wishlist
 |
 v
Wishlist Service
 |
 v
PostgreSQL
```
### Remove
```text
Movie
 |
 v
DELETE /api/wishlist/:movieId
 |
 v
Wishlist Service
 |
 v
PostgreSQL
```
### Duplicate prevention
The backend checks whether a movie already exists for the current user.
```text
Movie not saved
      |
      v
Add Movie
Movie already saved
      |
      v
Do not create duplicate
```
The UI also reflects the current wishlist state, allowing the user to remove an already-saved movie.

---

### Persistence Behavior

Adding a movie creates a wishlist record for the current default user.

Removing a movie deletes the corresponding saved record.

The wishlist can be loaded again after a browser refresh.

The data also survives a backend restart because it is stored in PostgreSQL.

Duplicate prevention keeps repeated add operations from creating unnecessary records.

The current default-user approach can later be replaced by authenticated user ownership.


## 11. Reliability and Error Handling
The application handles failures from the external movie service and backend.
### External API failure
```text
TMDB Request
     |
     +---- Success ------> Return Data
     |
     +---- Transient Failure
             |
             v
           Retry
             |
             v
        Final Response
             |
             v
       Frontend Error State
```
### Timeout
External requests have timeout protection so that a slow TMDB response does not keep a backend request open indefinitely.
```text
Backend
   |
   v
TMDB Request
   |
   +---- Response ---> Success
   |
   +---- Timeout ----> Error Response
```
### Retry
The TMDB client performs limited retries for appropriate transient failures.
The strategy avoids retrying permanent client errors such as invalid requests or authentication failures.
Retries are intentionally limited to avoid excessive external API traffic.
### Wishlist fallback
When retrieving wishlist movie details, failure of one external movie request should not make the entire wishlist unusable. Stored database information can be used as fallback data where available.

---

### Failure Boundaries

Failures are handled at the layer where they are meaningful.

The TMDB client handles external request behavior.

The backend converts failures into controlled API responses.

The frontend displays a usable error state instead of exposing raw stack traces.

Transient failures receive limited retry treatment.

Permanent client errors are not repeatedly retried.


## 12. UI States and Responsive Design
The application handles the major UI states required for a usable application.
### Loading
Loading skeletons are displayed while movie data is being retrieved.
### Empty
An empty state is displayed when a search or filtered request returns no results.
### Error
An error state is displayed when an API request fails, with retry behavior where appropriate.
### Success
Movie cards are displayed after successful data retrieval.
### Responsive layout
The interface supports:
- Desktop
- Tablet
- Mobile
The movie and wishlist grids adapt to smaller screen sizes.
Example mobile layout:
```text
+----------+ +----------+
|   Movie  | |   Movie  |
+----------+ +----------+
+----------+ +----------+
|   Movie  | |   Movie  |
+----------+ +----------+
```
Pagination and spacing are also adjusted for mobile screens.
---

### Responsive Behavior

The layout is designed to remain usable on desktop, tablet, and mobile widths.

Movie cards resize with the available viewport.

Controls remain accessible when the screen becomes narrow.

Wishlist cards use a compact mobile arrangement.

Spacing and pagination controls are adjusted for smaller screens.

The mobile view was manually verified as part of the final application checks.


## 13. Requirements and Completion Status
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

### Requirement Mapping

Each major assignment requirement maps to an implemented application behavior.

Discovery maps to the home movie grid.

Search maps to the search flow.

Categories map to genre filtering.

Large result handling maps to pagination.

Persistence maps to the PostgreSQL wishlist.

Failure handling maps to loading, empty, and error states.

Responsive behavior maps to the mobile and desktop layouts.


## 14. Features
### Movie Discovery
Users can browse movies retrieved through the backend.
Movie cards display:
- Poster
- Title
- Release year
- Rating
- Vote count where available
### Search
Users can search for movies by title.
Example:
```text
Batman
```
Backend request:
```http
GET /api/movies/search?q=batman&page=1
```
### Filtering
Movies can be filtered by:
- Genre
- Release year
### Sorting
Results can be sorted using supported movie attributes such as:
- Rating
- Release date
- Popularity
### Pagination
Movie results are paginated rather than loading a large result set into the browser at once.
### Movie Details
Users can view:
- Title
- Poster
- Backdrop
- Overview
- Release date
- Rating
- Vote count
### Wishlist
Users can:
- Add movies
- Remove movies
- View saved movies
- Persist wishlist data
- Prevent duplicate entries
### Navigation
The application provides navigation between:
- Discover
- Search
- Movie Details
- Wishlist
---

### User Journey

A user can begin on the discovery page without needing an account.

The user can search for a movie such as Batman.

The user can narrow the result using available filters.

The user can change sorting without leaving the result flow.

The user can open a movie to inspect its details.

The user can save the movie and later open the wishlist page.


## 15. Technology Stack
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

### Why This Stack

React and Vite provide a lightweight frontend development experience.

Node.js and Express provide a straightforward REST backend.

PostgreSQL is suitable for durable relational application data.

Docker Compose simplifies local database setup.

TMDB supplies the movie catalogue and metadata.

Git and GitHub provide source control and repository hosting.


## 16. Project Structure
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

### Repository Organization

The repository keeps frontend and backend code in separate directories.

The root contains the shared README and Docker Compose configuration.

Backend source is organized by responsibility.

Frontend source is organized around pages, reusable components, and services.

Environment examples are kept without real credentials.

Build output and local environment files are excluded from version control.


## 17. Docker and Environment Configuration
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
PostgreSQL uses:
```text
postgres:16-alpine
```
The local PostgreSQL port is configured through Docker Compose.
### Environment variables
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
The actual TMDB access token must never be committed to Git.
The repository contains:
```text
backend/.env.example
```
The `.gitignore` excludes environment files, dependencies, build output, and local files.

---

### Environment Safety

Environment-specific values are not hard-coded into the application.

Local development uses a backend `.env` file.

The repository contains `.env.example` as a configuration reference.

The real TMDB token is excluded from Git.

Production services receive their own environment configuration.

This keeps configuration separate from source code.


## 18. Running Locally
### Prerequisites
Install:
- Node.js
- npm
- Docker
- Docker Compose
- Git
PostgreSQL does not need to be installed directly because it runs through Docker.
### Clone
```bash
git clone https://github.com/NithinBrammesh/CineScope.git
cd CineScope
```
### Start PostgreSQL
```bash
docker compose up -d
```
Verify:
```bash
docker ps
```
### Start backend
```bash
cd backend
npm install
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
### Start frontend
Open another terminal:
```bash
cd CineScope/frontend
npm install
npm run dev
```
The Vite development server will provide the frontend URL.

---

### Local Startup Order

The local database should be running before the backend performs database operations.

The backend can then be started from the `backend` directory.

The frontend is started separately from the `frontend` directory.

The Vite development server communicates with the backend through the configured proxy.

This setup mirrors the production separation between frontend and backend services.


## 19. Frontend Proxy and API Communication
During local development, the frontend uses the Vite development server while API requests are forwarded to the Express backend.
```text
Browser
   |
   v
Vite
localhost:5173
   |
   | /api/\*
   v
Express
localhost:4000
```
This allows the frontend to use relative backend API paths without directly exposing TMDB.
The frontend API client is responsible for communicating with:
```text
/api/movies
/api/movies/search
/api/movies/:id
/api/wishlist
```
---

### Communication Boundary

The browser communicates with the CineScope backend rather than TMDB.

Local development uses the Vite proxy for `/api` requests.

Production uses the configured backend base URL.

This keeps frontend API calls consistent across environments.

The backend remains the single integration point for movie data.

The same REST contract is used regardless of whether the application is local or deployed.


## 20. Testing and Verification
The main application flows were manually verified.
### Backend
- Server starts successfully
- PostgreSQL connection works
- Health endpoint works
- TMDB connectivity works
- Movie discovery works
- Search works
- Genre filtering works
- Year filtering works
- Sorting works
- Pagination works
- Movie details work
- Wishlist API works
- Wishlist persistence works
- Wishlist removal works
- Duplicate prevention works
- Timeout handling is implemented
- Transient retry handling is implemented
### Frontend
- Movie discovery loads
- Search works
- Empty search state works
- Genre filter works
- Year filter works
- Sorting works
- Pagination works
- Movie details page works
- Add to wishlist works
- Remove from wishlist works
- Wishlist page works
- Wishlist persists after backend restart
- Loading state works
- Error state works
- Responsive layout works
- Mobile layout was verified
### Code validation
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

### Manual Verification

The core discovery flow was tested from the user interface.

Search was tested with a real movie query.

Genre and year filters were tested against search and discovery flows.

Sorting and pagination were checked after filtering.

Movie details were opened from result cards.

Wishlist add, remove, duplicate prevention, and persistence were verified.


## 21. Engineering Decisions
### REST API
REST was selected because the application has straightforward movie and wishlist resources.
### Modular monolith
A modular monolith keeps the project simple while still separating responsibilities.
### PostgreSQL
PostgreSQL provides reliable persistence for wishlist data.
### Backend API abstraction
TMDB access is isolated from the frontend.
### Normalized movie model
The backend converts external TMDB responses into a stable CineScope movie model.
### Limited retries
Only appropriate transient failures are retried.
### Default user
A default-user model is used because authentication was outside the assignment scope.
### Pagination
Pagination prevents unnecessarily large result sets from being rendered in the browser.

---

### Practical Trade-offs

The project favors a clear modular monolith over unnecessary distributed infrastructure.

REST is sufficient for the current resource model.

PostgreSQL is sufficient for the current persistence requirement.

A default user avoids introducing authentication complexity that the assignment does not require.

Limited retries provide resilience without creating uncontrolled external traffic.

These decisions keep the implementation understandable and deployable.


## 22. Performance, Scalability and Security
### Performance
The application uses:
- Pagination
- Normalized responses
- Limited external retries
- Persistent database storage
- Responsive rendering
### Caching
Repeated movie requests can benefit from server-side caching.
A cache layer is present in the project structure and can be extended with Redis for production use.
A future caching flow could be:
```text
Request
  |
  v
Cache
  |
  +---- HIT ------> Return Cached Data
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
       Return Data
```
### Scalability
The current design can evolve toward:
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
Possible future infrastructure includes:
- Multiple backend instances
- Redis
- CDN
- Rate limiting
- Background jobs
- Monitoring
- Centralized logging
### Security
The TMDB access token remains on the backend.
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
  | Secret token
  v
TMDB
```
Environment files are excluded from Git.
---

### Operational Simplicity

The current deployment uses a small number of managed services.

The frontend is statically hosted.

The backend is deployed as one Node.js service.

The database is a managed PostgreSQL service.

The external movie provider remains isolated behind the backend.

This is sufficient for the expected scale of the assignment.


## 23. Limitations and Future Improvements
### Current limitations
**Authentication**
A complete authentication system is not implemented because it was outside the assignment scope.
**Default user**
The wishlist currently uses a default-user model.
**External dependency**
Movie discovery and movie details depend on TMDB availability.
**Production cache**
A distributed Redis cache is not deployed as part of the current assignment.
**Rate limiting**
Production-level rate limiting can be added.
**Observability**
Centralized logging, metrics, tracing, and alerting are future improvements.
### Future improvements
#### Authentication
- User registration
- Login
- JWT/session authentication
- User-specific wishlists
#### Performance
- Redis caching
- Request deduplication
- Search debouncing
- Request cancellation
- CDN
#### API protection
- Rate limiting
- Stronger validation
- Security headers
#### Observability
- Structured logging
- Metrics
- Distributed tracing
- Error monitoring
- Health dashboards
#### Deployment
- Cloud PostgreSQL
- Containerized backend
- Static frontend hosting
- HTTPS
- CI/CD
---

### Future Direction

Authentication can be added when multiple real users are required.

The wishlist schema can then associate records with authenticated user identifiers.

A distributed cache can be introduced when repeated movie requests justify it.

Rate limiting can protect the backend from excessive client traffic.

Structured logging and metrics can improve production visibility.

These changes can be introduced incrementally without changing the core frontend contract.


## 24. Deployment

CineScope is deployed as a simple full-stack application using separate frontend, backend, and database services.

### Frontend Deployment

The React frontend is deployed on Netlify.

- Hosting platform: Netlify
- Repository: GitHub
- Branch: `main`
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Frontend environment variable: `VITE_API_BASE_URL`
- Production frontend: https://cinescope-web.netlify.app

The frontend is a static Vite production build.

### Backend Deployment

The Node.js and Express backend is deployed on Render.

- Hosting platform: Render
- Service: `cinescope-api`
- Runtime: Node.js
- Branch: `main`
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Production backend: https://cinescope-api-5mjg.onrender.com
- Health endpoint: https://cinescope-api-5mjg.onrender.com/api/health

The backend stores the TMDB access token in environment configuration rather than exposing it to the browser.

### Database Deployment

The production PostgreSQL database is hosted using Render PostgreSQL.

- Database service: `cinescope-db`
- Database type: PostgreSQL
- Region: Oregon
- The backend uses the database connection URL supplied by the hosted database service.
- Wishlist records are stored in PostgreSQL and remain available across application restarts.

### Local Database Infrastructure

For local development, PostgreSQL runs through Docker Compose.

- Image: `postgres:16-alpine`
- Docker Compose is used to start the database locally.
- The application connects to PostgreSQL through the configured `DATABASE_URL`.

### Production Request Flow

```text
User
 |
 v
Netlify
React Frontend
 |
 | HTTPS / REST / JSON
 v
Render
Node.js + Express
 |              |
 v              v
Render       TMDB API
PostgreSQL
 |
 v
Wishlist Data
```

Only the deployment services used for the submitted application are documented here.
No additional Kubernetes, Redis, Kafka, or other deployment infrastructure is required for the current implementation.

---

### Deployment Simplicity

The deployed architecture keeps the frontend and backend independently deployable.

Netlify serves the production React build.

Render runs the Node.js and Express API.

Render PostgreSQL stores persistent wishlist data.

The backend connects to the hosted database using its production connection configuration.

The frontend connects to the deployed backend through `VITE_API_BASE_URL`.


## 25. Submission Checklist and Repository
### Submission Checklist
- [x] Frontend and backend run successfully
- [x] PostgreSQL runs through Docker Compose
- [x] TMDB integration works
- [x] Search, filters, sorting, and pagination work
- [x] Movie details and wishlist work with persistence
- [x] Loading, empty, error, and responsive states are handled
- [x] Production frontend build succeeds
- [x] Secrets are excluded from Git
- [x] `.env.example` is included
- [x] README documentation is included
### Repository
**GitHub:**  
https://github.com/NithinBrammesh/CineScope
### Author
**Nithin B**