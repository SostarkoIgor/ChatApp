using ChatApp.Server.Models;

namespace ChatApp.Server.Interfaces
{
    public interface IBlockService
    {
        public Task<bool> BlockUser(ChatUser user, ChatUser userToBlock);
        public Task<bool> UnblockUser(ChatUser user, ChatUser userToBlock);
        public Task<List<string?>> GetBlockedUsersAsync(ChatUser user);
    }
}
