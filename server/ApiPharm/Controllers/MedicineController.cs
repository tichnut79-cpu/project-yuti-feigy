using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;
using System.Linq;
namespace ApiPharm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController :ControllerBase
    {
        private readonly MedicineDBcontext _context;
        public MedicinesController(MedicineDBcontext context)
        {
            _context=context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines()
        {
            return await _context.Medicines.ToListAsync();
        }

       [HttpGet("search/{name}")]
public async Task<IActionResult> Search(string name)
{
    var result = await _context.Medicines
        .Where(m => m.Name.Contains(name))
        .ToListAsync();

    return Ok(result);
}
[HttpPost]
public async Task<IActionResult> AddMedicine(Medicine medicine)
{
    _context.Medicines.Add(medicine);
    await _context.SaveChangesAsync();

    return Ok(medicine);
}
    //     [HttpGet]
    // public IActionResult GetAllMedicines()
    // {
    //     return Ok(_context.Medicines.ToList());
    // }
    }
}