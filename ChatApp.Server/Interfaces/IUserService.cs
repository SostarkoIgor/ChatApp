namespace ChatApp.Server.Interfaces
{
    public interface IUserService
    {
        public Task<string?> GetEncriptedPrivateKeyOfUserWithMailAsync(string userMail);
    }
}
