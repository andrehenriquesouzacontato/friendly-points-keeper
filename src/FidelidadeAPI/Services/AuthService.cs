
using FidelidadeAPI.Data;
using FidelidadeAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FidelidadeAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthService(ApplicationDbContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<TokenDTO?> LoginClienteAsync(LoginClienteDTO login)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.CPF == login.CPF && c.Senha == login.Senha);

            if (cliente == null)
            {
                return null;
            }

            return GenerateToken(cliente.Id.ToString(), cliente.Nome, "cliente", cliente.Id);
        }

        public async Task<TokenDTO?> LoginAdminAsync(LoginAdminDTO login)
        {
            var admin = await _context.Administradores
                .FirstOrDefaultAsync(a => a.Username == login.Username && a.Senha == login.Senha);

            if (admin == null)
            {
                return null;
            }

            return GenerateToken(admin.Id.ToString(), admin.Username, "admin", null);
        }

        public async Task<TokenDTO?> LoginAdminLojaAsync(LoginAdminLojaDTO login)
        {
            var admin = await _context.Administradores
                .FirstOrDefaultAsync(a => 
                    a.Username == login.Username && 
                    a.Senha == login.Senha && 
                    a.CodigoLoja == login.CodigoLoja);

            if (admin == null)
            {
                return null;
            }

            return GenerateToken(admin.Id.ToString(), admin.Username, "admin", null);
        }

        private TokenDTO GenerateToken(string userId, string userName, string userType, Guid? clienteId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, userType)
            };
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            return new TokenDTO
            {
                AccessToken = tokenHandler.WriteToken(token),
                Expiration = tokenDescriptor.Expires.Value,
                UserType = userType,
                UserName = userName,
                ClienteId = clienteId
            };
        }
    }
}
