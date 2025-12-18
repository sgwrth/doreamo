using api.Database;
using api.Models;
using api.Services;
using DotNetEnv;
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
