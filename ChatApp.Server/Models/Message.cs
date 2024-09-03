namespace ChatApp.Server.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead {  get; set; } = false;

        public string SenderId { get; set; }
        public int ConversationId  { get; set; }
        public ChatUser Sender { get; set; }
        public Conversation Conversation { get; set; }

    }
}
