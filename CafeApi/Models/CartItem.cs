using System.ComponentModel.DataAnnotations.Schema;
namespace CafeApi.Models
{
    public class CartItem
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        public Product? Product { get; set; }
    }
}
