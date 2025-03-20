
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FidelidadeAPI.Models
{
    public class Administrador
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        [JsonIgnore]
        public string Senha { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string CodigoLoja { get; set; } = string.Empty;
    }
}
