using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Services;

// Devuelve un snapshot simple del estado de la API.
public sealed class HealthService : IHealthService
{
    public HealthResponseDto GetStatus()
    {
        return new HealthResponseDto(
            "Healthy",
            "Task Management System API",
            DateTime.UtcNow);
    }
}
