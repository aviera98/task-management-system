using System.ComponentModel.DataAnnotations;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Exceptions;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

public sealed class UserService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ILogger<UserService> logger) : IUserService
{
    public async Task<UserResponse> CreateAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        await EnsureEmailIsUniqueAsync(request.Email, null, cancellationToken);

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHasher.Hash(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await userRepository.AddAsync(user, cancellationToken);
        return MapToResponse(createdUser);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return userRepository.DeleteAsync(id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<UserResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await userRepository.GetAllAsync(cancellationToken);
        // Se exponen DTOs para no devolver la entidad interna completa.
        return users.Select(MapToResponse).ToArray();
    }

    public async Task<UserResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByIdAsync(id, cancellationToken);
        return user is null ? null : MapToResponse(user);
    }

    public async Task<RegisterResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (existingUser is not null)
        {
            logger.LogInformation(
                "User registration rejected because email already exists: {Email}",
                normalizedEmail);

            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHasher.Hash(request.Password),
            Role = UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await userRepository.AddAsync(user, cancellationToken);

        logger.LogInformation(
            "User registered successfully with id {UserId} and email {Email}",
            createdUser.Id,
            createdUser.Email);

        return MapToRegisterResponse(createdUser);
    }

    public async Task<UserResponse?> UpdateAsync(
        Guid id,
        CreateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        // Primero se verifica que el nuevo email no choque con otro usuario.
        var existingUser = await userRepository.GetByEmailAsync(request.Email.Trim().ToLowerInvariant(), cancellationToken);
        if (existingUser is not null && existingUser.Id != id)
        {
            throw new ValidationException("A user with the same email already exists.");
        }

        // Luego se carga el usuario actual y se actualizan sus campos mutables.
        var currentUser = await userRepository.GetByIdAsync(id, cancellationToken);
        if (currentUser is null)
        {
            return null;
        }

        currentUser.FirstName = request.FirstName.Trim();
        currentUser.LastName = request.LastName.Trim();
        currentUser.Email = request.Email.Trim().ToLowerInvariant();
        currentUser.PasswordHash = passwordHasher.Hash(request.Password);
        currentUser.Role = request.Role;
        currentUser.UpdatedAt = DateTime.UtcNow;

        var updatedUser = await userRepository.UpdateAsync(currentUser, cancellationToken);
        return MapToResponse(updatedUser);
    }

    private async Task EnsureEmailIsUniqueAsync(
        string email,
        Guid? currentUserId,
        CancellationToken cancellationToken)
    {
        var existingUser = await userRepository.GetByEmailAsync(email.Trim().ToLowerInvariant(), cancellationToken);

        if (existingUser is not null && existingUser.Id != currentUserId)
        {
            logger.LogInformation(
                "User operation rejected because email already exists: {Email}",
                existingUser.Email);
            throw new EmailAlreadyExistsException(existingUser.Email);
        }
    }

    private static UserResponse MapToResponse(User user)
    {
        return new UserResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.CreatedAt,
            user.UpdatedAt);
    }

    private static RegisterResponse MapToRegisterResponse(User user)
    {
        return new RegisterResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.CreatedAt);
    }
}
