using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Application.Common.Models;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Infrastructure.Persistence.Repositories;

// Implementacion concreta del repositorio usado por el dashboard.
public sealed class TaskRepository(TaskManagementDbContext dbContext) : ITaskRepository
{
    public async Task<DashboardSummary> GetDashboardSummaryAsync(CancellationToken cancellationToken = default)
    {
        // La fecha actual se usa para detectar vencimientos.
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Cada contador se calcula en base al estado actual de la tabla Tasks.
        var totalTasks = await dbContext.Tasks.CountAsync(cancellationToken);
        var completedTasks = await dbContext.Tasks.CountAsync(
            task => task.Status == TaskItemStatus.Completed,
            cancellationToken);
        var inProgressTasks = await dbContext.Tasks.CountAsync(
            task => task.Status == TaskItemStatus.InProgress,
            cancellationToken);
        var overdueTasks = await dbContext.Tasks.CountAsync(
            task => task.DueDate.HasValue &&
                    task.DueDate.Value < today &&
                    task.Status != TaskItemStatus.Completed,
            cancellationToken);

        var completionRate = totalTasks == 0
            ? 0
            : Math.Round((double)completedTasks / totalTasks * 100, 2);

        // El repositorio devuelve un agregado listo para el frontend.
        return new DashboardSummary(
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            completionRate);
    }
}
