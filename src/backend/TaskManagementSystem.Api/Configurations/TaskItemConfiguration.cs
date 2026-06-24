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
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(task => task.Description)
            .HasMaxLength(2000);

        builder.Property(task => task.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(task => task.Priority)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(task => task.CreatedAt)
            .IsRequired();

        builder.HasIndex(task => new { task.UserId, task.CreatedAt });

        builder.HasOne(task => task.User)
            .WithMany(user => user.Tasks)
            .HasForeignKey(task => task.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
