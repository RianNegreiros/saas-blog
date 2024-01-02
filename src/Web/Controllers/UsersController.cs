using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

namespace Web.Controllers;

public class UsersController(ApplicationDbContext dbContext, ILogger<UsersController> logger) : BaseController(dbContext, logger)
{
	[HttpGet]
	public async Task<IActionResult> GetUsers()
	{
		try
		{
			List<UserModel> users = await _dbContext.Users
			.Include(u => u.Blogs)
				.ThenInclude(b => b.Category)
			.Select(u => new UserModel
			{
				Id = u.Id,
				Name = u.Name,
				Email = u.Email,
				ProfileUrl = u.ProfileUrl,
				Blogs = u.Blogs.Select(b => new BlogModel
				{
					Id = b.Id,
					Title = b.Title,
					Description = b.Description,
					ImageUrl = b.ImageUrl,
					CreatedAt = b.CreatedAt,
					UpdatedAt = b.UpdatedAt,
					UserId = b.UserId,
					UserName = u.Name,
					CategoryId = b.CategoryId,
					CategoryName = b.Category.Name
				}).ToList()
			})
			.ToListAsync();
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
			UserModel? user = await _dbContext.Users
			.Include(u => u.Blogs)
			.ThenInclude(b => b.Category)
		.Select(u => new UserModel
		{
			Id = u.Id,
			Name = u.Name,
			Email = u.Email,
			ProfileUrl = u.ProfileUrl,
			Blogs = u.Blogs.Select(b => new BlogModel
			{
				Id = b.Id,
				Title = b.Title,
				Description = b.Description,
				ImageUrl = b.ImageUrl,
				CreatedAt = b.CreatedAt,
				UpdatedAt = b.UpdatedAt,
				UserId = b.UserId,
				UserName = u.Name,
				CategoryId = b.CategoryId,
				CategoryName = b.Category.Name
			}).ToList()
		})
			.FirstOrDefaultAsync(u => u.Id == id);
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
