using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly UserManager<ChatUser> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConversationService _conversationService;
        private readonly IMessageService _messageService;

        public MessageController(UserManager<ChatUser> userManager, IHttpContextAccessor httpContextAccessor, IConversationService conversationService, IMessageService messageService)
        {
            _userManager = userManager;
            _contextAccessor = httpContextAccessor;
            _conversationService = conversationService;
            _messageService = messageService;
        }

        [HttpPost]
        public async Task<IActionResult> PostMessageToConversation([FromBody] PostMessageToConversation postMessage)
        {
            if (postMessage == null || postMessage.EachUserData == null)
            {
                return BadRequest("No given data!");
            }
            try
            {
                ChatUser? currentLoggedInUser = (await _userManager.GetUserAsync(User));
                var users=postMessage.EachUserData.Select(a=>a.ReceiverUsername).ToList();
                users.Add(currentLoggedInUser?.UserName);
                await _conversationService.CreateConversationIfDoesNotExistAsync(users, postMessage.ConvoId);
                await _messageService.PostMessageToConversationAsync(postMessage, currentLoggedInUser, await _conversationService.GetConversationByIdAsync(postMessage.ConvoId));
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
