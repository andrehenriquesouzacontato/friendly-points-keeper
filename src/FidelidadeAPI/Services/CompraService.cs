
using FidelidadeAPI.Data;
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FidelidadeAPI.Services
{
    public class CompraService : ICompraService
    {
        private readonly ApplicationDbContext _context;

        public CompraService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CompraDTO>> GetAllAsync()
        {
            var compras = await _context.Compras
                .Include(c => c.Cliente)
                .OrderByDescending(c => c.Data)
                .Select(c => new CompraDTO
                {
                    Id = c.Id,
                    ClienteId = c.ClienteId,
                    Valor = c.Valor,
                    PontosGanhos = c.PontosGanhos,
                    Data = c.Data,
                    NomeCliente = c.Cliente != null ? c.Cliente.Nome : string.Empty
                })
                .ToListAsync();

            return compras;
        }

        public async Task<List<CompraDTO>> GetByClienteIdAsync(Guid clienteId)
        {
            var compras = await _context.Compras
                .Include(c => c.Cliente)
                .Where(c => c.ClienteId == clienteId)
                .OrderByDescending(c => c.Data)
                .Select(c => new CompraDTO
                {
                    Id = c.Id,
                    ClienteId = c.ClienteId,
                    Valor = c.Valor,
                    PontosGanhos = c.PontosGanhos,
                    Data = c.Data,
                    NomeCliente = c.Cliente != null ? c.Cliente.Nome : string.Empty
                })
                .ToListAsync();

            return compras;
        }

        public async Task<CompraDTO?> GetByIdAsync(Guid id)
        {
            var compra = await _context.Compras
                .Include(c => c.Cliente)
                .Where(c => c.Id == id)
                .Select(c => new CompraDTO
                {
                    Id = c.Id,
                    ClienteId = c.ClienteId,
                    Valor = c.Valor,
                    PontosGanhos = c.PontosGanhos,
                    Data = c.Data,
                    NomeCliente = c.Cliente != null ? c.Cliente.Nome : string.Empty
                })
                .FirstOrDefaultAsync();

            return compra;
        }

        public async Task<CompraDTO> CreateAsync(CompraRegistroDTO compraDto)
        {
            var cliente = await _context.Clientes.FindAsync(compraDto.ClienteId);
            if (cliente == null)
            {
                throw new InvalidOperationException("Cliente não encontrado.");
            }

            int pontosGanhos = (int)Math.Floor(compraDto.Valor);

            var compra = new Compra
            {
                Id = Guid.NewGuid(),
                ClienteId = compraDto.ClienteId,
                Valor = compraDto.Valor,
                PontosGanhos = pontosGanhos,
                Data = DateTime.Now
            };

            // Atualizar pontos do cliente
            cliente.Pontos += pontosGanhos;

            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            return new CompraDTO
            {
                Id = compra.Id,
                ClienteId = compra.ClienteId,
                Valor = compra.Valor,
                PontosGanhos = compra.PontosGanhos,
                Data = compra.Data,
                NomeCliente = cliente.Nome
            };
        }
    }
}
