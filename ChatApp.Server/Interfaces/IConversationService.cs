using ChatApp.Server.Dtos;
using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IConversationService
    {
        public Task<List<GetUserConvosDto>> GetUserConvosAsync(ChatUser user);
        public Task<Conversation?> GetConversationByIdAsync(int? conversationId);
        public Task<int> CreateConversationIfDoesNotExistAsync(List<string?>? usersNames, int? convoId);
        public bool ConversationExists(int? convoId);
        public Task<GetUserConvosDto?> GetUserConvoDtoForUserName(string userName, ChatUser currentUser);
        public Task<List<ConvoMessageDto>> GetConvoMessagesAsync(Conversation conversation, ChatUser chatUser);
    }
}
