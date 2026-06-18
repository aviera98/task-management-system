namespace TaskManagementSystem.Api.DTOs;

public sealed record HealthResponseDto(
    string Status,
    string Service,
    DateTime UtcTimestamp);
