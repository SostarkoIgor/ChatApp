using ChatApp.Server.Dtos;
using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IMessageService
    {
        public Task<MessageToUserDto?> GetLastConvoMessage(int convoID, ChatUser encrptedFor);
        public Task<bool> PostMessageToConversationAsync(PostMessageToConversation postMessageToConversation, ChatUser? sender, Conversation? conversation);
    }
}
