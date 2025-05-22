using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApi.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("category")]
        public string Category { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше нуля.")]
        [Column("price")]
        public decimal Price { get; set; }


        [Column("weight")]
        public int Weight { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("imageurl")]
        public string? ImageUrl { get; set; }

        [Column("ishidden")]
        public bool IsHidden { get; set; } = false;
    }
}
