namespace TaskManagementSystem.Api.Entities;

// Entidad persistida para tareas pertenecientes a un usuario.
public sealed class TaskItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public TaskItemPriority Priority { get; set; } = TaskItemPriority.Medium;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
