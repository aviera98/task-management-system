using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TaskManagementSystem.Api.Configurations;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

// Prepara la base de datos al arrancar la API y garantiza un usuario admin inicial.
public sealed class DatabaseInitializationService(
    ApplicationDbContext dbContext,
    IOptions<AdminUserSeedOptions> adminUserSeedOptions,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        // InMemory necesita EnsureCreated; SQL Server usa migraciones.
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

        // El seeding puede deshabilitarse desde configuracion.
        if (!options.Enabled)
        {
            return;
        }

        var email = options.Email.Trim().ToLowerInvariant();
        var existingUser = await userRepository.GetByEmailAsync(email, cancellationToken);

        // Evita duplicar el admin si la base ya fue inicializada antes.
        if (existingUser is not null)
        {
            return;
        }

        // El admin inicial se crea con datos de configuracion y password hasheado.
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
