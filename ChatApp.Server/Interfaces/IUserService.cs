using ChatApp.Server.Dtos;
using ChatApp.Server.Models;
using System.Diagnostics.Eventing.Reader;

namespace ChatApp.Server.Interfaces
{
    //interface for userservice
    public interface IUserService
    {
        public Task<string?> GetEncriptedPrivateKeyOfUserWithMailAsync(string userMail);

        public Task<ChatUser?> GetUserByUsernameAsync(string userName);

        public Task<SearchUsersByUsernameResponseDto> GetUsersByUsernameAsync(string username);

        public Task<UserDataDto?> GetUserDataAsync(string userName);

        public Task<string?> GetPublicKeyOfUserAsync(string userName);

        public Task<bool> ExistsUserWithUserNameAsync(string userName);
    }

}
