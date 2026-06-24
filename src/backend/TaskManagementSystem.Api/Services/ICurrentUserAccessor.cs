namespace TaskManagementSystem.Api.Services;

public interface ICurrentUserAccessor
{
    Guid GetRequiredUserId();
}
