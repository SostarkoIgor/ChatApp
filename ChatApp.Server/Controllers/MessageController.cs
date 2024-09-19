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
        public async Task<ActionResult<ConvoMessageDto>> PostMessageToConversation([FromBody] PostMessageToConversation postMessage)
        {
            if (postMessage == null || postMessage.ReceiverUsername == null)
            {
                return BadRequest("No given data!");
            }
            try
            {
                ChatUser? currentLoggedInUser = (await _userManager.GetUserAsync(User));
                List<string?>? users=new ();
                users.Add(currentLoggedInUser?.UserName);
                users.Add(postMessage.ReceiverUsername);
                int convoId=await _conversationService.CreateConversationIfDoesNotExistAsync(users, postMessage.ConvoId);
                if (convoId == -1)
                {
                    return BadRequest();
                }
                var rez=await _messageService.PostMessageToConversationAsync(postMessage, currentLoggedInUser, await _conversationService.GetConversationByIdAsync(convoId));
                if (rez == null) { BadRequest(); }

                return Ok(new ConvoMessageDto()
                {
                    EncryptedMessage=rez.Text,
                    Id=rez.Id,
                    ConvoId=convoId,
                    IsRead=rez.IsRead,
                    ReceiverUsername=postMessage.ReceiverUsername,
                    SenderUsername=rez.Sender.UserName,
                    SentAt=rez.SentAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
