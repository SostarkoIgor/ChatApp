namespace ChatApp.Server.Dtos
{
    public class ConvoMessageDto
    {
        public int Id { get; set; }
        public int? ConvoId { get; set; }
        public string? EncryptedMessage { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public string? SenderUsername { get; set; }
        public string? ReceiverUsername { get; set; }
    }
}
