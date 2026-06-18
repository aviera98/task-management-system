using System.ComponentModel.DataAnnotations;
using System.Net;

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
            // Los errores de validacion se traducen a 400 para el cliente.
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                message = exception.Message
            });
        }
        catch (Exception exception)
        {
            // Todo lo demas se registra y se devuelve como error generico.
            logger.LogError(exception, "Unhandled exception");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                message = "An unexpected error occurred."
            });
        }
    }
}
