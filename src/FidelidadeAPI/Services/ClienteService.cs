
using FidelidadeAPI.Data;
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FidelidadeAPI.Services
{
    public class ClienteService : IClienteService
    {
        private readonly ApplicationDbContext _context;

        public ClienteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ClienteDTO>> GetAllAsync()
        {
            var clientes = await _context.Clientes
                .OrderByDescending(c => c.DataRegistro)
                .Select(c => new ClienteDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    CPF = c.CPF,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Pontos = c.Pontos,
                    DataRegistro = c.DataRegistro
                })
                .ToListAsync();

            return clientes;
        }

        public async Task<ClienteDTO?> GetByIdAsync(Guid id)
        {
            var cliente = await _context.Clientes
                .Where(c => c.Id == id)
                .Select(c => new ClienteDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    CPF = c.CPF,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Pontos = c.Pontos,
                    DataRegistro = c.DataRegistro
                })
                .FirstOrDefaultAsync();

            return cliente;
        }

        public async Task<ClienteDTO?> GetByCpfAsync(string cpf)
        {
            var cliente = await _context.Clientes
                .Where(c => c.CPF == cpf)
                .Select(c => new ClienteDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    CPF = c.CPF,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Pontos = c.Pontos,
                    DataRegistro = c.DataRegistro
                })
                .FirstOrDefaultAsync();

            return cliente;
        }

        public async Task<ClienteDTO> CreateAsync(ClienteRegistroDTO clienteDto)
        {
            // Verificar se o CPF já existe
            var existingCliente = await _context.Clientes.FirstOrDefaultAsync(c => c.CPF == clienteDto.CPF);
            if (existingCliente != null)
            {
                throw new InvalidOperationException("CPF já cadastrado.");
            }

            var cliente = new Cliente
            {
                Id = Guid.NewGuid(),
                Nome = clienteDto.Nome,
                CPF = clienteDto.CPF,
                Email = clienteDto.Email,
                Telefone = clienteDto.Telefone,
                Senha = clienteDto.Senha,
                Pontos = 0,
                DataRegistro = DateTime.Now
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return new ClienteDTO
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                Email = cliente.Email,
                Telefone = cliente.Telefone,
                Pontos = cliente.Pontos,
                DataRegistro = cliente.DataRegistro
            };
        }

        public async Task<bool> UpdateAsync(Guid id, ClienteRegistroDTO clienteDto)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return false;
            }

            // Verificar se está tentando alterar para um CPF que já existe em outro cliente
            if (cliente.CPF != clienteDto.CPF)
            {
                var existingCliente = await _context.Clientes.FirstOrDefaultAsync(c => c.CPF == clienteDto.CPF);
                if (existingCliente != null)
                {
                    throw new InvalidOperationException("CPF já cadastrado para outro cliente.");
                }
            }

            cliente.Nome = clienteDto.Nome;
            cliente.CPF = clienteDto.CPF;
            cliente.Email = clienteDto.Email;
            cliente.Telefone = clienteDto.Telefone;
            
            if (!string.IsNullOrEmpty(clienteDto.Senha))
            {
                cliente.Senha = clienteDto.Senha;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return false;
            }

            // Verificar se não existem compras ou resgates para este cliente
            var temCompras = await _context.Compras.AnyAsync(c => c.ClienteId == id);
            var temResgates = await _context.Resgates.AnyAsync(r => r.ClienteId == id);

            if (temCompras || temResgates)
            {
                throw new InvalidOperationException("Não é possível excluir um cliente com compras ou resgates registrados.");
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
