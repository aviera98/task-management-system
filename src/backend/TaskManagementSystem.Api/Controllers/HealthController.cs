using Microsoft.AspNetCore.Mvc;

namespace TaskManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "Healthy",
            service = "Task Management System API",
            utcTimestamp = DateTime.UtcNow
        });
    }
}
