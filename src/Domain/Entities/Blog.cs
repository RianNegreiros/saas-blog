namespace Domain.Entities;

public class Blog : BaseEntity
{
	public string Title { get; set; }
	public string Description { get; set; }
	public string? ImageUrl { get; set; }
	public int UserId { get; set; }
	public virtual User User { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }
	public int CategoryId { get; set; }
	public virtual Category Category { get; set; }
}
