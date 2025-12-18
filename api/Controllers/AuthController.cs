using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
// Using primary constructor to inject configuration from appsettings.json.
public class AuthController(IConfiguration configuration): ControllerBase
{
    public static User user = new ();

    [HttpPost("register")]
    public ActionResult<User> Register(UserDto request)
    {
        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);

        user.Username = request.Username;
        user.PasswordHash = hashedPassword;

        return Ok(user);
    }

    [HttpPost("login")]
    public ActionResult<string> Login(UserDto request)
    {
        if (user.Username != request.Username)
        {
            return BadRequest("Error: user not found.");
        }
        
        if (new PasswordHasher<User>()
                .VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    request.Password
                )
                == PasswordVerificationResult.Failed)
        {
            return BadRequest("Error: wrong password.");
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