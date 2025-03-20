
using System.ComponentModel.DataAnnotations;

namespace FidelidadeAPI.DTOs
{
    public class CompraDTO
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public decimal Valor { get; set; }
        public int PontosGanhos { get; set; }
        public DateTime Data { get; set; }
        public string NomeCliente { get; set; } = string.Empty;
    }
    
    public class CompraRegistroDTO
    {
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        [Range(0.01, 999999.99)]
        public decimal Valor { get; set; }
    }
}
