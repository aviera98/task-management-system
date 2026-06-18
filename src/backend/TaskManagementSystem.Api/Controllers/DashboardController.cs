using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.Application.Dashboard.Queries;

namespace TaskManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DashboardController(GetDashboardSummaryQueryHandler handler) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var summary = await handler.HandleAsync(new GetDashboardSummaryQuery(), cancellationToken);
        return Ok(summary);
    }
}
