using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Blog : BaseEntity
{
	public string Title { get; private set; }
	public string Description { get; private set; }
	public string? ImageUrl { get; private set; }
	public int UserId { get; private set; }
	public User User { get; private set; }
	public DateTime CreatedAt { get; private set; }
	public DateTime UpdatedAt { get; private set; }
	public int CategoryId { get; private set; }
	public Category Category { get; private set; }
}
