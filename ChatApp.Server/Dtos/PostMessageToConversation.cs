namespace ChatApp.Server.Dtos
{
    public class PostMessageToConversation
    {
        public class MessageData
        {
            public string? TextCrypted { get; set; }
            public string? ReceiverUsername { get; set; }
        }
        public int? ConvoId { get; set; }
        public List<MessageData>? EachUserData {  get; set; }
    }
}
