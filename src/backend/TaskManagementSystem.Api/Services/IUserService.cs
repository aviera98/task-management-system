using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Services;

public interface IUserService
{
    Task<UserResponse> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<UserResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<UserResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserResponse?> UpdateAsync(Guid id, CreateUserRequest request, CancellationToken cancellationToken = default);
}
