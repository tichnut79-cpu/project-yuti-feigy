using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace ApiPharm.model{
    using Data;
    public class medicineDBcontext:DbContext{

        public medicineDBcontext(DbContextOptions<medicineDBcontext> options) : base(options)
        {
        }

        public DbSet<Medicine> medicines {get;set;}
        public DbSet<Pharm> Pharms {get;set;}	 
        public DbSet<MedicineInPharm> medicineInPharm {get;set;} 

    }

}