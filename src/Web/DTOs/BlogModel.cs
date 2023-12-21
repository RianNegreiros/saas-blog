namespace Web.DTOs;

public class BlogModel
{
	public int Id { get; set; }
	public string Title { get; set; }
	public string Description { get; set; }
	public int UserId { get; set; }
	public int CategoryId { get; set; }
	public string? ImageUrl { get; set; }
}
