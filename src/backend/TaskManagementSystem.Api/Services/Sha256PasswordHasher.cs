using System.Security.Cryptography;
using System.Text;

namespace TaskManagementSystem.Api.Services;

public sealed class Sha256PasswordHasher : IPasswordHasher
{
    public string Hash(string value)
    {
        var bytes = Encoding.UTF8.GetBytes(value);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
}
