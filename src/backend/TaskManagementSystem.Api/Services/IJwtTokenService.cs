using TaskManagementSystem.Api.Entities;

namespace TaskManagementSystem.Api.Services;

public interface IJwtTokenService
{
    GeneratedJwtToken CreateToken(User user);
}
