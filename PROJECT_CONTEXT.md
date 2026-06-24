# Task Management System - Project Context

## Overview

Task Management System es una aplicación Full Stack desarrollada con fines de portfolio profesional.

El objetivo principal es demostrar experiencia en:

* React
* TypeScript
* ASP.NET Core 8
* SQL Server
* Entity Framework Core
* Docker
* Testing
* CI/CD
* Arquitectura empresarial
* Buenas prácticas de desarrollo

El proyecto debe evolucionar gradualmente, manteniendo siempre una arquitectura limpia, código mantenible y cobertura de pruebas.

---

# Current Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS

Estructura:

src/
├── features/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── types/
└── utils/

---

## Backend

* ASP.NET Core 8 Web API
* Entity Framework Core
* SQL Server

Arquitectura:

Controllers/
Services/
Repositories/
Entities/
DTOs/
Configurations/
Middleware/

Patrones utilizados:

* Repository Pattern
* Service Layer
* Dependency Injection
* DTO Pattern

---

# Infrastructure

## Docker

Servicios:

* frontend
* backend
* sqlserver

Configuración:

* Docker Compose
* Variables de entorno
* Health Checks
* SQL Server persistente mediante volumen

Comando de arranque:

docker compose up --build

---

# Features Implemented

## Infrastructure

* Docker Compose
* SQL Server Container
* Backend Container
* Frontend Container
* Health Checks
* Environment Variables
* Automatic Database Initialization

---

## Users

Entidad User:

* Id
* FirstName
* LastName
* Email
* PasswordHash
* Role
* CreatedAt
* UpdatedAt

Implementado:

* User Repository
* User Service
* Fluent API Configuration
* Unique Email Constraint
* Automatic Migrations
* Optional Admin Seed

---

## Registration

Endpoint:

POST /api/auth/register

Implementado:

* Input Validation
* Password Complexity Validation
* Duplicate Email Validation
* PBKDF2 Password Hashing with Salt
* Structured Error Handling
* Swagger Documentation
* Logging

Responses:

* 201 Created
* 400 Bad Request
* 409 Conflict
* 500 Internal Server Error

---

# Security

Passwords:

* PBKDF2
* Salt
* No plaintext storage

Principios:

* Nunca devolver PasswordHash
* Nunca loguear contraseñas
* Mantener separación de responsabilidades

---

# Testing

Actualmente existen Integration Tests para:

* Successful Registration
* Duplicate Email Registration
* Invalid Password Registration
* Password Hash Verification

Todos los cambios futuros deben incluir pruebas cuando corresponda.

Objetivo final:

* Cobertura mínima del 80%

---

# Development Rules

## Architecture

Mantener:

Controller
→ Service
→ Repository

Nunca:

Controller
→ Repository

No colocar lógica de negocio dentro de Controllers.

---

## DTOs

Nunca exponer entidades EF directamente.

Usar DTOs para:

* Requests
* Responses

---

## Validation

Las validaciones deben implementarse mediante:

* Data Annotations
* Custom Validators
* Middleware cuando corresponda

---

## Logging

Registrar:

* Eventos importantes
* Errores
* Acciones de negocio relevantes

Nunca registrar:

* Passwords
* Secrets
* Tokens

---

## Error Handling

Usar ExceptionHandlingMiddleware.

Mantener respuestas consistentes.

Formato esperado:

{
"message": "...",
"statusCode": 400
}

---

# Roadmap

## Completed

* Project Bootstrap
* Docker Infrastructure
* User Infrastructure
* Registration Flow

## Next Step

JWT Authentication

Objetivo:

Implementar:

POST /api/auth/login

Con:

* JWT Authentication
* Claims
* Authorization Policies
* Swagger Bearer Support
* Integration Tests

## Future Steps

1. Login JWT
2. Frontend Authentication
3. Protected Routes
4. Roles & Authorization
5. Task CRUD
6. Task Testing
7. Dashboard Analytics
8. GitHub Actions CI/CD
9. Hardening
10. Portfolio Release

---

# Goal

El proyecto debe parecer una aplicación empresarial real.

Priorizar:

* Calidad de código
* Arquitectura
* Testing
* Mantenibilidad
* Escalabilidad

Por encima de la cantidad de funcionalidades.
