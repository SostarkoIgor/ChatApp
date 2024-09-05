using Microsoft.AspNetCore.Identity;

namespace ChatApp.Server.Dtos
{

    //dto for login response, sent to frontend with successful login
    public class LoginResponseDto
    {
        //jwt
        public string Token { get; set; }

        //key with which user will decode messages ment for them
        public string PrivateEncriptedKey {  get; set; }

        //roles of user
        public IList<string> Roles { get; set; }
    }
}
