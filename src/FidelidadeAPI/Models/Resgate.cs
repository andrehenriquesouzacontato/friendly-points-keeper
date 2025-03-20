
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FidelidadeAPI.Models
{
    public class Resgate
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        public int Pontos { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;
        
        [Required]
        public DateTime Data { get; set; } = DateTime.Now;
        
        [ForeignKey("ClienteId")]
        public virtual Cliente? Cliente { get; set; }
    }
}
