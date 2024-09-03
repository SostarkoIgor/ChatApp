using ChatApp.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Data
{
    public class AppDbContext : IdentityDbContext<ChatUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Block>()
                .HasOne(b => b.ChatUser)
                .WithMany(u => u.BlockedUsers)
                .HasForeignKey(b => b.ChatUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Block>()
                .HasOne(b => b.BlockedChatUser)
                .WithMany(u => u.BlockedByUsers)
                .HasForeignKey(b => b.BlockedChatUserId)
                .OnDelete(DeleteBehavior.Restrict);

        }

        public DbSet<ChatUser> ChatUsers { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Block> Blocks { get; set; }
    }
}
