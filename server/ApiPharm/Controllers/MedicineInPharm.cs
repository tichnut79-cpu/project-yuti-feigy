using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;

namespace ApiPharm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineInPharmController:ControllerBase
    {
        private readonly MedicineDBcontext _context;
        public MedicineInPharmController(MedicineDBcontext context)
        {
            _context=context;
        }
    }
}