using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;

namespace ApiPharm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmController : ControllerBase
    {
        private readonly MedicineDBcontext _context;

        public PharmController(MedicineDBcontext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePharmacy([FromBody] Pharm dto)
        {
            var pharmacy = new Pharm
            {
                Group = dto.Group,
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Waiting_quantity = dto.Waiting_quantity
            };

            _context.Pharms.Add(pharmacy);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Pharmacy created successfully",
                data = pharmacy
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetPharmacies([FromQuery] string? city)
        {
            var query = _context.Pharms.AsQueryable();

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(p => p.City == city);
            }

            var result = await query.ToListAsync();

            return Ok(result);
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            var cities = await _context.Pharms
                .Select(p => p.City)
                .Distinct()
                .ToListAsync();

            return Ok(cities);
        }
    }
}