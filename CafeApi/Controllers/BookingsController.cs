using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using CafeApi.Data;
using CafeApi.Models;
using CafeApi.Dtos;

namespace CafeApi.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/bookings/book
        [HttpPost("book")]
        public async Task<IActionResult> BookTable([FromBody] BookingRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FindAsync(model.UserId);
            if (user == null)
                return NotFound("Пользователь не найден");

            var bookingStart = model.BookingDateTime;
            var bookingEnd = bookingStart.AddHours(1); // предполагаемая длительность бронирования

            var bookingExists = await _context.Bookings.AnyAsync(b =>
                b.TableId == model.TableId &&
                b.BookingDateTime < bookingEnd &&
                b.BookingDateTime.AddHours(1) > bookingStart
            );

            if (bookingExists)
                return Conflict("Столик уже забронирован на это время");

            var booking = new Booking
            {
                UserId = model.UserId,
                TableId = model.TableId,
                Capacity = model.Capacity,
                BookingDateTime = bookingStart,
                Username = user.Name,
                UserEmail = user.Email // берем email из базы для надежности
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Бронирование успешно создано", bookingId = booking.Id });
        }


        // GET api/bookings
        // Вывести все бронирования (если нужно)
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings.ToListAsync();
            return Ok(bookings);
        }
        [HttpGet("user")]
        public async Task<IActionResult> GetUserBookings([FromQuery] int userId)
        {
            if (userId <= 0)
                return BadRequest("UserId не передан или некорректен");

            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return Ok(bookings);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteAllBookings()
        {
            var bookings = await _context.Bookings.ToListAsync();
            _context.Bookings.RemoveRange(bookings);
            await _context.SaveChangesAsync();
            return NoContent(); // или Ok()
        }

    }


}
