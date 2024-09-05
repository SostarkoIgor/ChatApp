using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Dtos
{

    //this is sto used to log in, we receive this from frontend
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
