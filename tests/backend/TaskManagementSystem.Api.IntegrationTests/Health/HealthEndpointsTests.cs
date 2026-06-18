using FluentAssertions;
using System.Net;

namespace TaskManagementSystem.Api.IntegrationTests.Health;

public sealed class HealthEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    [Fact]
    public async Task GetHealth_ShouldReturnOk()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
