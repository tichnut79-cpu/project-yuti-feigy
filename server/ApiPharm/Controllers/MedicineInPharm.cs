using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;

namespace ApiPharm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineInPharmController : ControllerBase
    {
        private readonly MedicineDBcontext _context;
        public MedicineInPharmController(MedicineDBcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPharms()
        {
            var data = _context.Pharms
                .Include(p => p.MedicinesInPharms)
                .ThenInclude(mp => mp.Medicine)
                .ToList();

            return Ok(data);
        }

        // [HttpPost("add-medicine")]
        // public IActionResult AddMedicineToPharm(Guid pharmId, Guid medicineId)
        // {
        //     var link = new MedicineInPharm
        //     {
        //         IdPharm = pharmId,
        //         IdMedicine = medicineId
        //     };

        //     _context.MedicineInPharm.Add(link);
        //     _context.SaveChanges();

        //     return Ok();
        // }

        // [HttpPost]
        // public IActionResult AddPharm(Pharm pharm)
        // {
        //     _context.Pharms.Add(pharm);
        //     _context.SaveChanges();
        //     return Ok();
        // }

        [HttpPost("seed")]
        public async Task<IActionResult> SeedMedicineInPharms()
        {
            var pharms = await _context.Pharms.ToListAsync();

            if (!pharms.Any())
                return BadRequest("No pharms");

            var random = new Random();
            var result = new List<MedicineInPharm>();

            foreach (var pharm in pharms)
            {
                var count = random.Next(50, 100);

                var selectedMedicines = await _context.Medicines
                    .OrderBy(x => Guid.NewGuid())   // DB-side random
                    .Take(count)
                    .Select(m => m.Id)
                    .ToListAsync();

                foreach (var medicineId in selectedMedicines)
                {
                    result.Add(new MedicineInPharm
                    {
                        IdPharm = pharm.Id,
                        IdMedicine = medicineId,
                        Quantity = random.Next(10, 100)
                    });
                }
            }

            await _context.MedicineInPharm.AddRangeAsync(result);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                total = result.Count
            });
        }
    }
}