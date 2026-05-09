using BallSortGame.Application.Services;
using BallSortGame.Core.Interfaces;
using BallSortGame.Infrastructure.Data;
using BallSortGame.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// DATABASE CONFIGURATION
// ============================================

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString("DefaultConnection")));
}

// ============================================
// DEPENDENCY INJECTION - REPOSITORIES
// ============================================

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILevelRepository, LevelRepository>();
builder.Services.AddScoped<IScoreRepository, ScoreRepository>();

// ============================================
// DEPENDENCY INJECTION - SERVICES
// ============================================

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<LevelService>();
builder.Services.AddScoped<ScoreService>();
builder.Services.AddScoped<UserService>();

// ============================================
// JWT AUTHENTICATION
// ============================================

var jwtKey = builder.Configuration["Jwt:Key"]
             ?? "BallSortGameSuperSecretKey2024!@#$%^&*()";

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
                ?? "BallSortGameAPI";

var jwtAudience = builder.Configuration["Jwt:Audience"]
                  ?? "BallSortGameClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ============================================
// CORS
// ============================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ============================================
// CONTROLLERS
// ============================================

builder.Services.AddControllers();

// ============================================
// SWAGGER
// ============================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Ball Sort Game API",
        Version = "v1",
        Description = "Backend API for Ball Sort Puzzle Game"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ============================================
// SWAGGER ENABLED FOR ALL ENVIRONMENTS
// ============================================

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ball Sort Game API v1");
});

// ============================================
// MIDDLEWARE
// ============================================

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

// ============================================
// ROUTES
// ============================================

app.MapControllers();

// Homepage route
app.MapGet("/", () =>
{
    return Results.Ok("BallSortGame API is running successfully!");
});

// ============================================
// DATABASE AUTO CREATE
// ============================================

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();
}

// ============================================
// PORT CONFIGURATION FOR RENDER
// ============================================

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

app.Urls.Add($"http://0.0.0.0:{port}");

// ============================================
// RUN APP
// ============================================

app.Run();