# Task Management System

[![Build](https://github.com/aviera98/task-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/aviera98/task-management-system/actions/workflows/ci.yml)
[![Tests](https://github.com/aviera98/task-management-system/actions/workflows/ci.yml/badge.svg?label=tests)](https://github.com/aviera98/task-management-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!-- Coverage badge placeholder: add Codecov, Coveralls, or another coverage provider badge here when external coverage publishing is enabled. -->

Task Management System is a full stack portfolio project that demonstrates a production-oriented approach to building a business application with React, TypeScript, ASP.NET Core 8, SQL Server, Docker, automated tests, and GitHub Actions.

The project is intentionally built as an interview-ready codebase: the goal is not only to implement task management features, but to show maintainable architecture, clean layering, secure authentication, automated quality gates, and professional documentation.

## Objectives

- Build a realistic enterprise-style task management application.
- Keep frontend and backend responsibilities clearly separated.
- Use DTOs, services, repositories, dependency injection, validation, and structured error handling.
- Protect task data with JWT authentication and user ownership rules.
- Run automated tests and coverage reports in CI for every push and pull request.
- Provide clear documentation for technical interviews and open source review.

## Main Features

- User registration with validation and duplicate email protection.
- Login with JWT authentication.
- Authenticated frontend session handling.
- Protected frontend routes.
- Task CRUD for authenticated users.
- User ownership enforcement for task operations.
- Dashboard summary query on the backend application layer.
- Swagger/OpenAPI support for backend endpoints.
- Docker Compose environment with frontend, backend, and SQL Server.
- Integration tests for backend HTTP contracts.
- Frontend component, hook, API, and route tests.
- CI pipeline with build, lint, test, coverage, and artifacts.
- Dependabot configuration for npm, NuGet, and GitHub Actions.

## Technologies

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- ESLint
- Prettier
- Vitest
- React Testing Library

### Backend

- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- Swagger/OpenAPI
- xUnit
- FluentAssertions
- coverlet.collector

### Infrastructure

- Docker
- Docker Compose
- SQL Server 2022 container
- Environment-based configuration
- Health checks
- Persistent SQL Server volume

### DevOps

- GitHub Actions
- Dependabot
- CI artifacts
- Coverage reports
- EditorConfig

## Architecture

The repository is organized as a monorepo with separate frontend, backend, and test areas.

```text
src/
  frontend/
  backend/
    TaskManagementSystem.Api/
    TaskManagementSystem.Application/
    TaskManagementSystem.Domain/
    TaskManagementSystem.Infrastructure/
tests/
  backend/
docs/
```

### Frontend

The frontend uses a feature-based React structure. Authentication and tasks are grouped by feature, with local API clients, hooks, pages, components, and types.

Key responsibilities:

- Render user-facing workflows.
- Manage authenticated session state.
- Protect routes that require a logged-in user.
- Call backend APIs through typed service functions.
- Validate forms before sending requests.

### Backend

The backend follows a layered structure:

```text
Controller -> Service -> Repository -> Database
```

Controllers expose HTTP contracts, services contain business rules, repositories isolate data access, and DTOs prevent EF entities from leaking directly through the API.

### Database

SQL Server is used for persistent storage. Entity Framework Core manages entity mapping, migrations, relationships, and database initialization.

Main entities:

- `User`
- `TaskItem`

### Docker

Docker Compose runs the complete local environment:

- `frontend`: Vite application on port `5173`
- `backend`: ASP.NET Core API on port `8080`
- `sqlserver`: SQL Server on port `1433`

The backend waits for SQL Server health checks before starting, and SQL Server data is persisted in a named Docker volume.

### CI/CD

GitHub Actions runs on every `push` and `pull_request`.

The CI workflow:

1. Checks out the repository.
2. Installs Node.js.
3. Installs .NET 8.
4. Restores frontend dependencies.
5. Restores backend dependencies.
6. Runs frontend lint.
7. Runs frontend Prettier check.
8. Builds the frontend.
9. Runs frontend tests.
10. Generates frontend coverage.
11. Builds the backend.
12. Runs backend tests.
13. Generates backend coverage.
14. Publishes coverage and test result artifacts.

The pipeline fails fast if lint, format, build, or tests fail.

## Screenshots

The following screenshots should be added before publishing the repository on LinkedIn or using it in interviews.

| Area | Preview |
| --- | --- |
| Login | `docs/screenshots/login.png` |
| Registration | `docs/screenshots/register.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Task list | `docs/screenshots/tasks.png` |
| Swagger | `docs/screenshots/swagger.png` |

## Installation

### Prerequisites

- Node.js 22+
- .NET SDK 8
- Docker Desktop
- SQL Server only if running the backend outside Docker with SQL Server enabled

### Local Frontend

```bash
cd src/frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### Local Backend

```bash
dotnet restore TaskManagementSystem.sln
dotnet run --project src/backend/TaskManagementSystem.Api
```

Backend URL:

```text
http://localhost:8080
```

Swagger URL:

```text
http://localhost:8080/swagger
```

In `Development`, the API can use an in-memory database. For SQL Server scenarios, configure the connection string through environment variables or user secrets.

### Docker

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with local values. Do not commit `.env`.

Start the full stack:

```bash
docker compose up --build
```

Stop the stack:

```bash
docker compose down
```

Stop the stack and remove the SQL Server volume:

```bash
docker compose down -v
```

## Environment Variables

The Docker environment is configured through `.env`.

Important variables:

- `ASPNETCORE_ENVIRONMENT`
- `FRONTEND_PORT`
- `BACKEND_PORT`
- `SQLSERVER_PORT`
- `SQLSERVER_DATABASE`
- `MSSQL_SA_PASSWORD`
- `MSSQL_PID`
- `ADMIN_USER_SEED_ENABLED`
- `ADMIN_USER_SEED_EMAIL`
- `ADMIN_USER_SEED_PASSWORD`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_SECRET_KEY`
- `JWT_EXPIRATION_MINUTES`

Security notes:

- `.env` is ignored by Git.
- `appsettings.json` does not contain production secrets.
- Replace all example passwords and JWT keys before running outside local development.
- Keep admin seeding disabled unless a strong password is explicitly configured.

## Testing

### Frontend

```bash
cd src/frontend
npm run lint
npm run format
npm run build
npm run test
npm run test:coverage
```

Frontend coverage output:

```text
src/frontend/coverage
```

Current frontend coverage:

- Statements: 89.32%
- Branches: 80.12%
- Functions: 95.00%
- Lines: 89.26%

### Backend

```bash
dotnet restore TaskManagementSystem.sln
dotnet build TaskManagementSystem.sln --configuration Release
dotnet test TaskManagementSystem.sln --configuration Release
```

Backend coverage:

```bash
dotnet test TaskManagementSystem.sln \
  --configuration Release \
  --collect:"XPlat Code Coverage" \
  --settings tests/backend/coverage.runsettings \
  --results-directory TestResults/backend-coverage
```

Backend coverage output:

```text
TestResults/backend-coverage/**/coverage.cobertura.xml
```

Current backend coverage:

- Lines: 83%+

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [GitHub repository settings](docs/github-repository-settings.md)
- [Release notes v1.0.0](docs/releases/v1.0.0.md)
- [Changelog](CHANGELOG.md)

## Roadmap

### Completed

- Monorepo project structure.
- React + TypeScript frontend.
- ASP.NET Core 8 backend.
- SQL Server persistence.
- Docker Compose environment.
- Registration and login.
- JWT authentication.
- Protected frontend routes.
- Task CRUD.
- Backend integration tests.
- Frontend tests.
- Coverage reporting.
- GitHub Actions CI.
- Dependabot.
- Professional documentation baseline.

### Future Work

- External coverage badge integration.
- End-to-end tests with Playwright.
- Task filters, pagination, and sorting.
- Rich dashboard analytics.
- Role-based administration UI.
- Refresh token flow.
- Production deployment pipeline.
- Observability with structured logs and metrics.
- Cloud deployment reference architecture.

## License

This project is licensed under the [MIT License](LICENSE).
