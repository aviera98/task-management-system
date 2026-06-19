using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.DTOs;

public sealed record RegisterResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    UserRole Role,
    DateTime CreatedAt);
