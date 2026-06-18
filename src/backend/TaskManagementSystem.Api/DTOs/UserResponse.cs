using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.DTOs;

// Respuesta publica de usuario sin exponer datos sensibles.
public sealed record UserResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    UserRole Role,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
