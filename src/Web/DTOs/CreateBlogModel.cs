namespace Web.DTOs;

public class CreateBlogModel
{
	public string Title { get; set; }
	public string Description { get; set; }
	public int UserID { get; set; }
	public int CategoryID { get; set; }
	public string? ImageUrl { get; set; }
}
