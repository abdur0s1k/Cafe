// Файл: CafeApi.Tests/UsersControllerTests.cs
using Xunit;
using CafeApi.Controllers;
using CafeApi.Models;
using CafeApi.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Moq;
using System.Threading.Tasks;
using CafeApi.Data;

namespace CafeApi.Tests
{
    public class UsersControllerTests
    {
        private readonly UsersController _controller;
        private readonly Mock<AppDbContext> _dbContextMock = new();
        private readonly Mock<IPasswordHasher<User>> _passwordHasherMock = new();

        public UsersControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "CafeTestDb")
                .Options;

            var context = new AppDbContext(options);
            _controller = new UsersController(context, _passwordHasherMock.Object);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenDataIsNull()
        {
            var result = await _controller.Register(null);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenFieldsEmpty()
        {
            var dto = new UserRegistrationDto { Name = "", Email = "", Password = "" };
            var result = await _controller.Register(dto);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            var dto = new UserLoginDto { Email = "nouser@mail.com", Password = "pass1234" };
            var result = await _controller.Login(dto);
            Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            var result = await _controller.GetUser(999);
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
