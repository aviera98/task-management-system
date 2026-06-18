using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Application.Common.Models;

namespace TaskManagementSystem.Application.Dashboard.Queries;

public sealed class GetDashboardSummaryQueryHandler(ITaskRepository taskRepository)
{
    public Task<DashboardSummary> HandleAsync(
        GetDashboardSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        return taskRepository.GetDashboardSummaryAsync(cancellationToken);
    }
}
