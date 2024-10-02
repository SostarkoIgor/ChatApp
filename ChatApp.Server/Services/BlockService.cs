using ChatApp.Server.Data;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;

namespace ChatApp.Server.Services
{
    public class BlockService : IBlockService
    {
        readonly AppDbContext _context;

        public BlockService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> BlockUser(ChatUser user, ChatUser userToBlock)
        {
            try{
                await _context.Blocks.AddAsync(new Block { BlockedChatUser = userToBlock, ChatUser=user });
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
