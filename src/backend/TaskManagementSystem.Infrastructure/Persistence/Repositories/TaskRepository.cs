using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Application.Common.Models;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Infrastructure.Persistence.Repositories;

public sealed class TaskRepository(TaskManagementDbContext dbContext) : ITaskRepository
{
    public async Task<DashboardSummary> GetDashboardSummaryAsync(CancellationToken cancellationToken = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

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

        return new DashboardSummary(
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            completionRate);
    }
}
