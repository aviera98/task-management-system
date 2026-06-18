using FluentAssertions;
using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Domain.Enums;
using TaskItemStatus = TaskManagementSystem.Domain.Enums.TaskStatus;

namespace TaskManagementSystem.Domain.UnitTests.Entities;

public sealed class TaskItemTests
{
    [Fact]
    public void Create_ShouldInitializePendingTask()
    {
        var task = TaskItem.Create("Prepare ADR", "Describe the architecture decision.", TaskPriority.High);

        task.Title.Should().Be("Prepare ADR");
        task.Status.Should().Be(TaskItemStatus.Pending);
        task.CreatedAtUtc.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void UpdateStatus_ShouldSetUpdatedAt()
    {
        var task = TaskItem.Create("Review PR", "Review backend PR.", TaskPriority.Medium);

        task.UpdateStatus(TaskItemStatus.Completed);

        task.Status.Should().Be(TaskItemStatus.Completed);
        task.UpdatedAtUtc.Should().NotBeNull();
    }
}
