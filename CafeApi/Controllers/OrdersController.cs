using Microsoft.AspNetCore.Mvc;
using CafeApi.Data;
using CafeApi.Models;
using CafeApi.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace CafeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            if (dto.PaymentMethod == "Онлайн")
            {
                if (string.IsNullOrWhiteSpace(dto.CardNumber) ||
                    string.IsNullOrWhiteSpace(dto.CardExpiry) ||
                    string.IsNullOrWhiteSpace(dto.CardCvv))
                {
                    return BadRequest("Для онлайн-оплаты необходимо указать данные карты.");
                }
            }

            var order = new Order
            {
                UserId = dto.UserId,
                PickupAddress = dto.PickupAddress,
                PaymentMethod = dto.PaymentMethod,
                OrderDescription = dto.OrderDescription,
                TotalPrice = dto.TotalPrice,
                OrderDate = DateTime.UtcNow,
                Status = dto.Status
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Отправка чека на почту
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user != null && !string.IsNullOrEmpty(user.Email))
            {
                var subject = "Ваш заказ в Кофейне";
                var body = $@"
Здравствуйте, {user.Name}!

Ваш заказ успешно оформлен:

📦 Состав заказа:
{dto.OrderDescription}

📍 Адрес самовывоза:
{dto.PickupAddress}

💰 Общая сумма: {dto.TotalPrice} BYN

Спасибо за заказ!";

                try
                {
                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("alexalexey914@gmail.com", "bxwa cgei ymiu zvyu"),
                        EnableSsl = true,
                    };

                    var mail = new MailMessage("alexalexey914@gmail.com", user.Email, subject, body);
                    await smtpClient.SendMailAsync(mail);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Ошибка отправки email: " + ex.Message);
                }
            }

            return Ok(order);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetOrdersForUser(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (orders == null || !orders.Any())
                return NotFound("Заказы не найдены.");

            return Ok(orders);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var ordersFromDb = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var orders = ordersFromDb.Select(o => new OrderWithUserDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                PickupAddress = o.PickupAddress,
                PaymentMethod = o.PaymentMethod,
                OrderDescription = o.OrderDescription,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                UserName = o.User?.Name ?? string.Empty,
                UserEmail = o.User?.Email ?? string.Empty
            }).ToList();

            return Ok(orders);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAllOrders()
        {
            var orders = await _context.Orders.ToListAsync();

            if (orders.Count == 0)
                return NoContent();

            _context.Orders.RemoveRange(orders);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class OrderStatusUpdateDto
        {
            public string? Status { get; set; }
        }
    }
}
