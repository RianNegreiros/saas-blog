using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.DTOs;

[Route("api/[controller]")]
public class AccountController : ControllerBase
{
  private readonly ApplicationDbContext _dbContext;

  public AccountController(ApplicationDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  [HttpGet("login/{provider}")]
  public IActionResult Login(string provider)
  {
    return Challenge(new AuthenticationProperties { RedirectUri = "/" }, provider);
  }

  [HttpPost("logout")]
  public IActionResult Logout()
  {
    return SignOut(new AuthenticationProperties { RedirectUri = "/" },
        CookieAuthenticationDefaults.AuthenticationScheme);
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
  {
    try
    {
      if (await _dbContext.Users.AnyAsync(u => u.Email == model.Email))
      {
        return BadRequest("Email is already registered.");
      }

      string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

      var newUser = new User
      {
        Name = model.Name,
        Email = model.Email,
        Password = hashedPassword,
      };

      _dbContext.Users.Add(newUser);
      await _dbContext.SaveChangesAsync();

      return Ok("Registration successul");
    }
    catch (Exception ex)
    {
      return StatusCode(50, "Anerror occurred while processing your request.");
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] UserLoginModel model)
  {
    try
    {
      var user = await _dbContext.Users.SingleOrDefaultAsync(U => U.Email == model.Email);

      if (user == null)
      {
        return NotFound("User not found.");
      }

      if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
      {
        return Unauthorized("Invalid password.");
      }

      return Ok("Login successful.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, "An error occurred while processing your request.");
    }
  }
}
