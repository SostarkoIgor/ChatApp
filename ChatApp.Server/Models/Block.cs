namespace ChatApp.Server.Models
{
    public class Block
    {
        public int Id { get; set; }
        public string ChatUserId { get; set; }
        public string BlockedChatUserId { get; set; }

        public ChatUser ChatUser { get; set; }
        public ChatUser BlockedChatUser { get; set; }
    }
}
