using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace CafeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly string _uploadFolder;

        public UploadController()
        {
            // Укажите путь к папке для сохранения загруженных файлов
            _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            Directory.CreateDirectory(_uploadFolder); // Создаем папку, если ее нет
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(_uploadFolder, fileName);

            // Сохранение файла на сервере
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath = $"images/{fileName}" }); // Возвращаем путь к файлу
        }
    }
}
