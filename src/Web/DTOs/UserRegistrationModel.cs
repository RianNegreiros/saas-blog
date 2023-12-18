using System.ComponentModel.DataAnnotations;

namespace Web.DTOs;

public class UserRegistrationModel
{
	[Required]
	public string Name { get; set; }
	[Required]
	[EmailAddress]
	public string Email { get; set; }
	[Required]
	public string Password { get; set; }
}
