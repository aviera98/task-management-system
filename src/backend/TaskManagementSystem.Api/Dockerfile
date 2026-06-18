FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj", "src/backend/TaskManagementSystem.Api/"]
RUN dotnet restore "src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj"

COPY . .
RUN dotnet publish "src/backend/TaskManagementSystem.Api/TaskManagementSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "TaskManagementSystem.Api.dll"]
