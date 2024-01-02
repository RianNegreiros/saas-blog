namespace Web.DTOs;

public class BlogModel
{
	public int Id { get; set; }
	public string Title { get; set; }
	public string Description { get; set; }
	public string? ImageUrl { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }

	public int UserId { get; set; }
	public string UserName { get; set; }

	public int CategoryId { get; set; }
	public string CategoryName { get; set; }
}
