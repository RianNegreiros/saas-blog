using System.ComponentModel.DataAnnotations;

namespace Web.DTOs;

public class CreateCategoryModel
{
	[Required]
	public string Name { get; set; }
}
