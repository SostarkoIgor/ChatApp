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

    //this is controller for registering and login of user
    //default identity implementations are not used considering we use jwt and need custom responses and request bodies
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

        //endpoint for registering new user
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
                    EncriptedPrivateKey = registerDto.EncryptedPrivateKey,
                    PublicKey = registerDto.PublicKey,
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    IV = registerDto.IV,
                    Salt = registerDto.Salt
                };

                //role asigned to every user that registers is "User"
                //we create the role if it doesn't exist
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
            return BadRequest("Invalid data.");
        }

        //endpoint for user login
        //we return jwt, user roles and encripted private key
        //with that key, that user decrypts on frontend, user decodes all messages sent to it
        //those messages are encrypted with users public key by the sender of message
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //if user does not exist we return apropriate response to client
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            //we try to sign user in
            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                //if sign in is succesfull we generate and return token, alongside aforementioned key and roles
                var token = await GenerateJwtTokenAsync(user);

                return Ok(new LoginResponseDto()
                {
                    Token = token,
                    PrivateEncryptedKey = await _userService.GetEncriptedPrivateKeyOfUserWithMailAsync(user.Email),
                    Roles = await _userManager.GetRolesAsync(user),
                    Salt = user.Salt,
                    IV = user.IV,
                    UserName = user.UserName
                });
            }

            //if invalid password we return appropriate response to client
            return Unauthorized(new { Message = "Invalid credentials" });
        }

        //function for generating token
        private async Task<string> GenerateJwtTokenAsync(ChatUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            foreach (var role in (await _userManager.GetRolesAsync(user)))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            //we get key to sign token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "",
                audience: "",
                claims: claims,
                expires: DateTime.Now.AddHours(3),  // Vrijeme trajanja tokena
                signingCredentials: creds
            );

            //we return token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
