using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.Configurations;

// Configuracion EF Core para la entidad TaskItem del proyecto API.
public sealed class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(task => task.Id);

        builder.Property(task => task.Title)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(task => task.Description)
            .HasMaxLength(500);
    }
}
