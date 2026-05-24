using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiPharm.Data;
using ApiPharm.Models;

namespace ApiPharm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmController:ControllerBase
    {
        private readonly MedicineDBcontext _context;
        public PharmController(MedicineDBcontext context)
        {
            _context=context;
        }
    }
}