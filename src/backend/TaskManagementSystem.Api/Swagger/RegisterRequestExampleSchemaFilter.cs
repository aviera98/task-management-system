using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using TaskManagementSystem.Api.DTOs;

namespace TaskManagementSystem.Api.Swagger;

public sealed class RegisterRequestExampleSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(RegisterRequest))
        {
            schema.Example = new OpenApiObject
            {
                ["firstName"] = new OpenApiString("Ada"),
                ["lastName"] = new OpenApiString("Lovelace"),
                ["email"] = new OpenApiString("ada.lovelace@example.com"),
                ["password"] = new OpenApiString("Password123")
            };
            return;
        }

        if (context.Type == typeof(RegisterResponse))
        {
            schema.Example = new OpenApiObject
            {
                ["id"] = new OpenApiString("11111111-1111-1111-1111-111111111111"),
                ["firstName"] = new OpenApiString("Ada"),
                ["lastName"] = new OpenApiString("Lovelace"),
                ["email"] = new OpenApiString("ada.lovelace@example.com"),
                ["role"] = new OpenApiString("Member"),
                ["createdAt"] = new OpenApiString("2026-06-19T12:00:00Z")
            };
            return;
        }

        if (context.Type == typeof(ErrorResponse))
        {
            schema.Example = new OpenApiObject
            {
                ["message"] = new OpenApiString("A user with email 'ada.lovelace@example.com' already exists.")
            };
        }
    }
}
