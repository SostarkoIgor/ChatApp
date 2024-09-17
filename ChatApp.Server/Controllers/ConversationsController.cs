using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConversationsController : ControllerBase
    {
        private readonly UserManager<ChatUser> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConversationService _conversationService;

        public ConversationsController(UserManager<ChatUser> userManager, IHttpContextAccessor httpContextAccessor, IConversationService conversationService)
        {
            _userManager = userManager;
            _contextAccessor = httpContextAccessor;
            _conversationService = conversationService;
        }

        [HttpGet]
        public async Task<ActionResult<List<GetUserConvosDto>>> GetUserConvos()
        {
            return Ok(await _conversationService.GetUserConvosAsync(await _userManager.GetUserAsync(User)));
        }
        [HttpGet("start/{username}")]
        public async Task<ActionResult<GetUserConvosDto>> StartConvoWithUser([FromRoute] string username)
        {
            GetUserConvosDto? getUserConvosDto = await _conversationService.GetUserConvoDtoForUserName(username, await _userManager.GetUserAsync(User));
            if (getUserConvosDto == null) { return BadRequest(); }
            return Ok(getUserConvosDto);
        }

        [HttpGet("messages/{convoId}")]
        public async Task<ActionResult<List<ConvoMessageDto>>> GetConvoMessages([FromRoute] int convoId)
        {
            var convo = await _conversationService.GetConversationByIdAsync(convoId);
            if (convo == null) { return NotFound(); }
            var user = await _userManager.GetUserAsync(User);
            if (!convo.Users.Contains(user)) return Forbid();
            return Ok(await _conversationService.GetConvoMessagesAsync(convo, user));
        }

    }
}
