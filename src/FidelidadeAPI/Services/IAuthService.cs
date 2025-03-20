
using FidelidadeAPI.DTOs;

namespace FidelidadeAPI.Services
{
    public interface IAuthService
    {
        Task<TokenDTO?> LoginClienteAsync(LoginClienteDTO login);
        Task<TokenDTO?> LoginAdminAsync(LoginAdminDTO login);
        Task<TokenDTO?> LoginAdminLojaAsync(LoginAdminLojaDTO login);
    }
}
