
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FidelidadeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login/cliente")]
        public async Task<ActionResult<TokenDTO>> LoginCliente(LoginClienteDTO login)
        {
            var token = await _authService.LoginClienteAsync(login);
            if (token == null)
            {
                return Unauthorized("Credenciais inválidas");
            }
            return Ok(token);
        }

        [HttpPost("login/admin")]
        public async Task<ActionResult<TokenDTO>> LoginAdmin(LoginAdminDTO login)
        {
            var token = await _authService.LoginAdminAsync(login);
            if (token == null)
            {
                return Unauthorized("Credenciais inválidas");
            }
            return Ok(token);
        }

        [HttpPost("login/admin/loja")]
        public async Task<ActionResult<TokenDTO>> LoginAdminLoja(LoginAdminLojaDTO login)
        {
            var token = await _authService.LoginAdminLojaAsync(login);
            if (token == null)
            {
                return Unauthorized("Credenciais inválidas");
            }
            return Ok(token);
        }
    }
}
