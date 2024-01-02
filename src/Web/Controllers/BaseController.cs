using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController(ApplicationDbContext dbContext, ILogger<BaseController> logger) : ControllerBase
{
	protected readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
	protected readonly ILogger<BaseController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
}
