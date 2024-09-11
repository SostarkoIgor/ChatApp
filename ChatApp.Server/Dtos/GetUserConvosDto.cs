namespace ChatApp.Server.Dtos
{
    public class GetUserConvosDto
    {
        public class ConvoUser
        {
            public string? UserName { get; set; }
            public string? PublicKey { get; set; }
        }

        public int? ConvoId { get; set; }
        public List<ConvoUser> OtherConvoUsers { get; set; }=new List<ConvoUser>();
        public MessageToUserDto? LastMessage { get; set; }
    }
}
