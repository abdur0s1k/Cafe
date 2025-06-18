using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApi.Models
{
    public class Order
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("userid")]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Column("pickupaddress")]
        public string PickupAddress { get; set; } = string.Empty;
        [Column("paymentmethod")]
        public string PaymentMethod { get; set; } = string.Empty;
        [Column("orderdescription")]
        public string OrderDescription { get; set; } = string.Empty;
        [Column("totalprice")]
        public decimal TotalPrice { get; set; }

        [Column("orderdate")]
        public DateTime OrderDate { get; set; }

        [Column("status")]
        public string? Status { get; set; } = "В обработке";
    }

}
