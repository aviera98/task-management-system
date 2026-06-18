namespace TaskManagementSystem.Api.DTOs;

// DTO devuelto por el endpoint de health.
public sealed record HealthResponseDto(
    string Status,
    string Service,
    DateTime UtcTimestamp);
