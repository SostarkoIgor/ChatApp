using Microsoft.AspNetCore.Identity;

namespace ChatApp.Server.Dtos
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public string PrivateEncriptedKey {  get; set; }
        public IList<string> Roles { get; set; }
    }
}
