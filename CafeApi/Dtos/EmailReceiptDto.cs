namespace CafeApi.Dtos
{
    public class EmailReceiptDto
    {
        public int UserId { get; set; }
        public string OrderDescription { get; set; } = "";
        public double TotalPrice { get; set; }
        public string Address { get; set; } = "";
    }
}
