using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.Repositories;

public interface ITaskRepository
{
    Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<TaskItem>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<TaskItem?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<TaskItem> UpdateAsync(TaskItem task, CancellationToken cancellationToken = default);
}
