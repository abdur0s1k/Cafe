using System.ComponentModel.DataAnnotations;

public class UserRegistrationDto
{
    [Required(ErrorMessage = "Имя обязательно для заполнения")]
    public string Name { get; set; } = string.Empty;  // Инициализируем значением по умолчанию

    [Required(ErrorMessage = "Email обязательно для заполнения")]
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    public string Email { get; set; } = string.Empty;  // Инициализируем значением по умолчанию

    [Required(ErrorMessage = "Пароль обязателен для заполнения")]
    [MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов")]
    public string Password { get; set; } = string.Empty;  // Инициализируем значением по умолчанию
}
