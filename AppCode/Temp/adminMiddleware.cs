using System.Security.Claims;
using WebAppAnapaDeti.AppCode;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace WebAppAnapaDeti.AppCode.Temp;

public class CustomClaimsTransformation(IOptions<AppSettings> appSettings) : IClaimsTransformation
{
    private readonly AppSettings _appSettings = appSettings.Value;

    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        await Task.CompletedTask;

        var userId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrWhiteSpace(userId) &&
            IsAdmin(userId) &&
            principal.Identity is ClaimsIdentity ci)
            ci.AddClaim(new Claim(ClaimTypes.Role, C.RoleAdmin));

        return principal;
    }

    // todo add cache
    private bool IsAdmin(string userId)
    {
        var adminUserId = _appSettings.AdminUserEmail;
        return adminUserId.Contains(userId);
    }
}