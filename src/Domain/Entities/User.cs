namespace Domain.Entities;

public class User : BaseEntity
{
  public string Name { get; private set; }
  public string Email { get; private set; }
  public string? Password { get; private set; }
  public string? ProfileUrl { get; private set; }
}
