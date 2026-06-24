using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace TaskManagementSystem.Api.IntegrationTests;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public const string JwtIssuer = "TaskManagementSystem.Tests";
    public const string JwtAudience = "TaskManagementSystem.Tests.Client";
    public const string JwtSecretKey = "TaskManagementSystem-Tests-Secret-Key-For-Jwt-12345";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            configurationBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:UseInMemory"] = "true",
                ["Jwt:Issuer"] = JwtIssuer,
                ["Jwt:Audience"] = JwtAudience,
                ["Jwt:SecretKey"] = JwtSecretKey,
                ["Jwt:ExpirationMinutes"] = "60"
            });
        });
        builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders();
        });
        builder.ConfigureServices(services =>
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "TestOrBearer";
                options.DefaultChallengeScheme = "TestOrBearer";
            })
            .AddPolicyScheme("TestOrBearer", "TestOrBearer", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    var authorizationHeader = context.Request.Headers.Authorization.ToString();
                    return authorizationHeader.StartsWith("Test ", StringComparison.OrdinalIgnoreCase)
                        ? "Test"
                        : JwtBearerDefaults.AuthenticationScheme;
                };
            })
            .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", _ => { });
        });
    }
}
