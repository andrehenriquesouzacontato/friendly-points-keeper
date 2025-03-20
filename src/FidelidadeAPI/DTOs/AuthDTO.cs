
using System.ComponentModel.DataAnnotations;

namespace FidelidadeAPI.DTOs
{
    public class LoginClienteDTO
    {
        [Required]
        public string CPF { get; set; } = string.Empty;
        
        [Required]
        public string Senha { get; set; } = string.Empty;
    }
    
    public class LoginAdminDTO
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Senha { get; set; } = string.Empty;
    }
    
    public class LoginAdminLojaDTO
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Senha { get; set; } = string.Empty;
        
        [Required]
        public string CodigoLoja { get; set; } = string.Empty;
    }
    
    public class TokenDTO
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string UserType { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public Guid? ClienteId { get; set; }
    }
}
