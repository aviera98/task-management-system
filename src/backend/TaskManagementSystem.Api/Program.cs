using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Api.Configurations;
using TaskManagementSystem.Api.Middleware;
using TaskManagementSystem.Api.Repositories;
using TaskManagementSystem.Api.Services;

// Punto de entrada de la API.
// Aqui se registran dependencias, base de datos, CORS y middleware global.
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

// La aplicacion puede correr con EF InMemory para desarrollo/pruebas
// o con SQL Server cuando existe una cadena de conexion real.
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
    // Politica para permitir al frontend local consumir la API.
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
    // Asegura que la base exista, aplique migraciones y tenga datos iniciales.
    var databaseInitializationService = scope.ServiceProvider.GetRequiredService<DatabaseInitializationService>();
    await databaseInitializationService.InitializeAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Centraliza el manejo de errores antes de llegar a los controladores.
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.MapControllers();

app.Run();

public partial class Program;
