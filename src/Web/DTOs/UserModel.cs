namespace Web.DTOs;

public class UserModel
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string Email { get; set; }
	public string? ProfileUrl { get; set; }
	public ICollection<BlogModel> Blogs { get; set; } = new List<BlogModel>();
}
