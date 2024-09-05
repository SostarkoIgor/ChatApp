using ChatApp.Server.Dtos;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ChatUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(UserManager<ChatUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
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
    }
}
