
using System.ComponentModel.DataAnnotations;

namespace FidelidadeAPI.DTOs
{
    public class ClienteDTO
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Telefone { get; set; } = string.Empty;
        public int Pontos { get; set; }
        public DateTime DataRegistro { get; set; }
    }
    
    public class ClienteRegistroDTO
    {
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(14)]
        public string CPF { get; set; } = string.Empty;
        
        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Telefone { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Senha { get; set; }
    }
}
