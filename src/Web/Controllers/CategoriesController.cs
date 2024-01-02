using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

namespace Web.Controllers;

public class CategoriesController(ApplicationDbContext dbContext, ILogger<CategoriesController> logger) : BaseController(dbContext, logger)
{
	[HttpGet("{id}")]
	public async Task<IActionResult> GetCategory(int id)
	{
		try
		{
			Category? category = await _dbContext.Categories.FirstOrDefaultAsync(u => u.Id == id);
			if (category == null)
			{
				_logger.LogWarning($"Category with id {id} not found during GetCategory.");
				return BadRequest(new { message = "Category not found." });
			}
			return Ok(category);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting category. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpGet]
	public async Task<IActionResult> GetCategories()
	{
		try
		{
			List<Category> categories = await _dbContext.Categories.ToListAsync();
			return Ok(categories);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting categories. Details: {ex.Message}");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}

	[HttpPost]
	public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryModel model)
	{
		if (string.IsNullOrWhiteSpace(model.Name))
		{
			_logger.LogWarning("Invalid category creation request. Name is null or empty.");
			return UnprocessableEntity(new { message = "Invalid Data" });
		}
		try
		{
			Category newCategory = new()
			{
				Name = model.Name
			};

			_dbContext.Categories.Add(newCategory);
			await _dbContext.SaveChangesAsync();

			_logger.LogInformation($"Category {newCategory.Name} successfully created.");

			return Ok(new
			{
				newCategory.Name,
			});
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating category");
			return StatusCode(500, "An error occurred while processing your request.");
		}
	}
}
