using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace CafeApi.Models
{
    public class Booking
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("userid")]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Column("tableid")]
        public int TableId { get; set; }
        [Column("capacity")]
        public int Capacity { get; set; }
        [Column("bookingdatetime")]
        public DateTime BookingDateTime { get; set; }
        [Required]
        [Column("username")]
        public string Username { get; set; } 
        [Column("useremail")]
         public string UserEmail { get; set; }


    }
}
