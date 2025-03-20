
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FidelidadeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly ICompraService _compraService;

        public ComprasController(ICompraService compraService)
        {
            _compraService = compraService;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<CompraDTO>>> GetAll()
        {
            var compras = await _compraService.GetAllAsync();
            return Ok(compras);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CompraDTO>> GetById(Guid id)
        {
            var compra = await _compraService.GetByIdAsync(id);
            if (compra == null)
            {
                return NotFound();
            }
            return Ok(compra);
        }

        [HttpGet("cliente/{clienteId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CompraDTO>>> GetByClienteId(Guid clienteId)
        {
            var compras = await _compraService.GetByClienteIdAsync(clienteId);
            return Ok(compras);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<CompraDTO>> Create(CompraRegistroDTO compra)
        {
            try
            {
                var novaCompra = await _compraService.CreateAsync(compra);
                return CreatedAtAction(nameof(GetById), new { id = novaCompra.Id }, novaCompra);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
