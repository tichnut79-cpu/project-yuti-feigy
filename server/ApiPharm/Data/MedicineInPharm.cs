using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiPharm.Data
{
    public class MedicineInPharm
    {
        public Guid Id {get;set;}

      //  [ForeignKey("Id")]
        public Guid IdMedicine{get;set;}
        public Medicine Medicine{get; set;}

     //   [ForeignKey("Id")]
        public Guid IdPharm{get;set;}
        public Pharm Pharm{get; set;}

        [Required]
        public int Quantity{get;set;}
        
    }
}