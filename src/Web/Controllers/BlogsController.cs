using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

namespace Web.Controllers;

public class BlogsController(ApplicationDbContext dbContext, ILogger<BlogsController> logger) : BaseController(dbContext, logger)
{
	[HttpGet("search")]
	public async Task<IActionResult> SearchBlogs([FromQuery] string title)
	{
		if (string.IsNullOrEmpty(title))
		{
			return BadRequest("Please provide a title to search for.");
		}

		List<Blog> blogs = await _dbContext.Blogs
			.Where(b => b.Title.Contains(title))
			.ToListAsync();

		return Ok(blogs);
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetBlogById(int id)
	{
		try
		{
			Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(u => u.Id == id);
			if (blog == null)
			{
				return BadRequest(new { message = "Blog not found." });
			}
			return Ok(blog);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting blog. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpGet]
	public async Task<IActionResult> GetBlogs()
	{
		try
		{
			List<BlogModel> blogDTOs = await _dbContext.Blogs
				.Include(b => b.User)
				.Include(b => b.Category)
				.Select(b => new BlogModel
				{
					Id = b.Id,
					Title = b.Title,
					Description = b.Description,
					ImageUrl = b.ImageUrl,
					CreatedAt = b.CreatedAt,
					UpdatedAt = b.UpdatedAt,
					UserId = b.UserId,
					UserName = b.User.Name,
					CategoryId = b.CategoryId,
					CategoryName = b.Category.Name
				})
				.ToListAsync();

			return Ok(blogDTOs);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting blogs. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpPost]
	public async Task<IActionResult> CreateBlog([FromBody] CreateBlogModel model)
	{
		if (model == null || string.IsNullOrWhiteSpace(model.Title) || string.IsNullOrWhiteSpace(model.Description))
		{
			return UnprocessableEntity(new { message = "Invalid Data" });
		}
		try
		{
			User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == model.UserID);
			Category? category = await _dbContext.Categories.FirstOrDefaultAsync(u => u.Id == model.CategoryID);

			if (user == null || category == null)
			{
				return BadRequest(new { message = "Invalid Data" });
			}

			Blog newBlog = new()
			{
				Title = model.Title,
				Description = model.Description,
				UserId = user.Id,
				CategoryId = category.Id,
				ImageUrl = model.ImageUrl,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow
			};

			_dbContext.Add(newBlog);
			await _dbContext.SaveChangesAsync();

			return Ok(
				new BlogModel
				{
					Id = newBlog.Id,
					Title = newBlog.Title,
					Description = newBlog.Description,
					UserId = model.UserID,
					CategoryId = model.CategoryID,
					ImageUrl = newBlog.ImageUrl
				}
			);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating blog");
			return StatusCode(500, "Anerror occurred while processing your request.");
		}
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateBlog(int id, [FromBody] UpdateBlogModel model)
	{
		if (model == null || string.IsNullOrWhiteSpace(model.Title) || string.IsNullOrWhiteSpace(model.Description))
		{
			return UnprocessableEntity(new { message = "Invalid Data" });
		}

		Blog? blog = await _dbContext.Blogs.FirstOrDefaultAsync(u => u.Id == id);
		if (blog == null)
		{
			return BadRequest(new { message = "Blog not found." });
		}

		blog.Title = model.Title;
		blog.Description = model.Description;
		blog.UpdatedAt = DateTime.UtcNow;
		await _dbContext.SaveChangesAsync();

		return Ok(
							new BlogModel
							{
								Id = blog.Id,
								Title = blog.Title,
								Description = blog.Description,
								UserId = blog.UserId,
								CategoryId = blog.CategoryId,
								ImageUrl = blog.ImageUrl
							}
		);
	}
}
