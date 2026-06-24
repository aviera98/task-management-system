using System.ComponentModel.DataAnnotations;
using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.DTOs;

public sealed class CreateTaskRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; init; } = string.Empty;

    [StringLength(2000)]
    public string Description { get; init; } = string.Empty;

    [Required]
    public TaskItemPriority Priority { get; init; } = TaskItemPriority.Medium;
}
