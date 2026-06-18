using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagementSystem.Domain.Entities;

namespace TaskManagementSystem.Infrastructure.Persistence.Configurations;

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
            .HasMaxLength(1000);

        builder.Property(task => task.Priority)
            .HasConversion<int>();

        builder.Property(task => task.Status)
            .HasConversion<int>();
    }
}
