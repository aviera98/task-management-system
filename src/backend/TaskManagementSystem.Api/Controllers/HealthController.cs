using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController(IHealthService healthService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(healthService.GetStatus());
    }
}
