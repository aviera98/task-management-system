using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Domain.Entities;

namespace TaskManagementSystem.Infrastructure.Persistence;

// Contexto EF Core de la arquitectura limpia para tareas de dominio.
public sealed class TaskManagementDbContext(DbContextOptions<TaskManagementDbContext> options)
    : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Descubre y aplica configuraciones del ensamblado de infraestructura.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TaskManagementDbContext).Assembly);
    }
}
