using Microsoft.Extensions.DependencyInjection;
using TaskManagementSystem.Application.Dashboard.Queries;

namespace TaskManagementSystem.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetDashboardSummaryQueryHandler>();

        return services;
    }
}
