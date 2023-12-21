using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Blog : BaseEntity
{
	public string Title { get; set; }
	public string Description { get; set; }
	public string? ImageUrl { get; set; }
	public int UserId { get; set; }

	[ForeignKey("UserId")]
	public virtual User User { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }
	public int CategoryId { get; set; }

	[ForeignKey("CategoryId")]
	public virtual Category Category { get; set; }
}
