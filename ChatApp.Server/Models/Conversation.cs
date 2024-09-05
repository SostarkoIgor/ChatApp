using Microsoft.Identity.Client;

namespace ChatApp.Server.Models
{

    //entity representing conversation/chatroom
    public class Conversation
    {
        public int Id { get; set; }

        public ICollection<ChatUser> Users { get; set; }
        public ICollection<Message> Messages { get; set; }

        public Conversation() {
            Users = new List<ChatUser>();
            Messages = new List<Message>();
        }
    }
}
