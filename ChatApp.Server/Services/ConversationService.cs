using ChatApp.Server.Data;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Services
{
    public class ConversationService : IConversationService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMessageService _messageService;
        public ConversationService(AppDbContext appDbContext, IMessageService messageService)
        {
            _appDbContext = appDbContext;
            _messageService = messageService;
        }

        public async Task<List<GetUserConvosDto>> GetUserConvosAsync(ChatUser user)
        {
            var conversations = await _appDbContext.Conversations
            .Where(a => a.Users.Contains(user))
            .ToListAsync();

            
            var convos = await Task.WhenAll(conversations.Select(async a => new GetUserConvosDto
            {
                ConvoId = a.Id,
                LastMessage = await _messageService.GetLastConvoMessage(a.Id),
                OtherConvoUsers = a.Users.Select(u => new GetUserConvosDto.ConvoUser
                {
                    UserName = u.UserName,
                    PublicKey = u.PublicKey
                }).ToList()
            }));

            return convos.ToList();

        }
    }
}
