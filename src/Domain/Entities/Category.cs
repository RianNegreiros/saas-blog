namespace Domain.Entities;

public class Category : BaseEntity
{
	public string Name { get; set; }
	public Blog[] Blogs { get; set; }
}
