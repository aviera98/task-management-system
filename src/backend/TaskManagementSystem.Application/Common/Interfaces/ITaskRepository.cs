using TaskManagementSystem.Application.Common.Models;

namespace TaskManagementSystem.Application.Common.Interfaces;

// Contrato que la capa de aplicacion usa para consultar datos de tareas.
public interface ITaskRepository
{
    Task<DashboardSummary> GetDashboardSummaryAsync(CancellationToken cancellationToken = default);
}
