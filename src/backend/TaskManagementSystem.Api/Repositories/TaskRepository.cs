using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.Repositories;

// Acceso de solo lectura a tareas dentro del proyecto API.
public sealed class TaskRepository(ApplicationDbContext dbContext) : ITaskRepository
{
    public async Task<IReadOnlyCollection<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // AsNoTracking mejora lecturas cuando no se van a modificar entidades.
        return await dbContext.Tasks
            .AsNoTracking()
            .OrderBy(task => task.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }
}
