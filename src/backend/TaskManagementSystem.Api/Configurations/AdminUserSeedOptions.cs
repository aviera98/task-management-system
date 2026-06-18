namespace TaskManagementSystem.Api.Configurations;

public sealed class AdminUserSeedOptions
{
    public const string SectionName = "AdminUserSeed";

    public bool Enabled { get; init; }
    public string FirstName { get; init; } = "System";
    public string LastName { get; init; } = "Administrator";
    public string Email { get; init; } = "admin@taskms.local";
    public string Password { get; init; } = "Admin123!";
}
