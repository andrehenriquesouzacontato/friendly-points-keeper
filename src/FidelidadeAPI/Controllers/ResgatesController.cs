
using FidelidadeAPI.DTOs;
using FidelidadeAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FidelidadeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResgatesController : ControllerBase
    {
        private readonly IResgateService _resgateService;

        public ResgatesController(IResgateService resgateService)
        {
            _resgateService = resgateService;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<ResgateDTO>>> GetAll()
        {
            var resgates = await _resgateService.GetAllAsync();
            return Ok(resgates);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ResgateDTO>> GetById(Guid id)
        {
            var resgate = await _resgateService.GetByIdAsync(id);
            if (resgate == null)
            {
                return NotFound();
            }
            return Ok(resgate);
        }

        [HttpGet("cliente/{clienteId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ResgateDTO>>> GetByClienteId(Guid clienteId)
        {
            var resgates = await _resgateService.GetByClienteIdAsync(clienteId);
            return Ok(resgates);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ResgateDTO>> Create(ResgateRegistroDTO resgate)
        {
            try
            {
                var novoResgate = await _resgateService.CreateAsync(resgate);
                return CreatedAtAction(nameof(GetById), new { id = novoResgate.Id }, novoResgate);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
