namespace TaskManagementSystem.Api.DTOs;

public sealed record LoginResponse(
    string AccessToken,
    DateTime ExpiresAt,
    AuthenticatedUserResponse User);
