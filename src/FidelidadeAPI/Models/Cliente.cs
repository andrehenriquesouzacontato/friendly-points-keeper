
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FidelidadeAPI.Models
{
    public class Cliente
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(14)]
        public string CPF { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Email { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Telefone { get; set; } = string.Empty;
        
        [MaxLength(100)]
        [JsonIgnore]
        public string? Senha { get; set; }
        
        public int Pontos { get; set; }
        
        public DateTime DataRegistro { get; set; } = DateTime.Now;

        [JsonIgnore]
        public virtual ICollection<Compra>? Compras { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Resgate>? Resgates { get; set; }
    }
}
