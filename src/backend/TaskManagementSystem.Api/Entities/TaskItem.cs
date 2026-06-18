namespace TaskManagementSystem.Api.Entities;

// Version simple de tarea usada por la API para persistir datos basicos.
public sealed class TaskItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
