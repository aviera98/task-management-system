using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.IntegrationTests.Auth;

public sealed class RegisterEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    [Fact]
    public async Task Register_ShouldReturnCreated()
    {
        var client = factory.CreateClient();
        var request = new RegisterRequest
        {
            FirstName = "Ada",
            LastName = "Lovelace",
            Email = $"ada-{Guid.NewGuid():N}@example.com",
            Password = "Password123"
        };

        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var payload = await response.Content.ReadFromJsonAsync<RegisterResponse>(JsonOptions);
        payload.Should().NotBeNull();
        payload!.Email.Should().Be(request.Email.ToLowerInvariant());
        payload.Role.Should().Be(UserRole.Member);
    }

    [Fact]
    public async Task Register_ShouldReturnConflict_WhenEmailAlreadyExists()
    {
        var client = factory.CreateClient();
        var request = new RegisterRequest
        {
            FirstName = "Grace",
            LastName = "Hopper",
            Email = $"grace-{Guid.NewGuid():N}@example.com",
            Password = "Password123"
        };

        var firstResponse = await client.PostAsJsonAsync("/api/auth/register", request);
        var secondResponse = await client.PostAsJsonAsync("/api/auth/register", request);

        firstResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        secondResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Register_ShouldStorePasswordHashed()
    {
        var client = factory.CreateClient();
        var request = new RegisterRequest
        {
            FirstName = "Katherine",
            LastName = "Johnson",
            Email = $"katherine-{Guid.NewGuid():N}@example.com",
            Password = "Password123"
        };

        var response = await client.PostAsJsonAsync("/api/auth/register", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var user = dbContext.Users.Single(entity => entity.Email == request.Email.ToLowerInvariant());

        user.PasswordHash.Should().NotBe(request.Password);
        user.PasswordHash.Should().Contain(".");
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenPasswordIsWeak()
    {
        var client = factory.CreateClient();
        var request = new RegisterRequest
        {
            FirstName = "Margaret",
            LastName = "Hamilton",
            Email = $"margaret-{Guid.NewGuid():N}@example.com",
            Password = "weakpass"
        };

        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
