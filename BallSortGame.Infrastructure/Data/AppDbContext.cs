using BallSortGame.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BallSortGame.Infrastructure.Data
{
    /// <summary>
    /// Entity Framework Core DbContext for Ball Sort Game
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<Score> Scores { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Coins).HasDefaultValue(0);
                entity.Property(u => u.CurrentLevel).HasDefaultValue(1);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Level configuration
            modelBuilder.Entity<Level>(entity =>
            {
                entity.Property(l => l.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Score configuration
            modelBuilder.Entity<Score>(entity =>
            {
                entity.Property(s => s.CoinsEarned).HasDefaultValue(0);
                entity.Property(s => s.CompletedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(s => s.User)
                    .WithMany(u => u.Scores)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Level)
                    .WithMany(l => l.Scores)
                    .HasForeignKey(s => s.LevelId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // UserAchievement composite key
            modelBuilder.Entity<UserAchievement>(entity =>
            {
                entity.HasKey(ua => new { ua.UserId, ua.AchievementId });
                entity.Property(ua => ua.UnlockedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(ua => ua.User)
                    .WithMany(u => u.UserAchievements)
                    .HasForeignKey(ua => ua.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ua => ua.Achievement)
                    .WithMany(a => a.UserAchievements)
                    .HasForeignKey(ua => ua.AchievementId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed initial levels
            SeedLevels(modelBuilder);
            SeedAchievements(modelBuilder);
        }

        private void SeedLevels(ModelBuilder modelBuilder)
        {
            var levels = new List<Level>();
            for (int i = 1; i <= 500; i++)
            {
                int difficulty = i <= 50 ? 1 : (i <= 150 ? 2 : (i <= 350 ? 3 : 4));
                int tubes = difficulty == 1 ? 4 : (difficulty == 2 ? 5 : (difficulty == 3 ? 7 : 10));
                int colors = difficulty == 1 ? 2 : (difficulty == 2 ? 3 : (difficulty == 3 ? 5 : 8));
                
                // For seeded levels, we provide a simple valid-looking string
                // The frontend generates its own board anyway, but this satisfies the DB requirements
                levels.Add(new Level 
                { 
                    Id = i, 
                    Difficulty = difficulty, 
                    TubeCount = tubes, 
                    ColorCount = colors, 
                    Data = "[]" 
                });
            }
            modelBuilder.Entity<Level>().HasData(levels);
        }

        private void SeedAchievements(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Achievement>().HasData(
                new Achievement { Id = 1, Name = "First Sort", Description = "Complete your first level", Criteria = "{\"type\":\"levels_completed\",\"value\":1}" },
                new Achievement { Id = 2, Name = "Sorting Pro", Description = "Complete 10 levels", Criteria = "{\"type\":\"levels_completed\",\"value\":10}" },
                new Achievement { Id = 3, Name = "Speed Demon", Description = "Complete a level in under 30 seconds", Criteria = "{\"type\":\"time_under\",\"value\":30}" },
                new Achievement { Id = 4, Name = "Minimalist", Description = "Complete a level in minimum moves", Criteria = "{\"type\":\"min_moves\",\"value\":1}" },
                new Achievement { Id = 5, Name = "Rich Player", Description = "Earn 100 coins", Criteria = "{\"type\":\"coins_earned\",\"value\":100}" },
                new Achievement { Id = 6, Name = "Master Sorter", Description = "Complete all easy levels", Criteria = "{\"type\":\"difficulty_completed\",\"value\":1}" },
                new Achievement { Id = 7, Name = "Expert Sorter", Description = "Complete a hard level", Criteria = "{\"type\":\"difficulty_completed\",\"value\":3}" }
            );
        }
    }
}
