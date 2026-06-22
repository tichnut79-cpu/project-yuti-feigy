using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace ApiPharm.Models
{
    using Data;
    public class MedicineDBcontext : DbContext
    {

        public MedicineDBcontext(DbContextOptions<MedicineDBcontext> options) : base(options)
        {
        }

        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Pharm> Pharms { get; set; }
        public DbSet<MedicineInPharm> MedicineInPharm { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MedicineInPharm>()
                .HasKey(x => new { x.IdPharm, x.IdMedicine });

            modelBuilder.Entity<MedicineInPharm>()
                .HasOne(x => x.Pharm)
                .WithMany(p => p.MedicinesInPharms)
                .HasForeignKey(x => x.IdPharm);

            modelBuilder.Entity<MedicineInPharm>()
                .HasOne(x => x.Medicine)
                .WithMany(m => m.MedicinesInPharms)
                .HasForeignKey(x => x.IdMedicine);
        }

    }

}