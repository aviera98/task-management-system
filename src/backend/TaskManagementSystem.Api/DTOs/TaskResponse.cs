using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.DTOs;

public sealed record TaskResponse(
    Guid Id,
    string Title,
    string Description,
    TaskItemStatus Status,
    TaskItemPriority Priority,
    Guid UserId,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
