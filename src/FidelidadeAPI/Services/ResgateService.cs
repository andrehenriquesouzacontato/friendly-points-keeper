
using FidelidadeAPI.Data;
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FidelidadeAPI.Services
{
    public class ResgateService : IResgateService
    {
        private readonly ApplicationDbContext _context;

        public ResgateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ResgateDTO>> GetAllAsync()
        {
            var resgates = await _context.Resgates
                .Include(r => r.Cliente)
                .OrderByDescending(r => r.Data)
                .Select(r => new ResgateDTO
                {
                    Id = r.Id,
                    ClienteId = r.ClienteId,
                    Pontos = r.Pontos,
                    Descricao = r.Descricao,
                    Data = r.Data,
                    NomeCliente = r.Cliente != null ? r.Cliente.Nome : string.Empty
                })
                .ToListAsync();

            return resgates;
        }

        public async Task<List<ResgateDTO>> GetByClienteIdAsync(Guid clienteId)
        {
            var resgates = await _context.Resgates
                .Include(r => r.Cliente)
                .Where(r => r.ClienteId == clienteId)
                .OrderByDescending(r => r.Data)
                .Select(r => new ResgateDTO
                {
                    Id = r.Id,
                    ClienteId = r.ClienteId,
                    Pontos = r.Pontos,
                    Descricao = r.Descricao,
                    Data = r.Data,
                    NomeCliente = r.Cliente != null ? r.Cliente.Nome : string.Empty
                })
                .ToListAsync();

            return resgates;
        }

        public async Task<ResgateDTO?> GetByIdAsync(Guid id)
        {
            var resgate = await _context.Resgates
                .Include(r => r.Cliente)
                .Where(r => r.Id == id)
                .Select(r => new ResgateDTO
                {
                    Id = r.Id,
                    ClienteId = r.ClienteId,
                    Pontos = r.Pontos,
                    Descricao = r.Descricao,
                    Data = r.Data,
                    NomeCliente = r.Cliente != null ? r.Cliente.Nome : string.Empty
                })
                .FirstOrDefaultAsync();

            return resgate;
        }

        public async Task<ResgateDTO> CreateAsync(ResgateRegistroDTO resgateDto)
        {
            var cliente = await _context.Clientes.FindAsync(resgateDto.ClienteId);
            if (cliente == null)
            {
                throw new InvalidOperationException("Cliente não encontrado.");
            }

            if (cliente.Pontos < resgateDto.Pontos)
            {
                throw new InvalidOperationException("Cliente não possui pontos suficientes para este resgate.");
            }

            var resgate = new Resgate
            {
                Id = Guid.NewGuid(),
                ClienteId = resgateDto.ClienteId,
                Pontos = resgateDto.Pontos,
                Descricao = resgateDto.Descricao,
                Data = DateTime.Now
            };

            // Atualizar pontos do cliente
            cliente.Pontos -= resgateDto.Pontos;

            _context.Resgates.Add(resgate);
            await _context.SaveChangesAsync();

            return new ResgateDTO
            {
                Id = resgate.Id,
                ClienteId = resgate.ClienteId,
                Pontos = resgate.Pontos,
                Descricao = resgate.Descricao,
                Data = resgate.Data,
                NomeCliente = cliente.Nome
            };
        }
    }
}
