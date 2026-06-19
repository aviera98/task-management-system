using System.ComponentModel.DataAnnotations;
using TaskManagementSystem.Api.Validation;

namespace TaskManagementSystem.Api.DTOs;

public sealed class RegisterRequest
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [PasswordComplexity]
    public string Password { get; init; } = string.Empty;
}
