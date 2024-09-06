using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Dtos
{
    //dto  for register, type of data received from frontend on register request
    public class RegisterDto
    {
        [Required]
        [MinLength(2)]
        [MaxLength(50)]

        public string FirstName { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string LastName { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string EncryptedPrivateKey { get; set; }

        [Required]
        public string PublicKey {  get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(20)]
        public string Username { get; set; }

        [Required]
        public string IV { get; set; }
        [Required]
        public string Salt { get; set; }


    }
}
