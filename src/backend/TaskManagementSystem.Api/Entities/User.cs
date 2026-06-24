namespace TaskManagementSystem.Api.Entities;

// Entidad persistida para usuarios del sistema.
public sealed class User
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    // Se guarda el hash, nunca la password en texto plano.
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Member;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<TaskItem> Tasks { get; set; } = [];
}
