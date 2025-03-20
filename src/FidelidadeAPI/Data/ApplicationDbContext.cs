
using FidelidadeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FidelidadeAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<Resgate> Resgates { get; set; }
        public DbSet<Administrador> Administradores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações do Cliente
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.CPF)
                .IsUnique();

            // Configurações de Compra
            modelBuilder.Entity<Compra>()
                .HasOne(c => c.Cliente)
                .WithMany(c => c.Compras)
                .HasForeignKey(c => c.ClienteId);

            // Configurações de Resgate
            modelBuilder.Entity<Resgate>()
                .HasOne(r => r.Cliente)
                .WithMany(c => c.Resgates)
                .HasForeignKey(r => r.ClienteId);
        }
    }
}
