using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Entities;
using TaskManagementSystem.Api.Services;

namespace TaskManagementSystem.Api.IntegrationTests.Auth;

public sealed class LoginEndpointsTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    [Fact]
    public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
    {
        var client = factory.CreateClient();
        const string password = "Password123";
        var user = await SeedUserAsync(password);

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = user.Email,
            Password = password
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>(JsonOptions);
        payload.Should().NotBeNull();
        payload!.User.Id.Should().Be(user.Id);
        payload.User.Email.Should().Be(user.Email);
        payload.User.Role.Should().Be(user.Role);
        payload.AccessToken.Should().NotBeNullOrWhiteSpace();
        payload.ExpiresAt.Should().BeAfter(DateTime.UtcNow.AddMinutes(55));
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenPasswordIsIncorrect()
    {
        var client = factory.CreateClient();
        var user = await SeedUserAsync("Password123");

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = user.Email,
            Password = "WrongPassword123"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var payload = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        payload.Should().NotBeNull();
        payload!.Message.Should().Be("Invalid credentials.");
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenUserDoesNotExist()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = $"missing-{Guid.NewGuid():N}@example.com",
            Password = "Password123"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var payload = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        payload.Should().NotBeNull();
        payload!.Message.Should().Be("Invalid credentials.");
    }

    [Fact]
    public async Task Login_ShouldGenerateValidJwt()
    {
        var client = factory.CreateClient();
        const string password = "Password123";
        var user = await SeedUserAsync(password);

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = user.Email,
            Password = password
        });

        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>(JsonOptions);
        payload.Should().NotBeNull();

        var validatedToken = ValidateToken(payload!.AccessToken);

        validatedToken.Issuer.Should().Be(CustomWebApplicationFactory.JwtIssuer);
        validatedToken.Audiences.Should().Contain(CustomWebApplicationFactory.JwtAudience);
        validatedToken.ValidTo.Should().BeCloseTo(payload.ExpiresAt, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public async Task Login_ShouldIncludeExpectedClaims()
    {
        var client = factory.CreateClient();
        const string password = "Password123";
        var user = await SeedUserAsync(password);

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = user.Email,
            Password = password
        });

        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>(JsonOptions);
        payload.Should().NotBeNull();

        var token = new JwtSecurityTokenHandler().ReadJwtToken(payload!.AccessToken);

        token.Claims.Single(claim => claim.Type == JwtRegisteredClaimNames.Sub).Value.Should().Be(user.Id.ToString());
        token.Claims.Single(claim => claim.Type == JwtRegisteredClaimNames.Email).Value.Should().Be(user.Email);
        token.Claims.Single(claim => claim.Type == "role").Value.Should().Be(user.Role.ToString());
        token.Claims.Single(claim => claim.Type == "name").Value.Should().Be($"{user.FirstName} {user.LastName}");
    }

    private async Task<User> SeedUserAsync(string password)
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Linus",
            LastName = "Torvalds",
            Email = $"linus-{Guid.NewGuid():N}@example.com",
            PasswordHash = passwordHasher.Hash(password),
            Role = UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return user;
    }

    private static JwtSecurityToken ValidateToken(string accessToken)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = CustomWebApplicationFactory.JwtIssuer,
            ValidateAudience = true,
            ValidAudience = CustomWebApplicationFactory.JwtAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(CustomWebApplicationFactory.JwtSecretKey)),
            ClockSkew = TimeSpan.Zero,
            NameClaimType = "name",
            RoleClaimType = "role"
        };

        var handler = new JwtSecurityTokenHandler();
        handler.ValidateToken(accessToken, validationParameters, out var validatedToken);
        validatedToken.Should().BeOfType<JwtSecurityToken>();
        return (JwtSecurityToken)validatedToken;
    }
}
