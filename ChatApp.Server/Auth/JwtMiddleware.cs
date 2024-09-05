using ChatApp.Server.Auth;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly JwtSettings _jwtSettings;
    //private readonly UserManager<ChatUser> _userManager;

    public JwtMiddleware(RequestDelegate next, IOptions<JwtSettings> jwtSettings)//, UserManager<ChatUser> userManager)
    {
        _next = next;
        _jwtSettings = jwtSettings.Value;
        //_userManager = userManager;
    }

    public async Task Invoke(HttpContext context, UserManager<ChatUser> _userManager)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
            await attachUserToContext(context, token, _userManager);

        await _next(context);
    }

    private async Task attachUserToContext(HttpContext context, string token, UserManager<ChatUser> _userManager)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.First(x => x.Type == "id").Value;

            context.Items["User"] = await _userManager.FindByIdAsync(userId);
        }
        catch
        {
            // Do nothing if JWT validation fails
        }
    }
}
