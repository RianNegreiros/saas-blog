using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
	private readonly ApplicationDbContext _dbContext;
	private readonly ILogger<AccountController> _logger;

	public UsersController(ApplicationDbContext dbContext, ILogger<AccountController> logger)
	{
		_dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	[HttpGet]
	public async Task<IActionResult> GetUsers()
	{
		try
		{
			List<User> users = await _dbContext.Users.ToListAsync();
			return Ok(users);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting users. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetUser(int id)
	{
		try
		{
			User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
			if (user == null)
			{
				return BadRequest(new { message = "User not found." });
			}
			return Ok(user);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting user. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}
}
