using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CafeApi.Data;
using CafeApi.Models;
using CafeApi.Dtos;


[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }


    public class AddToCartRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        if (request.Quantity < 1)
            return BadRequest("Количество должно быть не меньше 1.");

        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == request.UserId && ci.ProductId == request.ProductId);

        if (cartItem == null)
        {
            cartItem = new CartItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            _context.CartItems.Add(cartItem);
        }
        else
        {
            cartItem.Quantity += request.Quantity;
            _context.CartItems.Update(cartItem);
        }

        await _context.SaveChangesAsync();

        return Ok(cartItem);
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart([FromQuery] int userId)
    {

        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        if (cartItems.Count == 0)
            return NotFound("Корзина пользователя уже пуста.");

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpGet]
    public async Task<IActionResult> GetCartItems([FromQuery] int userId)
    {
        var cartItems = await _context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        var result = cartItems.Select(ci => new
        {
            id = ci.Id,
            productId = ci.ProductId,
            name = ci.Product?.Name ?? string.Empty,
            weight = ci.Product?.Weight ?? 0,
            price = ci.Product?.Price ?? 0m,
            img = ci.Product?.ImageUrl ?? string.Empty,
            quantity = ci.Quantity,
            category = ci.Product?.Category ?? string.Empty,
        });

        return Ok(result);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] CartItemUpdateDto updateDto)
    {
        var cartItem = await _context.CartItems.FindAsync(id);
        if (cartItem == null)
            return NotFound();

        cartItem.Quantity = updateDto.Quantity;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCartItem(int id)
    {
        var item = await _context.CartItems.FindAsync(id);
        if (item == null)
            return NotFound();

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}
