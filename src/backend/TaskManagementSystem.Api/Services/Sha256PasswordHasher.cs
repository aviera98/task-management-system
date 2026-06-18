using System.Security.Cryptography;
using System.Text;

namespace TaskManagementSystem.Api.Services;

// Implementacion basica para hashear passwords antes de guardarlas.
public sealed class Sha256PasswordHasher : IPasswordHasher
{
    public string Hash(string value)
    {
        // Convierte el texto a bytes y genera su hash hexadecimal.
        var bytes = Encoding.UTF8.GetBytes(value);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
}
