using ChatApp.Server.Dtos;
using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IMessageService
    {
        public Task<MessageToUserDto?> GetLastConvoMessage(int convoID);
        public Task<bool> PostMessageToConversationAsync(PostMessageToConversation postMessageToConversation, ChatUser? sender);
    }
}
