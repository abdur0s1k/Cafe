using CafeApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Подключаем PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Добавляем контроллеры
builder.Services.AddControllers();

// Добавляем поддержку раздачи статических файлов (например, для картинок)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection(); // Перенаправление на HTTPS (если используется)
app.UseStaticFiles();      // Подключаем раздачу статических файлов (например, картинок)
app.UseRouting();          // Включение маршрутизации
app.UseCors("AllowAll");   // Подключаем CORS
app.UseAuthorization();

// Включаем Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Настраиваем маршрутизацию контроллеров
app.MapControllers();

app.Run();
