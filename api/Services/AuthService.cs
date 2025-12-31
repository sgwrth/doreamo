using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models;
using DotNetEnv;
using Microsoft.IdentityModel.Tokens;

namespace api.Services;

public class AuthService(IConfiguration configuration)
{
    public string CreateToken(User user)
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

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

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