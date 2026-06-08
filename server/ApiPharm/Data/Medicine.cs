using System.ComponentModel.DataAnnotations;

namespace ApiPharm.Data
{
    public class Medicine
    {
        [Key]
        public Guid Id {get; set;} = Guid.NewGuid();
        [Required]
        public string Name {get; set;}
        public List<MedicineInPharm> MedicinesInPharms { get; }=new();
    }
}