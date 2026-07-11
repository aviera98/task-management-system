# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-10

### Added

- React and TypeScript frontend powered by Vite.
- ASP.NET Core 8 Web API backend.
- SQL Server persistence with Entity Framework Core.
- Docker Compose environment for frontend, backend, and SQL Server.
- Health checks for backend and SQL Server services.
- User registration endpoint with validation.
- Password complexity validation.
- Duplicate email handling.
- Password hashing before persistence.
- JWT login endpoint.
- JWT bearer authentication.
- Swagger/OpenAPI documentation.
- Authenticated frontend session state.
- Protected frontend routes.
- Task CRUD endpoints.
- User ownership enforcement for tasks.
- Frontend task list, task form, login, and registration flows.
- Backend integration tests.
- Backend unit tests for application and domain layers.
- Frontend tests with Vitest and React Testing Library.
- Frontend and backend coverage generation.
- GitHub Actions CI workflow for build, lint, tests, coverage, and artifacts.
- Dependabot configuration for npm, NuGet, and GitHub Actions.
- EditorConfig for consistent editor behavior.
- Professional README for portfolio publication.
- Architecture documentation with Mermaid diagrams.
- MIT license.
- Initial release notes for `v1.0.0`.

### Changed

- Hardened committed backend configuration by removing usable default secrets from base `appsettings.json`.
- Moved development-only JWT settings to `appsettings.Development.json`.
- Updated frontend TypeScript build boundaries so production builds exclude test files.
- Updated Vite configuration typing to support Vitest configuration cleanly.

### Security

- Removed default admin seed password from code defaults.
- Added explicit validation when admin seeding is enabled without a password.
- Documented secret handling and environment variable requirements.

## [0.4.0] - 2026-06-24

### Added

- Task ownership model.
- Task CRUD implementation.
- Task API integration tests.
- Frontend task UI and tests.
- Coverage reporting for frontend and backend.

## [0.3.0] - 2026-06-23

### Added

- JWT authentication.
- Login endpoint.
- Authenticated user response.
- JWT claim validation tests.
- Protected frontend routes.

## [0.2.0] - 2026-06-18

### Added

- User entity and repository.
- User service layer.
- Registration endpoint.
- Registration integration tests.
- Password hashing and validation.
- SQL Server migrations.

## [0.1.0] - 2026-06-18

### Added

- Initial monorepo structure.
- React frontend scaffold.
- ASP.NET Core backend scaffold.
- Docker Compose baseline.
- SQL Server container.
- Initial health endpoint.
- Basic quality tooling.
