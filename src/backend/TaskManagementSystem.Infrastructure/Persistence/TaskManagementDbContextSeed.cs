using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Infrastructure.Persistence;

// Inserta datos de ejemplo para levantar el dashboard con contenido inicial.
public static class TaskManagementDbContextSeed
{
    public static async Task SeedAsync(TaskManagementDbContext dbContext)
    {
        // Si ya hay tareas, no se vuelve a sembrar para no duplicar registros.
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

        // Persiste el lote inicial en una sola operacion.
        await dbContext.Tasks.AddRangeAsync(seededTasks);
        await dbContext.SaveChangesAsync();
    }
}
