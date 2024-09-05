namespace ChatApp.Server.Interfaces
{
    //interface for userservice
    public interface IUserService
    {
        public Task<string?> GetEncriptedPrivateKeyOfUserWithMailAsync(string userMail);
    }
}
