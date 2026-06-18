using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskManagementSystem.Application.Common.Interfaces;
using TaskManagementSystem.Infrastructure.Persistence;
using TaskManagementSystem.Infrastructure.Persistence.Repositories;

namespace TaskManagementSystem.Infrastructure;

// Registra infraestructura tecnica: EF Core y repositorios concretos.
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Se soporta una base en memoria para demos o pruebas locales.
        var useInMemoryDatabase = bool.TryParse(
            configuration["UseInMemoryDatabase"],
            out var parsedUseInMemoryDatabase) && parsedUseInMemoryDatabase;

        services.AddDbContext<TaskManagementDbContext>(options =>
        {
            if (useInMemoryDatabase)
            {
                options.UseInMemoryDatabase("TaskManagementSystemDb");
                return;
            }

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is missing.");

            options.UseSqlServer(connectionString);
        });

        // La capa de aplicacion depende del contrato, no de esta implementacion.
        services.AddScoped<ITaskRepository, TaskRepository>();

        return services;
    }
}
