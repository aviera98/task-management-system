using System.ComponentModel.DataAnnotations;
using System.Net;
using TaskManagementSystem.Api.DTOs;
using TaskManagementSystem.Api.Exceptions;

namespace TaskManagementSystem.Api.Middleware;

// Intercepta excepciones no controladas y devuelve respuestas JSON consistentes.
public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Continua con el siguiente middleware o endpoint del pipeline.
            await next(context);
        }
        catch (ValidationException exception)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new ErrorResponse(exception.Message));
        }
        catch (EmailAlreadyExistsException exception)
        {
            logger.LogInformation(
                "Conflict while processing request because the email already exists: {Email}",
                exception.Email);

            context.Response.StatusCode = (int)HttpStatusCode.Conflict;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new ErrorResponse(exception.Message));
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(
                new ErrorResponse("An unexpected error occurred."));
        }
    }
}
