using ChatApp.Server.Data;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Services
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _appDbContext;
        public MessageService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<MessageToUserDto?> GetLastConvoMessage(int convoID, ChatUser encrptedFor)
        {
            return (await _appDbContext.Messages.Where(a => a.ConversationId == convoID && a.EncryptedFor==encrptedFor).OrderByDescending(a => a.SentAt)
                .Select(a =>new MessageToUserDto { MessageCrypted=a.Text, MessageRead=a.IsRead, MessageSentAt=a.SentAt})
                .FirstOrDefaultAsync());
        }

        public async Task<Message?> PostMessageToConversationAsync(PostMessageToConversation postMessageToConversation, ChatUser? sender, Conversation? conversation)
        {
            if (sender == null || postMessageToConversation.ReceiverUsername == null) { return null; }

            
            if (conversation == null)
            {
                return null;
            }

            try
            {
                var msg = new Message()
                {
                    Conversation = conversation,
                    Sender = sender,
                    Text = postMessageToConversation.TextCrypted,
                    EncryptedFor = await _appDbContext.ChatUsers.Where(a => a.UserName == postMessageToConversation.ReceiverUsername).FirstOrDefaultAsync()
                };
                await _appDbContext.Messages.AddAsync(msg);
                await _appDbContext.SaveChangesAsync();
                return msg;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
    }
}
