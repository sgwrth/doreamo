using System.Text;
using api.Database;
using api.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

Env.Load();

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(System.Environment.GetEnvironmentVariable("UI_DEV_SERVER")!)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Database settings
builder.Services.Configure<DbSettings>(
    builder.Configuration.GetSection("BookStoreDatabase"));

// Singletons
builder.Services.AddSingleton<BooksService>();
builder.Services.AddSingleton<DbContext>();
builder.Services.AddSingleton<AuthService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi("v1"); // Intentionally explicit, 'v1' is already default.

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(System.Environment.GetEnvironmentVariable("JWT_KEY")!)
            ),
            ValidateIssuerSigningKey = true,
        };
    }
    );

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Add Scalar.
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

app.Run();
