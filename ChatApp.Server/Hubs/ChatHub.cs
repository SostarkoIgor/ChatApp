using ChatApp.Server.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, ConvoMessageDto message)
        {
            await Clients.Group(user).SendAsync("ReceiveMessage", message.ConvoId, message);
        }
        public override async Task OnConnectedAsync()
        {
            var userName = Context.User.Identity.Name;
            await Groups.AddToGroupAsync(Context.ConnectionId, userName);
            await base.OnConnectedAsync();
        }

    }
}
