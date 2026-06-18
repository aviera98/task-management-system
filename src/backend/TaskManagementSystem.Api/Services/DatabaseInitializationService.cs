using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TaskManagementSystem.Api.Configurations;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

public sealed class DatabaseInitializationService(
    ApplicationDbContext dbContext,
    IOptions<AdminUserSeedOptions> adminUserSeedOptions,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        if (dbContext.Database.IsInMemory())
        {
            await dbContext.Database.EnsureCreatedAsync(cancellationToken);
        }
        else
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        }

        await SeedAdminUserAsync(cancellationToken);
    }

    private async Task SeedAdminUserAsync(CancellationToken cancellationToken)
    {
        var options = adminUserSeedOptions.Value;

        if (!options.Enabled)
        {
            return;
        }

        var email = options.Email.Trim().ToLowerInvariant();
        var existingUser = await userRepository.GetByEmailAsync(email, cancellationToken);

        if (existingUser is not null)
        {
            return;
        }

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            FirstName = options.FirstName.Trim(),
            LastName = options.LastName.Trim(),
            Email = email,
            PasswordHash = passwordHasher.Hash(options.Password),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        await userRepository.AddAsync(adminUser, cancellationToken);
    }
}
