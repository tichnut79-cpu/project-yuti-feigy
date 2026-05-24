using System.ComponentModel.DataAnnotations;

namespace ApiPharm.Data
{
    public class Pharm
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Group{get;set;}
        [Required]
        public string? Name { get; set; }
        [Required]
        public string City {get;set;}
        [Required]
        public string Address {get;set;}
        [Required]
        public int Waiting_quantity  {get;set;}
                // Foreign Key

         public List<MedicineInPharm> MedicinesInPharms { get; }=[];

        // Navigation Property
    }
}