# Architecture

This document describes the main architectural decisions behind Task Management System.

## System Overview

```mermaid
flowchart LR
    User[User] --> Browser[React SPA]
    Browser -->|HTTP JSON| Api[ASP.NET Core Web API]
    Api --> Services[Service Layer]
    Services --> Repositories[Repository Layer]
    Repositories --> Db[(SQL Server)]
    Api --> Swagger[Swagger/OpenAPI]

    subgraph Docker Compose
        Browser
        Api
        Db
    end

    GitHub[GitHub Actions] -->|CI| Browser
    GitHub -->|CI| Api
```

The application is split into a React frontend, an ASP.NET Core backend, and a SQL Server database. Docker Compose provides the local runtime environment, while GitHub Actions validates the project automatically on every push and pull request.

## Frontend Architecture

The frontend is organized by feature.

```text
src/frontend/src/
  features/
    auth/
    tasks/
  components/
  layouts/
  pages/
  hooks/
  services/
  types/
  utils/
```

The main goal is to keep user-facing workflows close to their components, hooks, API functions, and types.

Responsibilities:

- Pages coordinate full screens.
- Components render reusable UI.
- Hooks contain stateful behavior.
- API modules isolate HTTP calls.
- Types keep request and response contracts explicit.
- Tests cover user-visible behavior and important state transitions.

## Backend Architecture

The backend follows a layered design.

```mermaid
flowchart TD
    Controller[Controllers] --> DTOs[Request/Response DTOs]
    Controller --> Service[Service Layer]
    Service --> Repository[Repository Interfaces]
    Repository --> EF[Entity Framework Core]
    EF --> Database[(SQL Server)]
    Service --> Domain[Domain Entities and Rules]
```

### Repository Pattern

Repositories isolate persistence details from business logic.

Benefits:

- Controllers and services do not depend directly on Entity Framework queries.
- Data access can evolve without changing HTTP contracts.
- Integration tests can focus on behavior rather than query implementation.
- Ownership rules and query boundaries remain explicit.

Current repository responsibilities include:

- User lookup and persistence.
- Task lookup, creation, update, and deletion.
- User-scoped task access.

### Service Layer

The service layer contains application business rules.

Examples:

- Registering a user.
- Validating duplicate emails.
- Hashing passwords.
- Authenticating credentials.
- Generating JWT access tokens.
- Enforcing task ownership.
- Mapping entities to DTO responses.

Controllers should remain thin. They receive HTTP requests, delegate work to services, and return HTTP responses.

## Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant API as ASP.NET Core API
    participant AuthService
    participant UserRepository
    participant JwtService
    participant DB as SQL Server

    User->>UI: Submit email and password
    UI->>API: POST /api/auth/login
    API->>AuthService: LoginAsync(request)
    AuthService->>UserRepository: GetByEmailAsync(email)
    UserRepository->>DB: Query user by email
    DB-->>UserRepository: User
    UserRepository-->>AuthService: User
    AuthService->>AuthService: Verify password hash
    AuthService->>JwtService: CreateToken(user)
    JwtService-->>AuthService: JWT and expiration
    AuthService-->>API: LoginResponse
    API-->>UI: 200 OK with access token
    UI->>UI: Store authenticated session
```

Authenticated requests include:

```text
Authorization: Bearer <access-token>
```

The backend validates issuer, audience, lifetime, and signing key before allowing protected endpoints.

## Request Lifecycle

```mermaid
sequenceDiagram
    participant Client as React Client
    participant Middleware as ASP.NET Middleware
    participant Controller
    participant Service
    participant Repository
    participant DB as SQL Server

    Client->>Middleware: HTTP request
    Middleware->>Middleware: Error handling, routing, auth
    Middleware->>Controller: Valid request
    Controller->>Service: DTO input
    Service->>Repository: Business operation
    Repository->>DB: EF Core query/command
    DB-->>Repository: Data result
    Repository-->>Service: Entity/result
    Service-->>Controller: Response DTO
    Controller-->>Client: HTTP response
```

Validation happens at the API boundary through data annotations and custom validators. Unexpected errors are normalized by exception handling middleware.

## Database Design

```mermaid
erDiagram
    USER ||--o{ TASK_ITEM : owns

    USER {
        uniqueidentifier Id PK
        string FirstName
        string LastName
        string Email UK
        string PasswordHash
        string Role
        datetime CreatedAt
        datetime UpdatedAt
    }

    TASK_ITEM {
        uniqueidentifier Id PK
        uniqueidentifier UserId FK
        string Title
        string Description
        string Status
        string Priority
        datetime DueDate
        datetime CreatedAt
        datetime UpdatedAt
    }
```

Design notes:

- `User.Email` has a unique constraint.
- `TaskItem.UserId` links tasks to their owner.
- Task endpoints must only return or mutate tasks owned by the authenticated user.
- Passwords are stored as hashes, never as plaintext.
- EF Core migrations define the database schema.

## Component Relationships

```mermaid
flowchart TD
    App[App] --> Router[React Router]
    Router --> AuthProvider[AuthProvider]
    AuthProvider --> AuthStorage[Auth Storage]
    Router --> ProtectedRoute[ProtectedRoute]
    ProtectedRoute --> TasksPage[TasksPage]
    TasksPage --> UseTasksQuery[useTasksQuery]
    TasksPage --> UseTaskMutations[useTaskMutations]
    UseTasksQuery --> TasksApi[tasks-api]
    UseTaskMutations --> TasksApi
    TasksApi --> HttpClient[http-client]
    HttpClient --> Backend[ASP.NET Core API]
```

## Docker Architecture

```mermaid
flowchart LR
    subgraph taskms-network
        Frontend[frontend container<br/>Vite :5173]
        Backend[backend container<br/>ASP.NET Core :8080]
        SqlServer[sqlserver container<br/>SQL Server :1433]
    end

    Frontend -->|VITE_API_BASE_URL| Backend
    Backend -->|ConnectionStrings__DefaultConnection| SqlServer
    SqlServer --> Volume[(sqlserver-data volume)]
```

Docker Compose responsibilities:

- Build the frontend and backend images.
- Start SQL Server with a persistent volume.
- Inject runtime configuration through environment variables.
- Run health checks before dependent services start.
- Expose local ports for browser and API access.

## CI/CD Architecture

```mermaid
flowchart TD
    Push[push or pull_request] --> Checkout[Checkout]
    Checkout --> Node[Setup Node.js]
    Checkout --> Dotnet[Setup .NET 8]
    Node --> FrontendRestore[npm ci]
    Dotnet --> BackendRestore[dotnet restore]
    FrontendRestore --> Lint[ESLint]
    Lint --> Format[Prettier check]
    Format --> FrontendBuild[Frontend build]
    FrontendBuild --> FrontendTests[Frontend tests]
    FrontendTests --> FrontendCoverage[Frontend coverage]
    BackendRestore --> BackendBuild[Backend build]
    BackendBuild --> BackendTests[Backend tests]
    BackendTests --> BackendCoverage[Backend coverage]
    FrontendCoverage --> Artifacts[Upload artifacts]
    BackendCoverage --> Artifacts
```

The workflow is intentionally strict: lint, formatting, builds, tests, and coverage generation must pass before artifacts are published.

## Security Considerations

- JWT settings are configurable and should be provided through environment variables outside development.
- The committed base `appsettings.json` does not contain usable production secrets.
- Passwords are hashed before persistence.
- Controllers never return password hashes.
- Logs must never include passwords, JWTs, or secrets.
- User task access is scoped by authenticated user ownership.
