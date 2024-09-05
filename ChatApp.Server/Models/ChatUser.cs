using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Models
{
    //chat user, 
    public class ChatUser:IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        [MaxLength(128)]
        public string Description {  get; set; } = string.Empty;

        //others encode messages sent to user with this
        [Required]
        public string? PublicKey {  get; set; }

        //people decode messages sent to them with this
        //this is encripted key, they have to decode it on frontend with key derived from their password
        [Required]
        public string? EncriptedPrivateKey { get; set; }

        //img url
        public string? Image { get; set; }

        public ICollection<Conversation> Conversations { get; set; }
        public ICollection<Message> Messages { get; set; }

        public ICollection<Block> BlockedUsers { get; set; }

        public ICollection<Block> BlockedByUsers { get; set; }



    }
}
