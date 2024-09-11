using ChatApp.Server.Dtos;

namespace ChatApp.Server.Interfaces
{
    public interface IMessageService
    {
        public Task<MessageToUserDto?> GetLastConvoMessage(int convoID);
    }
}
