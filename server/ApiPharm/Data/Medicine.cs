using System.ComponentModel.DataAnnotations;

namespace ApiPharm.Data
{
    public class Medicine
    {
        [Key]
        public Guid Id {get; set;}
        [Required]
        public string name {get; set;}
        public List<MedicineInPharm> medicinesInPharms { get; }=[];
    }
}