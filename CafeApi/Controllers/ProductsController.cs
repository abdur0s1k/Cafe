using Microsoft.AspNetCore.Mvc;
using CafeApi.Data;
using CafeApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Globalization;

namespace CafeApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct([FromForm] Product product, IFormFile file)
        {

            if (product.Weight <= 0)
            {
                return BadRequest("Вес товара должен быть положительным.");
            }


            if (file != null && file.Length > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine("wwwroot", "images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                product.ImageUrl = $"/images/{fileName}";
            }

            product.CreatedAt = DateTime.UtcNow;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPut("toggleHidden/{id}")]
        public async Task<IActionResult> ToggleHidden(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            product.IsHidden = !product.IsHidden;
            await _context.SaveChangesAsync();
            return Ok(product);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] Product product, IFormFile? file)
        {
    
            Console.WriteLine($"Получен запрос на обновление товара с ID: {id}");

            if (id != product.Id)
            {
                return BadRequest("ID товара не соответствует");
            }

            Console.WriteLine($"Обновляемый товар: {product.Name}");
            Console.WriteLine($"Цена товара: {product.Price}");
            Console.WriteLine($"Вес товара: {product.Weight}");
            Console.WriteLine($"Категория товара: {product.Category}");
            Console.WriteLine($"Описание товара: {product.Description}");
            Console.WriteLine($"Изображение: {product.ImageUrl ?? "Нет изображения"}");

            if (product.Weight <= 0)
            {
                Console.WriteLine("Ошибка: Вес товара должен быть положительным.");
                return BadRequest("Вес товара должен быть положительным.");
            }

            if (product.Price <= 0)
            {
                Console.WriteLine("Ошибка: Цена товара должна быть положительной.");
                return BadRequest("Цена товара должна быть положительной.");
            }

            if (file != null && file.Length > 0)
            {
                Console.WriteLine($"Загружаем файл: {file.FileName}");
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine("wwwroot", "images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                product.ImageUrl = $"/images/{fileName}";
            }
            else
            {
                Console.WriteLine("Изображение не было загружено.");
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                Console.WriteLine("Данные успешно обновлены в базе данных.");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    Console.WriteLine("Товар не найден в базе данных.");
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
