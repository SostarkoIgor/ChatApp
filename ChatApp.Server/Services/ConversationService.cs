using ChatApp.Server.Data;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ChatApp.Server.Services
{
    public class ConversationService : IConversationService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMessageService _messageService;
        private readonly IUserService _userService;
        public ConversationService(AppDbContext appDbContext, IMessageService messageService, IUserService userService)
        {
            _appDbContext = appDbContext;
            _messageService = messageService;
            _userService = userService;
        }

        public bool ConversationExists(int? convoId)
        {
            if (convoId == null) return false;
            if (_appDbContext.Conversations.Where(a => a.Id == convoId).Count() > 0)
            { return true; }
            return false;
        }
        public async Task CreateConversationIfDoesNotExistAsync(List<string?>? usersNames, int? convoId)
        {
            if (usersNames == null || convoId==null || ConversationExists(convoId)) return;
            List<ChatUser> users = new();
            foreach (var userName in usersNames)
            {
                if (userName == null) continue;
                ChatUser? user = await _userService.GetUserByUsernameAsync(userName);
                if (user == null) continue;
                users.Add(user);
            }
            if (users.Count >= 2)
            {
                await _appDbContext.Conversations.AddAsync(new Conversation()
                {
                    Users = users,
                    Messages = new List<Message>()
                });
                await _appDbContext.SaveChangesAsync();
            }
            else return;
        }

        public async Task<Conversation?> GetConversationByIdAsync(int? conversationId)
        {
            return await _appDbContext.Conversations.Where(a => a.Id == conversationId).FirstOrDefaultAsync();
        }

        public async Task<GetUserConvosDto?> GetUserConvoDtoForUserName(string userName, ChatUser currentUser)
        {
            if (!await _userService.ExistsUserWithUserNameAsync(userName)) return null;
            List<GetUserConvosDto.ConvoUser> otherConvousers = new();
            otherConvousers.Add(new GetUserConvosDto.ConvoUser()
            {
                UserName = userName,
                PublicKey= await _userService.GetPublicKeyOfUserAsync(userName)
            });
            otherConvousers.Add(new GetUserConvosDto.ConvoUser()
            {
                UserName = currentUser.UserName,
                PublicKey = currentUser.PublicKey
            });
            return new GetUserConvosDto()
            {
                ConvoId = -1,
                OtherConvoUsers=otherConvousers
            };

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
