using TaskManagementSystem.Domain.Abstractions;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Domain.Entities;

public sealed class TaskItem : IAuditableEntity
{
    private TaskItem()
    {
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public TaskPriority Priority { get; private set; }
    public TaskItemStatus Status { get; private set; }
    public DateOnly? DueDate { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    public static TaskItem Create(
        string title,
        string description,
        TaskPriority priority,
        DateOnly? dueDate = null)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Task title is required.", nameof(title));
        }

        return new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            Description = description.Trim(),
            Priority = priority,
            Status = TaskItemStatus.Pending,
            DueDate = dueDate,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void UpdateStatus(TaskItemStatus status)
    {
        Status = status;
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
