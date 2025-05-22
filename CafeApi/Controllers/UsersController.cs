using Microsoft.AspNetCore.Mvc;
using CafeApi.Data;
using CafeApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CafeApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UsersController(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // Регистрация нового пользователя
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] UserRegistrationDto registration)
        {
            if (registration == null)
                return BadRequest("Данные для регистрации не были переданы.");

            if (string.IsNullOrWhiteSpace(registration.Name) || string.IsNullOrWhiteSpace(registration.Email) || string.IsNullOrWhiteSpace(registration.Password))
                return BadRequest("Все поля обязательны для заполнения.");

            if (await _context.Users.AnyAsync(u => u.Email == registration.Email))
                return BadRequest("Пользователь с таким email уже существует.");

            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if (!emailRegex.IsMatch(registration.Email))
                return BadRequest("Некорректный email.");

            if (registration.Password.Length < 8)
                return BadRequest("Пароль должен содержать минимум 8 символов.");

            var user = new User(registration.Name, registration.Email, "");
            user.PasswordHash = _passwordHasher.HashPassword(user, registration.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }

        // Логин
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] UserLoginDto login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user == null)
                return Unauthorized("Неверный email или пароль.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Неверный email или пароль.");

            return Ok(user);
        }

        // Обновление данных пользователя
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(dto.Id);
            if (user == null)
                return NotFound("Пользователь не найден");

            user.Name = dto.Name;
            user.Email = dto.Email;

            await _context.SaveChangesAsync();
            return Ok();
        }

[HttpPut("change-password")]
public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
{
    if (dto == null)
        return BadRequest("Данные не были переданы");

    var user = await _context.Users.FindAsync(dto.UserId);
    if (user == null)
        return NotFound("Пользователь не найден");

    // Хэшируем новый пароль и сохраняем
    user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);

    await _context.SaveChangesAsync();

    return Ok("Пароль успешно обновлён");
}


        // Удаление пользователя
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Получение пользователя по Id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }
    }
}
