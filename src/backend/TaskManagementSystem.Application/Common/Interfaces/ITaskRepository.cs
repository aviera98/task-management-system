using TaskManagementSystem.Application.Common.Models;

namespace TaskManagementSystem.Application.Common.Interfaces;

public interface ITaskRepository
{
    Task<DashboardSummary> GetDashboardSummaryAsync(CancellationToken cancellationToken = default);
}
