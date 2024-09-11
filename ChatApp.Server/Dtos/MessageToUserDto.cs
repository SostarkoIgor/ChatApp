namespace ChatApp.Server.Dtos
{
    public class MessageToUserDto
    {
        public string? MessageCrypted {  get; set; }
        public bool? MessageRead { get; set; }
        public DateTime? MessageSentAt { get; set; }
    }
}
