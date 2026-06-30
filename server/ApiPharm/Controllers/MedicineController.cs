using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
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
public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines([FromQuery] string search = "")
{
    var medicines = await _context.Medicines
        .Where(m => m.Name.Contains(search)) // סינון לפי מה שהלקוח מקליד
        .OrderBy(m => m.Name)                  // אפשרי, כדי להחזיר בצורה מסודרת
        .Take(8)                               // רק 5 תוצאות
        .ToListAsync();

    return Ok(medicines);
}
[HttpGet("admin/all")]
[Authorize]
public async Task<ActionResult<IEnumerable<Medicine>>> GetAllMedicinesForAdmin()
{
    var medicines = await _context.Medicines
        .OrderBy(m => m.Name)
        .ToListAsync();

    return Ok(medicines);
}
        [HttpGet("by-name/{name}")]
        public async Task<ActionResult<Medicine>> GetMedicineByName(string name)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.Name == name);

            if (medicine == null)
                return NotFound();

            return medicine;
        }

        [HttpPost("medicine")]
        public async Task<ActionResult<Medicine>> CreateMedicine(Medicine medicine)
        {
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateMedicine), new { id = medicine.Id }, medicine);
        }

        [HttpDelete("by-name/{name}")]
        public async Task<IActionResult> DeleteMedicineByName(string name)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.Name == name);

            if (medicine == null)
                return NotFound();

            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("delete-duplicates/{name}")]
        public async Task<IActionResult> DeleteDuplicateMedicines(string name)
        {
            var medicines = await _context.Medicines
                .Where(m => m.Name == name)
                .ToListAsync();

            if (medicines.Count <= 1)
                return Ok("No duplicates found.");

            // keep first record
            var duplicatesToDelete = medicines.Skip(1).ToList();

            _context.Medicines.RemoveRange(duplicatesToDelete);

            await _context.SaveChangesAsync();

            return Ok($"{duplicatesToDelete.Count} duplicate records deleted.");
        }
    }
}