using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Database;
using api.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IConfiguration configuration,
    DbContext dbContext,
    IOptions<DbSettings> dbSettings
): ControllerBase
{
    private readonly IMongoCollection<User> _usersCollection = dbContext.MongoDatabase
        .GetCollection<User>(dbSettings.Value.UsersCollectionName);

    [HttpPost("register")]
    public async Task RegisterAsync(UserDto request)
    {
        var user = new User();

        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);

        user.Username = request.Username;
        user.PasswordHash = hashedPassword;

        await _usersCollection.InsertOneAsync(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> LoginAsync(UserDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Missing login data.");
        }

        var user = await _usersCollection.Find(user => user.Username == request.Username).FirstOrDefaultAsync();

        if (user == null)
        {
            return Unauthorized("Username and/or password invalid.");
        }

        if (new PasswordHasher<User>()
                .VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    request.Password
                )
                == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Username and/or password invalid.");
        }

        var token = CreateToken(user);

        {
            return Ok(token);
        }
    }

    private string CreateToken(User user)
    {
        Env.Load();

        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name, user.Username)
        };

        // Signing key.
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(System.Environment.GetEnvironmentVariable("JWT_KEY")!)
        );

        // Signing credentials.
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        // Token descriptor.
        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetValue<string>("AppSettings:Issuer"),
            audience: configuration.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);        
    }
}