
using FidelidadeAPI.DTOs;

namespace FidelidadeAPI.Services
{
    public interface IResgateService
    {
        Task<List<ResgateDTO>> GetAllAsync();
        Task<List<ResgateDTO>> GetByClienteIdAsync(Guid clienteId);
        Task<ResgateDTO?> GetByIdAsync(Guid id);
        Task<ResgateDTO> CreateAsync(ResgateRegistroDTO resgate);
    }
}
