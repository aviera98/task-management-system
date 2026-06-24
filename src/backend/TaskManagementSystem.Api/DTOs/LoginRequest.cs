using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.Api.DTOs;

public sealed class LoginRequest
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
