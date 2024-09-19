using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        public class SimpleMessage
        {
            public int ConvoId { get; set; }
            public string Message { get; set; }
        }
        public async Task SendMessage(string user, SimpleMessage message)
        {
            await Clients.Group(user).SendAsync("ReceiveMessage", message.ConvoId, message.Message);
        }
        public override async Task OnConnectedAsync()
        {
            var userName = Context.User.Identity.Name;
            await Groups.AddToGroupAsync(Context.ConnectionId, userName);
            await base.OnConnectedAsync();
        }

    }
}
