using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Infrastructure.Persistence;

public static class TaskManagementDbContextSeed
{
    public static async Task SeedAsync(TaskManagementDbContext dbContext)
    {
        if (dbContext.Tasks.Any())
        {
            return;
        }

        var seededTasks = new[]
        {
            TaskItem.Create(
                "Define clean architecture boundaries",
                "Establish API, application, domain and infrastructure layers.",
                TaskPriority.Critical,
                DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2))),
            TaskItem.Create(
                "Prepare frontend shell",
                "Create feature-based folders, shared providers and route layout.",
                TaskPriority.High,
                DateOnly.FromDateTime(DateTime.UtcNow.AddDays(4))),
            TaskItem.Create(
                "Document CI/CD strategy",
                "Capture Docker, Compose and GitHub Actions workflow decisions.",
                TaskPriority.Medium,
                DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)))
        };

        seededTasks[0].UpdateStatus(TaskItemStatus.InProgress);
        seededTasks[1].UpdateStatus(TaskItemStatus.Completed);

        await dbContext.Tasks.AddRangeAsync(seededTasks);
        await dbContext.SaveChangesAsync();
    }
}
