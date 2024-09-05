using ChatApp.Server.Data;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatApp.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<ChatUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(AppDbContext appDbContext, UserManager<ChatUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<string?> GetEncriptedPrivateKeyOfUserWithMailAsync(string userMail)
        {
            if (userMail != _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email))
            {
                return null;
            }
            return (await _userManager.FindByEmailAsync(userMail))?.EncriptedPrivateKey;
        }
    }
}
