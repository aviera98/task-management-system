using Microsoft.Extensions.DependencyInjection;
using TaskManagementSystem.Application.Dashboard.Queries;

namespace TaskManagementSystem.Application;

// Registra servicios de la capa de aplicacion.
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Handler responsable de calcular el resumen del dashboard.
        services.AddScoped<GetDashboardSummaryQueryHandler>();

        return services;
    }
}
