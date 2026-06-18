namespace TaskManagementSystem.Api.Configurations;

// Opciones de infraestructura leidas desde appsettings.
public sealed class DatabaseOptions
{
    // Nombre de la seccion que se bindea desde configuracion.
    public const string SectionName = "Database";

    public bool UseInMemory { get; init; }
}
