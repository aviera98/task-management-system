using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Exceptions;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

public sealed class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<LoginResponse> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            logger.LogInformation("Login rejected for email {Email}", normalizedEmail);
            throw new InvalidCredentialsException();
        }

        var token = jwtTokenService.CreateToken(user);

        logger.LogInformation("User authenticated successfully with id {UserId}", user.Id);

        return new LoginResponse(
            token.AccessToken,
            token.ExpiresAt,
            new AuthenticatedUserResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Role));
    }
}
