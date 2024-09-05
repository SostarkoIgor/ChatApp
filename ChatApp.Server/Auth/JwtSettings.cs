namespace ChatApp.Server.Auth
{
    // Class that holds the settings required for JWT authentication
    public class JwtSettings
    {
        // Property to store the secret key used for signing JWT tokens, we get this from appsetings.json, set up is in program.cs
        public string Key { get; set; }
    }
}
