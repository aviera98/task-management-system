using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Application.Common.Models;

namespace TaskManagementSystem.Application.Dashboard.Queries;

// Orquesta la consulta del dashboard sin conocer detalles de persistencia.
public sealed class GetDashboardSummaryQueryHandler(ITaskRepository taskRepository)
{
    public Task<DashboardSummary> HandleAsync(
        GetDashboardSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        // Valida entrada y delega el calculo real al repositorio.
        ArgumentNullException.ThrowIfNull(query);

        return taskRepository.GetDashboardSummaryAsync(cancellationToken);
    }
}
