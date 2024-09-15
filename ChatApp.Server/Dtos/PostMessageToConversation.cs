namespace ChatApp.Server.Dtos
{
    public class PostMessageToConversation
    {
        public int? ConvoId { get; set; }
        public string? TextCrypted { get; set; }
        public string? ReceiverUsername { get; set; }
    }
}
