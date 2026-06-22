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

        [HttpPost("add-medicine")]
        public IActionResult AddMedicineToPharm(Guid pharmId, Guid medicineId)
        {
            var link = new MedicineInPharm
            {
                IdPharm = pharmId,
                IdMedicine = medicineId
            };

            _context.MedicineInPharm.Add(link);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost]
        public IActionResult AddPharm(Pharm pharm)
        {
            _context.Pharms.Add(pharm);
            _context.SaveChanges();
            return Ok();
        }
    }
}