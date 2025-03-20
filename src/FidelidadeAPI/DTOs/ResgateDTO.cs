
using System.ComponentModel.DataAnnotations;

namespace FidelidadeAPI.DTOs
{
    public class ResgateDTO
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public int Pontos { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public string NomeCliente { get; set; } = string.Empty;
    }
    
    public class ResgateRegistroDTO
    {
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Pontos { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;
    }
}
