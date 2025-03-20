
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FidelidadeAPI.Models
{
    public class Compra
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Valor { get; set; }
        
        [Required]
        public int PontosGanhos { get; set; }
        
        [Required]
        public DateTime Data { get; set; } = DateTime.Now;
        
        [ForeignKey("ClienteId")]
        public virtual Cliente? Cliente { get; set; }
    }
}
