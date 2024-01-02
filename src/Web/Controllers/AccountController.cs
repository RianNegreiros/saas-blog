using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

namespace Web.Controllers;

public class AccountController(ApplicationDbContext dbContext, ILogger<AccountController> logger) : BaseController(dbContext, logger)
{
	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] UserLoginModel model)
	{
		try
		{
			if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
			{
				_logger.LogWarning("Invalid login request. Email or password is null or empty.");
				return UnprocessableEntity(new { message = "Invalid Data. Email and password are required." });
			}

			User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

			if (user == null)
			{
				_logger.LogWarning($"User with email {model.Email} not found during login.");
				return BadRequest(new { message = "User not found." });
			}

			bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);

			if (!isPasswordValid)
			{
				_logger.LogWarning($"Invalid password for user with email {model.Email} during login.");
				return BadRequest(new { message = "Invalid password." });
			}

			return Ok(user);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error during user login. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
	{
		try
		{
			if (model == null || string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
			{
				_logger.LogWarning("Invalid user registration request. Model is null or has invalid properties.");
				return UnprocessableEntity(new { message = "Invalid Data" });
			}

			if (await _dbContext.Users.AnyAsync(u => u.Email == model.Email))
			{
				_logger.LogWarning($"User with email {model.Email} already exists during registration.");
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

			_logger.LogInformation($"User with email {newUser.Email} successfully registered.");

			return Ok(new
			{
				newUser.Email,
				newUser.Name,
				Password = hashedPassword,
			});
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating user");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}
}
