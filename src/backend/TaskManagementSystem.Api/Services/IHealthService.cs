using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Services;

public interface IHealthService
{
    HealthResponseDto GetStatus();
}
