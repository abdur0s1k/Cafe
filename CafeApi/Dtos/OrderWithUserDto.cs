namespace CafeApi.Dtos
{
    public class OrderWithUserDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string PickupAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string OrderDescription { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; } 
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }
}
