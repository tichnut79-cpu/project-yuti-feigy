namespace ApiPharm.Models
{
    public class CreateMedicineInPharmRequest
    {
        public Guid PharmId { get; set; }

        public List<MedicineQuantityDto> Medicines { get; set; } = new();
    }
}