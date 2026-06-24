using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.IntegrationTests.Tasks;

public sealed class TasksEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    [Fact]
    public async Task GetAll_ShouldReturnUnauthorized_WhenTokenIsMissing()
    {
        var client = CreateHttpsClient();

        var response = await client.GetAsync("/api/tasks");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Create_ShouldReturnCreated_ForAuthenticatedUser()
    {
        var (user, client) = await CreateAuthenticatedUserAndClientAsync();

        var response = await client.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = "Prepare release notes",
            Description = "Summarize the sprint outcomes.",
            Priority = TaskItemPriority.High
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var task = await response.Content.ReadFromJsonAsync<TaskResponse>(JsonOptions);
        task.Should().NotBeNull();
        task!.Title.Should().Be("Prepare release notes");
        task.Description.Should().Be("Summarize the sprint outcomes.");
        task.Priority.Should().Be(TaskItemPriority.High);
        task.Status.Should().Be(TaskItemStatus.Todo);
        task.UserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenTitleIsMissing()
    {
        var client = await CreateAuthenticatedClientAsync();

        var response = await client.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = string.Empty,
            Description = "Invalid task",
            Priority = TaskItemPriority.Medium
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetById_ShouldReturnOwnedTask()
    {
        var (user, client) = await CreateAuthenticatedUserAndClientAsync();
        var task = await SeedTaskAsync(user.Id, "Owned task");

        var response = await client.GetAsync($"/api/tasks/{task.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await response.Content.ReadFromJsonAsync<TaskResponse>(JsonOptions);
        payload.Should().NotBeNull();
        payload!.Id.Should().Be(task.Id);
        payload.UserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOnlyCurrentUsersTasks()
    {
        var (user, client) = await CreateAuthenticatedUserAndClientAsync();
        await SeedTaskAsync(user.Id, "Current user task");
        await SeedTaskAsync(Guid.NewGuid(), "Other user task");

        var response = await client.GetAsync("/api/tasks");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var tasks = await response.Content.ReadFromJsonAsync<IReadOnlyCollection<TaskResponse>>(JsonOptions);
        tasks.Should().NotBeNull();
        tasks!.Should().OnlyContain(task => task.UserId == user.Id);
        tasks.Should().ContainSingle(task => task.Title == "Current user task");
        tasks.Should().NotContain(task => task.Title == "Other user task");
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_ForTaskOwnedByAnotherUser()
    {
        var (_, client) = await CreateAuthenticatedUserAndClientAsync();
        var foreignTask = await SeedTaskAsync(Guid.NewGuid(), "Foreign task");

        var response = await client.GetAsync($"/api/tasks/{foreignTask.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_ShouldModifyOnlyOwnedTask()
    {
        var (user, client) = await CreateAuthenticatedUserAndClientAsync();
        var task = await SeedTaskAsync(user.Id, "Draft task");

        var response = await client.PutAsJsonAsync($"/api/tasks/{task.Id}", new UpdateTaskRequest
        {
            Title = "Final task",
            Description = "Updated description",
            Status = TaskItemStatus.Completed,
            Priority = TaskItemPriority.Low
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedTask = await response.Content.ReadFromJsonAsync<TaskResponse>(JsonOptions);
        updatedTask.Should().NotBeNull();
        updatedTask!.Title.Should().Be("Final task");
        updatedTask.Status.Should().Be(TaskItemStatus.Completed);
        updatedTask.Priority.Should().Be(TaskItemPriority.Low);
        updatedTask.UpdatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task Update_ShouldReturnNotFound_ForTaskOwnedByAnotherUser()
    {
        var (_, client) = await CreateAuthenticatedUserAndClientAsync();
        var foreignTask = await SeedTaskAsync(Guid.NewGuid(), "Foreign task");

        var response = await client.PutAsJsonAsync($"/api/tasks/{foreignTask.Id}", new UpdateTaskRequest
        {
            Title = "Attempted update",
            Description = "Should fail",
            Status = TaskItemStatus.InProgress,
            Priority = TaskItemPriority.High
        });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_ForOwnedTask()
    {
        var (user, client) = await CreateAuthenticatedUserAndClientAsync();
        var task = await SeedTaskAsync(user.Id, "Task to delete");

        var response = await client.DeleteAsync($"/api/tasks/{task.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Tasks.Should().NotContain(entity => entity.Id == task.Id);
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_ForTaskOwnedByAnotherUser()
    {
        var (_, client) = await CreateAuthenticatedUserAndClientAsync();
        var foreignTask = await SeedTaskAsync(Guid.NewGuid(), "Foreign task");

        var response = await client.DeleteAsync($"/api/tasks/{foreignTask.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var (_, client) = await CreateAuthenticatedUserAndClientAsync();
        return client;
    }

    private async Task<(User user, HttpClient client)> CreateAuthenticatedUserAndClientAsync()
    {
        var client = CreateHttpsClient();
        var user = await SeedUserAsync("Password123");

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Test", user.Id.ToString());

        return (user, client);
    }

    private HttpClient CreateHttpsClient()
    {
        return factory.CreateClient(new()
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    private async Task<User> SeedUserAsync(string password)
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Task",
            LastName = "Owner",
            Email = $"tasks-{Guid.NewGuid():N}@example.com",
            PasswordHash = passwordHasher.Hash(password),
            Role = UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return user;
    }

    private async Task<TaskItem> SeedTaskAsync(Guid userId, string title)
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var userExists = dbContext.Users.Any(entity => entity.Id == userId);
        if (!userExists)
        {
            dbContext.Users.Add(new User
            {
                Id = userId,
                FirstName = "Foreign",
                LastName = "Owner",
                Email = $"foreign-{Guid.NewGuid():N}@example.com",
                PasswordHash = "seeded-hash",
                Role = UserRole.Member,
                CreatedAt = DateTime.UtcNow
            });
        }

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = "Seeded task description",
            Status = TaskItemStatus.Todo,
            Priority = TaskItemPriority.Medium,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync();

        return task;
    }
}
