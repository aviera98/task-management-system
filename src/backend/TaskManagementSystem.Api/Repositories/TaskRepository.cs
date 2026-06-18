using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.Repositories;

public sealed class TaskRepository(ApplicationDbContext dbContext) : ITaskRepository
{
    public async Task<IReadOnlyCollection<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Tasks
            .AsNoTracking()
            .OrderBy(task => task.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }
}
