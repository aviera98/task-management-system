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

## Quality Gates

```bash
cd src/frontend
npm run lint
npm run build
```

```bash
dotnet build TaskManagementSystem.sln
dotnet test TaskManagementSystem.sln
```

## Troubleshooting

- If SQL Server fails immediately, verify that `MSSQL_SA_PASSWORD` satisfies SQL Server password rules.
- If `backend` stays unhealthy, inspect logs with `docker compose logs backend` and confirm that `sqlserver` is healthy first.
- If the frontend loads but cannot reach the API in later stages, confirm that `BACKEND_PORT` in `.env` still matches the published backend port.
- If Docker caches an outdated image, rebuild with `docker compose build --no-cache`.
