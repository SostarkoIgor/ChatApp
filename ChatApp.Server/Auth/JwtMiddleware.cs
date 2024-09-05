using ChatApp.Server.Auth;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;


//this code was made with help of this: https://medium.com/@codewithankitsahu/authentication-and-authorization-in-net-8-web-api-94dda49516ee
public class JwtMiddleware
{
    // Reference to the next middleware in the request pipeline
    private readonly RequestDelegate _next;

    // JWT settings containing the key and other configurations
    private readonly JwtSettings _jwtSettings;

    public JwtMiddleware(RequestDelegate next, IOptions<JwtSettings> jwtSettings)
    {
        _next = next;
        _jwtSettings = jwtSettings.Value;
    }

    //This method is called on every HTTP request, and it tries to attach the user to the context if a valid JWT is present
    //this middleware is constructed at startup and by default usermanager is scoped so if we add it as a dependency in constructor we get errors
    //it has to be added as parameter of invoked method
    //for more info: https://learn.microsoft.com/en-us/answers/questions/1326939/how-to-fix-unhandled-exception-after-adding-userac
    public async Task Invoke(HttpContext context, UserManager<ChatUser> _userManager)
    {
        // Retrieve the token from the Authorization header (Bearer token)
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        // If a token exists, try to attach the user to the context
        if (token != null)
            await AttachUserToContext(context, token, _userManager);

        // Proceed to the next middleware in the pipeline
        await _next(context);
    }

    // Method to attach the user to the context if the token is valid
    private async Task AttachUserToContext(HttpContext context, string token, UserManager<ChatUser> _userManager)
    {
        try
        {
            // Create a token handler to validate the JWT
            var tokenHandler = new JwtSecurityTokenHandler();

            // Convert the secret key from the appsetings.json into bytes
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            // Validate the token using the provided validation parameters
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            // Cast the validated token to a JWT token
            var jwtToken = (JwtSecurityToken)validatedToken;

            // Extract the user ID from the "id" claim in the token
            var userId = jwtToken.Claims.First(x => x.Type == "id").Value;

            // Attach the user to the current context based on the user ID
            context.Items["User"] = await _userManager.FindByIdAsync(userId);
        }
        catch
        {
            // Do nothing if JWT validation fails
        }
    }
}
