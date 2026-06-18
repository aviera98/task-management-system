using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Services;

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
