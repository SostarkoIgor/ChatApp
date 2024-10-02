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
        public async Task<int> CreateConversationIfDoesNotExistAsync(List<string?>? usersNames, int? convoId)
        {
            if (usersNames == null || convoId==null) return -1;
            if (ConversationExists(convoId)) return (int)convoId;
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
                var convo = new Conversation()
                {
                    Users = users,
                    Messages = new List<Message>()
                };
                await _appDbContext.Conversations.AddAsync(convo);
                await _appDbContext.SaveChangesAsync();
                return convo.Id;
            }
            else return -1;
        }

        public async Task<Conversation?> GetConversationByIdAsync(int? conversationId)
        {
            return await _appDbContext.Conversations.Where(a => a.Id == conversationId).Include(a=>a.Users).FirstOrDefaultAsync();
        }

        public async Task<List<ConvoMessageDto>> GetConvoMessagesAsync(Conversation conversation, ChatUser chatUser)
        {
            return await _appDbContext.Messages.Where(a=>a.ConversationId == conversation.Id && a.EncryptedFor==chatUser)
                .Include(a=>a.Sender)
                .Select(a=>new ConvoMessageDto()
                {
                    EncryptedMessage=a.Text,
                    ReceiverUsername=chatUser.UserName,
                    SenderUsername=a.Sender.UserName,
                    Id=a.Id,
                    ConvoId=conversation.Id,
                    IsRead=a.IsRead,
                    SentAt=a.SentAt
                }).ToListAsync();
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
            .Include(a=>a.Users)
            .ToListAsync();


            var convos = new List<GetUserConvosDto>();

            foreach (var a in conversations)
            {
                if (await _appDbContext.Blocks.AnyAsync(
                    (block=>a.Users.Contains(block.BlockedChatUser) && block.ChatUser.Equals(user))
                    )){
                        continue;
                    }
                var lastMessage = await _messageService.GetLastConvoMessage(a.Id, user);
                var users = a.Users.Select(u => new GetUserConvosDto.ConvoUser
                {
                    UserName = u.UserName,
                    PublicKey = u.PublicKey
                }).ToList();

                convos.Add(new GetUserConvosDto
                {
                    ConvoId = a.Id,
                    LastMessage = lastMessage,
                    OtherConvoUsers = users
                });
            }


            return convos.ToList();

        }
    }
}
