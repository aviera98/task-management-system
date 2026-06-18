using System.ComponentModel.DataAnnotations;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Repositories;

namespace TaskManagementSystem.Api.Services;

// Contiene la logica de negocio de usuarios antes de tocar la base de datos.
public sealed class UserService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher) : IUserService
{
    public async Task<UserResponse> CreateAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        // Se normaliza el email y se evita duplicarlo antes de persistir.
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
        // Metodo reutilizable para altas y futuras ediciones.
        var existingUser = await userRepository.GetByEmailAsync(email.Trim().ToLowerInvariant(), cancellationToken);

        if (existingUser is not null && existingUser.Id != currentUserId)
        {
            throw new ValidationException("A user with the same email already exists.");
        }
    }

    private static UserResponse MapToResponse(User user)
    {
        // Nunca se devuelve PasswordHash al exterior.
        return new UserResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.CreatedAt,
            user.UpdatedAt);
    }
}
