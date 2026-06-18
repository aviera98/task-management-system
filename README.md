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
