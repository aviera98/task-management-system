using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TaskManagementSystem.Api.Services;

public sealed class CurrentUserAccessor(IHttpContextAccessor httpContextAccessor) : ICurrentUserAccessor
{
    public Guid GetRequiredUserId()
    {
        var authorizationHeader = httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString();
        if (!string.IsNullOrWhiteSpace(authorizationHeader)
            && authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            var accessToken = authorizationHeader["Bearer ".Length..].Trim();
            var rawToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);
            var rawSubjectClaim = rawToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;

            if (Guid.TryParse(rawSubjectClaim, out var rawUserId))
            {
                return rawUserId;
            }
        }

        var principal = httpContextAccessor.HttpContext?.User;
        var subjectClaim = principal?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(subjectClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Authentication is required.");
        }

        return userId;
    }
}
