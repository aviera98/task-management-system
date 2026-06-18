namespace TaskManagementSystem.Application.Common.Models;

public sealed record DashboardSummary(
    int TotalTasks,
    int CompletedTasks,
    int InProgressTasks,
    int OverdueTasks,
    double CompletionRate);
