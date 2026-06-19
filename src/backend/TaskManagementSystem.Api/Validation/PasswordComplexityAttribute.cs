using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace TaskManagementSystem.Api.Validation;

public sealed partial class PasswordComplexityAttribute : ValidationAttribute
{
    public PasswordComplexityAttribute()
    {
        ErrorMessage =
            "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter and 1 number.";
    }

    public override bool IsValid(object? value)
    {
        if (value is not string password)
        {
            return false;
        }

        if (password.Length < 8)
        {
            return false;
        }

        return UppercaseRegex().IsMatch(password)
            && LowercaseRegex().IsMatch(password)
            && DigitRegex().IsMatch(password);
    }

    [GeneratedRegex("[A-Z]")]
    private static partial Regex UppercaseRegex();

    [GeneratedRegex("[a-z]")]
    private static partial Regex LowercaseRegex();

    [GeneratedRegex("[0-9]")]
    private static partial Regex DigitRegex();
}
