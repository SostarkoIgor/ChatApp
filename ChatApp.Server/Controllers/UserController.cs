﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChatApp.Server.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController:ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IBlockService _blockService;
        private readonly UserManager<ChatUser> _userManager;

        public UserController(IUserService userService, IBlockService blockService, UserManager<ChatUser> userManager)
        {
            _userService = userService;
            _blockService = blockService;
            _userManager = userManager;
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

        [HttpGet("userInfo/{userName}")]
        public async Task<ActionResult<UserInfoDto>> GetUserInfo([FromRoute] string? userName)
        {
            if (userName == null) { return BadRequest(); }
            else return Ok(await _userService.GetUserInfoByUsernameAsync(userName));
        }

        [HttpPost("blockUser")]
        public async Task<ActionResult<bool>> BlockUserByUsername([FromBody] string? username)
        {
            if (string.IsNullOrEmpty(username)) { return BadRequest(); }
            var userToBlock=await _userService.GetUserByUsernameAsync(username);
            if (userToBlock == null) return BadRequest();
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return BadRequest();
            return Ok(await _blockService.BlockUser(user, userToBlock));

        }
    }
}
