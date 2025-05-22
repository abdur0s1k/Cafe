namespace CafeApi.Dtos
{
    public class OrderDto
    {
        public int UserId { get; set; }
        public string PickupAddress { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = string.Empty;
        public string OrderDescription { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string? Status{ get; set; } 

        // Эти поля не сохраняются, используются только при онлайн-оплате
        public string? CardNumber { get; set; }
        public string? CardExpiry { get; set; }
        public string? CardCvv { get; set; }
    }
}
