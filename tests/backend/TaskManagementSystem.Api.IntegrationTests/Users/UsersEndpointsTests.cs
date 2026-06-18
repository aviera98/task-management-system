using FluentAssertions;
using System.Net;
using System.Net.Http.Json;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.IntegrationTests.Users;

public sealed class UsersEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    [Fact]
    public async Task CreateUser_ShouldReturnCreated()
    {
        var client = factory.CreateClient();
        var request = new CreateUserRequest
        {
            FirstName = "Ada",
            LastName = "Lovelace",
            Email = "ada@example.com",
            Password = "Password123!",
            Role = UserRole.Manager
        };

        var response = await client.PostAsJsonAsync("/api/users", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var createdUser = await response.Content.ReadFromJsonAsync<UserResponse>();
        createdUser.Should().NotBeNull();
        createdUser!.Email.Should().Be("ada@example.com");
        createdUser.Role.Should().Be(UserRole.Manager);
    }
}
