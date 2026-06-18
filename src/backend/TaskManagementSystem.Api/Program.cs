using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Configurations;
using TaskManagementSystem.Api.Middleware;
using TaskManagementSystem.Api.Repositories;
using TaskManagementSystem.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection(DatabaseOptions.SectionName));
builder.Services.Configure<AdminUserSeedOptions>(
    builder.Configuration.GetSection(AdminUserSeedOptions.SectionName));

var databaseOptions = builder.Configuration
    .GetSection(DatabaseOptions.SectionName)
    .Get<DatabaseOptions>() ?? new DatabaseOptions();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (databaseOptions.UseInMemory)
    {
        options.UseInMemoryDatabase("TaskManagementSystemDb");
        return;
    }

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("DefaultConnection is missing.");

    options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<IHealthService, HealthService>();
builder.Services.AddScoped<IPasswordHasher, Sha256PasswordHasher>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<DatabaseInitializationService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var databaseInitializationService = scope.ServiceProvider.GetRequiredService<DatabaseInitializationService>();
    await databaseInitializationService.InitializeAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.MapControllers();

app.Run();

public partial class Program;
