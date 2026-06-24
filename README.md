# Task Management System

Initial full stack base for a Task Management System portfolio project.

## Stack

- Frontend: React, TypeScript, Vite, React Router, Tailwind
- Backend: ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, Swagger
- Quality: ESLint, Prettier, Husky, lint-staged

## Goal

Provide a professional initial structure only, without business logic yet.

## Structure

- `src/frontend`: React application
- `src/backend/TaskManagementSystem.Api`: ASP.NET Core Web API
- `tests/backend`: integration and placeholder backend tests

## Container Architecture

The local Docker environment is composed of three services:

- `frontend`: Vite development server exposed on `5173`
- `backend`: ASP.NET Core 8 Web API exposed on `8080`
- `sqlserver`: SQL Server 2022 exposed on `1433`

Container networking details:

- All services run on the internal bridge network `taskms-network`
- `backend` connects to SQL Server using the service hostname `sqlserver`
- SQL Server data persists in the named volume `sqlserver-data`

Healthchecks:

- `backend`: `GET /api/health`
- `sqlserver`: `sqlcmd SELECT 1`

## Run Locally

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```

### Backend

```bash
dotnet restore TaskManagementSystem.sln
dotnet run --project src/backend/TaskManagementSystem.Api
```

Swagger is available in development. In `Development`, the API uses an in-memory database so it can start even without SQL Server running locally. The SQL Server connection is still configured in `appsettings.json` for the next stage.

The backend now includes base user infrastructure:

- `User` entity with EF Core mapping
- unique index on `Email`
- repository and service layer
- Swagger endpoints for user creation and reads
- automatic EF Core migration on startup for SQL Server environments

## Docker Setup

1. Create a local environment file:

```bash
cp .env.example .env
```

2. Start the full stack:

```bash
docker compose up --build
```

3. Open the services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger`

To stop the environment:

```bash
docker compose down
```

To stop and remove the SQL Server volume:

```bash
docker compose down -v
```

## Environment Variables

The main variables are documented in `.env.example`:

- `ASPNETCORE_ENVIRONMENT`
- `FRONTEND_PORT`
- `BACKEND_PORT`
- `SQLSERVER_PORT`
- `SQLSERVER_DATABASE`
- `MSSQL_SA_PASSWORD`
- `MSSQL_PID`
- `ADMIN_USER_SEED_ENABLED`
- `ADMIN_USER_SEED_FIRSTNAME`
- `ADMIN_USER_SEED_LASTNAME`
- `ADMIN_USER_SEED_EMAIL`
- `ADMIN_USER_SEED_PASSWORD`

## Quality Gates

```bash
cd src/frontend
npm run lint
npm run build
npm run test
npm run test:coverage
```

```bash
dotnet build TaskManagementSystem.sln
dotnet test TaskManagementSystem.sln
```

## Testing

### Frontend

The frontend test stack uses:

- `Vitest`
- `React Testing Library`
- `jsdom`
- `@vitest/coverage-v8`

Commands:

```bash
cd src/frontend
npm run test
npm run test:coverage
```

Coverage output:

- text summary in the terminal
- HTML report under `src/frontend/coverage`

Current frontend coverage:

- Statements: `89.32%`
- Branches: `80.12%`
- Functions: `95.00%`
- Lines: `89.26%`

Covered frontend areas:

- `TasksPage` loading, empty, error and populated states
- `TaskForm` create, edit and validation flows
- `AuthProvider` login, logout and session restore
- `ProtectedRoute` authenticated and unauthenticated navigation
- HTTP client and API wrappers
- task query/mutation hooks

### Backend

The backend test stack uses:

- `xUnit`
- `FluentAssertions`
- ASP.NET Core integration tests
- `coverlet.collector`

Commands:

```bash
dotnet test TaskManagementSystem.sln
dotnet test tests/backend/TaskManagementSystem.Api.IntegrationTests/TaskManagementSystem.Api.IntegrationTests.csproj --collect:"XPlat Code Coverage" --settings tests/backend/coverage.runsettings
```

Coverage output:

- Cobertura XML under `tests/backend/**/TestResults/**/coverage.cobertura.xml`
- backend coverage filtering rules are defined in `tests/backend/coverage.runsettings`

Current backend API coverage:

- Lines: `83.20%`

The backend coverage command intentionally excludes generated or non-business files from the API metric:

- EF Core migrations
- Swagger example filter
- design-time `ApplicationDbContextFactory`
- generated files under `obj`

Covered backend areas:

- `GET /api/tasks` returns only the authenticated user's tasks
- `GET /api/tasks/{id}` allows own access and blocks cross-user access
- `POST /api/tasks` handles creation and validation failures
- `PUT /api/tasks/{id}` updates owned tasks and blocks foreign tasks
- `DELETE /api/tasks/{id}` deletes owned tasks and blocks foreign tasks
- login JWT claims and user ownership flow are validated through integration tests

### Strategy

The testing strategy is intentionally split by responsibility:

- frontend tests focus on user-visible flows, route protection, state transitions and form behavior
- backend integration tests focus on HTTP contracts, authorization boundaries, ownership restrictions and data persistence
- coverage excludes generated artifacts so CI can enforce meaningful thresholds on production code

## Troubleshooting

- If SQL Server fails immediately, verify that `MSSQL_SA_PASSWORD` satisfies SQL Server password rules.
- If `backend` stays unhealthy, inspect logs with `docker compose logs backend` and confirm that `sqlserver` is healthy first.
- If the frontend loads but cannot reach the API in later stages, confirm that `BACKEND_PORT` in `.env` still matches the published backend port.
- If Docker caches an outdated image, rebuild with `docker compose build --no-cache`.
