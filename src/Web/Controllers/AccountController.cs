using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

[Route("api/[controller]")]
public class AccountController : ControllerBase
{
	private readonly ApplicationDbContext _dbContext;
	private readonly ILogger<AccountController> _logger;

	public AccountController(ApplicationDbContext dbContext, ILogger<AccountController> logger)
	{
		_dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
	{
		if (model == null || string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
		{
			return UnprocessableEntity(new { message = "Invalid Data" });
		}
		try
		{
			if (await _dbContext.Users.AnyAsync(u => u.Email == model.Email))
			{
				return BadRequest(new { message = "Invalid Data" });
			}

			string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

			var newUser = new User
			{
				Name = model.Name,
				Email = model.Email,
				Password = hashedPassword,
			};

			_dbContext.Users.Add(newUser);
			await _dbContext.SaveChangesAsync();

			return Ok(new
			{
				newUser.Email,
				newUser.Name,
				Password = hashedPassword,
			});
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creatring user");
			return StatusCode(500, "Anerror occurred while processing your request.");
		}
	}
}
