using ChatApp.Server.Data;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.EntityFrameworkCore;

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
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<string?>> GetBlockedUsersAsync(ChatUser user)
        {
            var rez = await _context.Blocks.Where(a => a.ChatUser.Equals(user)).Select(a => a.BlockedChatUser.UserName).ToListAsync();
            return rez;
        }
    }
}
