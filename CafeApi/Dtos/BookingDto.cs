namespace CafeApi.Dtos
{
    public class BookingRequest
    {
        public int TableId { get; set; }
        public int Capacity { get; set; }
        public DateTime BookingDateTime { get; set; }
        public int UserId { get; set; }
        public string? UserEmail { get; set; }
    }
}