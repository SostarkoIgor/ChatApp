using ChatApp.Server.Data;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatApp.Server.Services
{
    //implementation of iuserservice
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

        public async Task<bool> ExistsUserWithUserNameAsync(string userName)
        {
            bool rez = await _appDbContext.ChatUsers.AnyAsync(a => a.UserName == userName);
            return rez;
        }

        //gets private key of currently logged in user, returns it to them on login
        public async Task<string?> GetEncriptedPrivateKeyOfUserWithMailAsync(string userMail)
        {
            if (userMail != _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email))
            {
                return null;
            }
            return (await _userManager.FindByEmailAsync(userMail))?.EncriptedPrivateKey;
        }

        public async Task<string?> GetPublicKeyOfUserAsync(string userName)
        {
            return (await _appDbContext.ChatUsers.Where(a=>a.UserName== userName).FirstOrDefaultAsync())?.PublicKey;
        }

        public async Task<ChatUser?> GetUserByUsernameAsync(string userName)
        {
            return await _appDbContext.ChatUsers.Where(a=>a.UserName==userName).FirstOrDefaultAsync();
        }

        public async Task<UserDataDto?> GetUserDataAsync(string userName)
        {
            ChatUser? user = await GetUserByUsernameAsync(userName);
            if (user == null) { return null; }
            return new UserDataDto()
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Description = user.Description,
                PublicKey = user.PublicKey
            };
        }

        public async Task<UserInfoDto?> GetUserInfoByUsernameAsync(string userName)
        {
            return await _appDbContext.Users.Where(a=>a.UserName == userName).Select(
                a=>new UserInfoDto()
                {
                    Description = a.Description,
                    UserName = a.UserName,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email
                }
                ).FirstOrDefaultAsync();
        }

        public async Task<SearchUsersByUsernameResponseDto> GetUsersByUsernameAsync(string username)
        {
            var users = await _appDbContext.Users.Where(a =>a.UserName.Contains(username))
                .Where(a=> !a.UserName.Equals(_httpContextAccessor.HttpContext.User.Identity.Name)).Select(a =>
                new SearchUsersByUsernameResponseDto.UserInfo()
                {
                    PublicKey = a.PublicKey,
                    Username = a.UserName
                }).Take(10).ToListAsync();
            return new SearchUsersByUsernameResponseDto() { Users = users };
        }
    }
}
