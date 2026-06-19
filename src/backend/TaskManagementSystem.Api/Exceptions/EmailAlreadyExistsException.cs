namespace TaskManagementSystem.Api.Exceptions;

public sealed class EmailAlreadyExistsException(string email)
    : InvalidOperationException($"A user with email '{email}' already exists.")
{
    public string Email { get; } = email;
}
