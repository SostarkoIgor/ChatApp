﻿using ChatApp.Server.Data;
using ChatApp.Server.Dtos;
using ChatApp.Server.Interfaces;
using ChatApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Services
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IConversationService _conversationService;
        public MessageService(AppDbContext appDbContext, IConversationService conversationService)
        {
            _appDbContext = appDbContext;
            _conversationService = conversationService;
        }

        public async Task<MessageToUserDto?> GetLastConvoMessage(int convoID)
        {
            return (await _appDbContext.Messages.Where(a => a.ConversationId == convoID).OrderByDescending(a => a.SentAt)
                .Select(a =>new MessageToUserDto { MessageCrypted=a.Text, MessageRead=a.IsRead, MessageSentAt=a.SentAt})
                .FirstOrDefaultAsync());
        }

        public async Task<bool> PostMessageToConversationAsync(PostMessageToConversation postMessageToConversation, ChatUser? sender)
        {
            if (sender == null || postMessageToConversation.EachUserData == null) { return false; }

            Conversation? conversation = await _conversationService.GetConversationByIdAsync(postMessageToConversation.ConvoId);
            if (conversation == null)
            {
                return false;
            }

            try
            {
                foreach (var msgForUser in postMessageToConversation.EachUserData)
                {
                    await _appDbContext.Messages.AddAsync(new Message()
                    {
                        Conversation = conversation,
                        Sender = sender,
                        Text = msgForUser.TextCrypted
                    });
                }
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }
    }
}
