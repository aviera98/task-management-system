namespace TaskManagementSystem.Api.Services;

public interface IPasswordHasher
{
    string Hash(string value);
}
