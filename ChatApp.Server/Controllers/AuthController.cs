using ChatApp.Server.Auth;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ChatUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ChatUser> _signInManager;
        private readonly JwtSettings _jwtSettings;
        private readonly IUserService _userService;

        public AuthController(UserManager<ChatUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ChatUser> signInManager, IOptions<JwtSettings> jwtSettings, IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtSettings = jwtSettings.Value;
            _userService = userService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (ModelState.IsValid)
            {
                ChatUser user = new()
                {
                    Description = registerDto.Description,
                    LastName = registerDto.LastName,
                    FirstName = registerDto.FirstName,
                    EncriptedPrivateKey = registerDto.EncriptedPrivateKey,
                    PublicKey = registerDto.PublicKey,
                    UserName = registerDto.Username,
                    Email = registerDto.Email
                };
                var isUserCreated = await _userManager.CreateAsync(user, registerDto.Password);
                if (isUserCreated.Succeeded)
                {
                    string role = "User";
                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(role));
                    }
                    await _userManager.AddToRoleAsync(user, role);
                    return Ok("Created user successfully");
                }

            }
            return BadRequest();
        }
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                // Generiranje JWT tokena
                var token = GenerateJwtToken(user);

                return Ok(new LoginResponseDto()
                {
                    Token = token,
                    PrivateEncriptedKey = await _userService.GetEncriptedPrivateKeyOfUserWithMailAsync(user.Email),
                    Roles = await _userManager.GetRolesAsync(user)
                });
            }

            return Unauthorized(new { Message = "Invalid credentials" });
        }

        private string GenerateJwtToken(ChatUser user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "",
                audience: "",
                claims: claims,
                expires: DateTime.Now.AddHours(3),  // Vrijeme trajanja tokena
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
