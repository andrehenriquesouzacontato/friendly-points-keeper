
using FidelidadeAPI.DTOs;

namespace FidelidadeAPI.Services
{
    public interface ICompraService
    {
        Task<List<CompraDTO>> GetAllAsync();
        Task<List<CompraDTO>> GetByClienteIdAsync(Guid clienteId);
        Task<CompraDTO?> GetByIdAsync(Guid id);
        Task<CompraDTO> CreateAsync(CompraRegistroDTO compra);
    }
}
