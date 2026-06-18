using FluentAssertions;
using Moq;
using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Application.Common.Models;
using TaskManagementSystem.Application.Dashboard.Queries;

namespace TaskManagementSystem.Application.UnitTests.Dashboard.Queries;

public sealed class GetDashboardSummaryQueryHandlerTests
{
    [Fact]
    public async Task HandleAsync_ShouldReturnRepositorySummary()
    {
        var expected = new DashboardSummary(12, 7, 3, 2, 58.33);
        var repository = new Mock<ITaskRepository>();
        repository
            .Setup(instance => instance.GetDashboardSummaryAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var handler = new GetDashboardSummaryQueryHandler(repository.Object);

        var result = await handler.HandleAsync(new GetDashboardSummaryQuery());

        result.Should().Be(expected);
    }
}
