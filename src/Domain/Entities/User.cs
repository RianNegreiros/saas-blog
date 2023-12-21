namespace Domain.Entities;

public class User : BaseEntity
{
	public string Name { get; set; }
	public string Email { get; set; }
	public string? Password { get; set; }
	public string? ProfileUrl { get; set; }
	public List<Blog> Blogs { get; set; }
}
