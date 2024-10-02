using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IBlockService
    {
        public Task<bool> BlockUser(ChatUser user, ChatUser userToBlock);
    }
}
