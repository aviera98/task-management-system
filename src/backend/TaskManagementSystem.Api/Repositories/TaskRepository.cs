using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.Repositories;

// Acceso de solo lectura a tareas dentro del proyecto API.
public sealed class TaskRepository(ApplicationDbContext dbContext) : ITaskRepository
{
    public async Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync(cancellationToken);
        return task;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var task = await dbContext.Tasks
            .SingleOrDefaultAsync(entity => entity.Id == id && entity.UserId == userId, cancellationToken);

        if (task is null)
        {
            return false;
        }

        dbContext.Tasks.Remove(task);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<IReadOnlyCollection<TaskItem>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Tasks
            .AsNoTracking()
            .SingleOrDefaultAsync(task => task.Id == id && task.UserId == userId, cancellationToken);
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        dbContext.Tasks.Update(task);
        await dbContext.SaveChangesAsync(cancellationToken);
        return task;
    }
}
