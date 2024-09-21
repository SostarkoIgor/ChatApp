using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChatApp.Server.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using ChatApp.Server.Interfaces;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController:ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("getUsers")]
        public async Task<ActionResult<SearchUsersByUsernameResponseDto>> GetUsersByUsername([FromQuery] string? userName)
        {
            if (userName == null) { return BadRequest("No username given."); }

            return Ok(await _userService.GetUsersByUsernameAsync(userName));

        }

        [HttpGet("getUserData/{userName}")]
        public async Task<ActionResult<UserDataDto>> GetUserData([FromRoute] string? userName)
        {
            if (userName == null) { return NotFound(); }
            UserDataDto userData= await _userService.GetUserDataAsync(userName);
            if (userName == null) return NotFound();
            return Ok(userData);
        }
        [HttpGet("getUserKey")]
        public async Task<ActionResult<string>> GetUserPublicKeyAsync([FromQuery] string? userName)
        {
            if (userName == null) { return BadRequest(); }
            return Ok(await _userService.GetPublicKeyOfUserAsync(userName));
        }
    }
}
