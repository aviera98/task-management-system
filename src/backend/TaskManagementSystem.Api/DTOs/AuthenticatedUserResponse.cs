using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.DTOs;

public sealed record AuthenticatedUserResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    UserRole Role);
