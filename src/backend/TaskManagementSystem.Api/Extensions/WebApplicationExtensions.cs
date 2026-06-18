using TaskManagementSystem.Infrastructure.Persistence;

namespace TaskManagementSystem.Api.Extensions;

public static class WebApplicationExtensions
{
    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TaskManagementDbContext>();

        await dbContext.Database.EnsureCreatedAsync();
        await TaskManagementDbContextSeed.SeedAsync(dbContext);
    }
}
