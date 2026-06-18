namespace TaskManagementSystem.Application.Common.Models;

// Modelo agregado para pintar el dashboard sin exponer entidades completas.
public sealed record DashboardSummary(
    int TotalTasks,
    int CompletedTasks,
    int InProgressTasks,
    int OverdueTasks,
    double CompletionRate);
