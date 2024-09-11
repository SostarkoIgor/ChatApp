using ChatApp.Server.Dtos;
using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IConversationService
    {
        public Task<List<GetUserConvosDto>> GetUserConvosAsync(ChatUser user);
    }
}
