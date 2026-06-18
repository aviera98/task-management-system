using FluentAssertions;
using System.Net;

namespace TaskManagementSystem.Api.IntegrationTests.Dashboard;

public sealed class DashboardEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    [Fact]
    public async Task GetSummary_ShouldReturnOk()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/dashboard/summary");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
