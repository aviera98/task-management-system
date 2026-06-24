using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

public sealed class TaskService(
    ICurrentUserAccessor currentUserAccessor,
    ITaskRepository taskRepository) : ITaskService
{
    public async Task<TaskResponse> CreateAsync(
        CreateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUserAccessor.GetRequiredUserId();
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            Status = TaskItemStatus.Todo,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var createdTask = await taskRepository.AddAsync(task, cancellationToken);
        return MapToResponse(createdTask);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var userId = currentUserAccessor.GetRequiredUserId();
        return taskRepository.DeleteAsync(id, userId, cancellationToken);
    }

    public async Task<IReadOnlyCollection<TaskResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var userId = currentUserAccessor.GetRequiredUserId();
        var tasks = await taskRepository.GetAllAsync(userId, cancellationToken);
        return tasks.Select(MapToResponse).ToArray();
    }

    public async Task<TaskResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var userId = currentUserAccessor.GetRequiredUserId();
        var task = await taskRepository.GetByIdAsync(id, userId, cancellationToken);
        return task is null ? null : MapToResponse(task);
    }

    public async Task<TaskResponse?> UpdateAsync(
        Guid id,
        UpdateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUserAccessor.GetRequiredUserId();
        var currentTask = await taskRepository.GetByIdAsync(id, userId, cancellationToken);
        if (currentTask is null)
        {
            return null;
        }

        currentTask.Title = request.Title.Trim();
        currentTask.Description = request.Description.Trim();
        currentTask.Status = request.Status;
        currentTask.Priority = request.Priority;
        currentTask.UpdatedAt = DateTime.UtcNow;

        var updatedTask = await taskRepository.UpdateAsync(currentTask, cancellationToken);
        return MapToResponse(updatedTask);
    }

    private static TaskResponse MapToResponse(TaskItem task)
    {
        return new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.Priority,
            task.UserId,
            task.CreatedAt,
            task.UpdatedAt);
    }
}
