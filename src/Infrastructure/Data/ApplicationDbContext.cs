using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
	public DbSet<Blog> Blogs { get; set; }
	public DbSet<Category> Categories { get; set; }
	public DbSet<User> Users { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<User>()
			.HasMany(u => u.Blogs)
			.WithOne(b => b.User)
			.HasForeignKey(b => b.UserId)
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<Category>()
			.HasMany(c => c.Blogs)
			.WithOne(b => b.Category)
			.HasForeignKey(b => b.CategoryId)
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<Blog>()
			.HasOne(b => b.User)
			.WithMany(u => u.Blogs)
			.HasForeignKey(b => b.UserId)
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<Blog>()
			.HasOne(b => b.Category)
			.WithMany(c => c.Blogs)
			.HasForeignKey(b => b.CategoryId)
			.OnDelete(DeleteBehavior.Cascade);
	}
}
