namespace Domain.Entities;

public class Blog : BaseEntity
{
	public string Title { get; private set; }
	public string Description { get; private set; }
	public string? ImageUrl { get; private set; }
	public string UserId { get; private set; }
	public User user { get; private set; }
	public DateTime CreatedAt { get; private set; }
	public DateTime UpdatedAt { get; private set; }
	public Category category { get; private set; }
	public string CategoryId { get; private set; }
}
