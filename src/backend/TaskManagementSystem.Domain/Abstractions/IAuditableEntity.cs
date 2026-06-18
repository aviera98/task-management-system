namespace TaskManagementSystem.Domain.Abstractions;

// Contrato comun para entidades que exponen fechas de auditoria.
public interface IAuditableEntity
{
    DateTime CreatedAtUtc { get; }
    DateTime? UpdatedAtUtc { get; }
}
