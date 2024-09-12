namespace ChatApp.Server.Dtos
{
    public class SearchUsersByUsernameResponseDto
    {
        public class UserInfo
        {
            public string? Username {  get; set; }
            public string? PublicKey { get; set; }
        }
        public List<UserInfo>? Users { get; set; }
    }
}
