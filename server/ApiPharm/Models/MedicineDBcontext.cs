using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace ApiPharm.Models{
    using Data;
    public class MedicineDBcontext:DbContext{

        public MedicineDBcontext(DbContextOptions<MedicineDBcontext> options) : base(options)
        {
        }

        public DbSet<Medicine> Medicines {get;set;}
        public DbSet<Pharm> Pharms {get;set;}	 
        public DbSet<MedicineInPharm> MedicineInPharm {get;set;} 

    }

}