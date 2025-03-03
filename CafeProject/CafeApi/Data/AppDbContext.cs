using Microsoft.EntityFrameworkCore;
using CafeApi.Models;

namespace CafeApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Product> Products { get; set; }
}
