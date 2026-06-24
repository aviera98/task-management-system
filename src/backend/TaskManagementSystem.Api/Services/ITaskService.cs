using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Services;

public interface ITaskService
{
    Task<TaskResponse> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<TaskResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TaskResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskResponse?> UpdateAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
}
