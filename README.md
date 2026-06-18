# Task Management System

Professional full stack portfolio project designed to demonstrate senior-level engineering across architecture, testing, DevOps and delivery practices.

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, React Hook Form, Zod
- Backend: ASP.NET Core 8 Web API, EF Core, SQL Server, JWT Authentication, Swagger
- Quality: ESLint, Prettier, Husky, lint-staged
- Testing: Vitest, React Testing Library, xUnit, Moq, FluentAssertions
- DevOps: Docker, Docker Compose, GitHub Actions

## Current Stage

Stage 1 is implemented. This increment establishes:

- Monorepo layout
- Feature-based frontend architecture
- Clean Architecture backend foundation
- Repository abstraction and seeded dashboard summary endpoint
- Initial unit and integration tests
- Docker and CI skeleton

Authentication, full task CRUD and advanced metrics are intentionally deferred to later increments so the codebase stays functional at every step.

## Structure

- `src/frontend`: React application
- `src/backend/TaskManagementSystem.Api`: ASP.NET Core entry point
- `src/backend/TaskManagementSystem.Application`: use cases and contracts
- `src/backend/TaskManagementSystem.Domain`: entities and domain rules
- `src/backend/TaskManagementSystem.Infrastructure`: EF Core and repository implementations
- `tests/backend`: backend unit and integration tests
- `docs/roadmap.md`: staged delivery plan

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

Swagger is available in development. The frontend expects the API at `https://localhost:7001` by default.

## Quality Gates

### Frontend

```bash
cd src/frontend
npm run lint
npm run test
npm run build
```

### Backend

```bash
dotnet build TaskManagementSystem.sln
dotnet test TaskManagementSystem.sln
```

## Docker

Docker files and `docker-compose.yml` are included for the next deployment increment.

```bash
docker compose up --build
```

## Next Increment

1. Add user entity, password hashing and JWT issuance.
2. Implement register, login and logout endpoints.
3. Connect frontend auth flows to real backend contracts.
