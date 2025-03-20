
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Models;

namespace FidelidadeAPI.Services
{
    public interface IClienteService
    {
        Task<List<ClienteDTO>> GetAllAsync();
        Task<ClienteDTO?> GetByIdAsync(Guid id);
        Task<ClienteDTO?> GetByCpfAsync(string cpf);
        Task<ClienteDTO> CreateAsync(ClienteRegistroDTO cliente);
        Task<bool> UpdateAsync(Guid id, ClienteRegistroDTO cliente);
        Task<bool> DeleteAsync(Guid id);
    }
}
