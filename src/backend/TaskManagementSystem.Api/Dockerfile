FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj", "src/backend/TaskManagementSystem.Api/"]
COPY ["src/backend/TaskManagementSystem.Application/TaskManagementSystem.Application.csproj", "src/backend/TaskManagementSystem.Application/"]
COPY ["src/backend/TaskManagementSystem.Domain/TaskManagementSystem.Domain.csproj", "src/backend/TaskManagementSystem.Domain/"]
COPY ["src/backend/TaskManagementSystem.Infrastructure/TaskManagementSystem.Infrastructure.csproj", "src/backend/TaskManagementSystem.Infrastructure/"]
RUN dotnet restore "src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj"

COPY . .
RUN dotnet publish "src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "TaskManagementSystem.Api.dll"]
