using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.Services;

// DbContext principal de la API para usuarios y tareas expuestas por este proyecto.
public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    // Representa la tabla de tareas en EF Core.
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    // Representa la tabla de usuarios en EF Core.
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Carga automaticamente todas las configuraciones IEntityTypeConfiguration.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
