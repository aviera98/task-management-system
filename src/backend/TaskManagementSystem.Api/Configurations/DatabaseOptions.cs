namespace TaskManagementSystem.Api.Configurations;

public sealed class DatabaseOptions
{
    public const string SectionName = "Database";

    public bool UseInMemory { get; init; }
}
