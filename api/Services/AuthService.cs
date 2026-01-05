using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api.Database;
using api.Models;
using DotNetEnv;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace api.Services;

public class AuthService(
        DbContext dbContext,
        IOptions<DbSettings> dbSettings,
        IConfiguration configuration
) 
{
    private readonly IMongoCollection<User> _usersCollection = dbContext.MongoDatabase
        .GetCollection<User>(dbSettings.Value.UsersCollectionName);

    public string CreateToken(User user)
    {
        Env.Load();

        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name, user.Username),
        };

        foreach (string role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

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

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<string> GenerateAndStoreRefreshTokenAsync(User user)
    {
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        var refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.RefreshTokenExpiryTime = refreshTokenExpiryTime;
        var filter = Builders<User>.Filter.Eq(u => u.Username, user.Username);
        var update = Builders<User>.Update.Combine(
            Builders<User>.Update.Set("RefreshToken", refreshToken),
            Builders<User>.Update.Set("RefreshTokenExpiryTime", refreshTokenExpiryTime)
        );
        await _usersCollection.UpdateOneAsync(filter, update);
        return refreshToken;
    }

    public async Task<User?> ValidateRefreshToken(string username, string refreshToken)
    {
        var user = await _usersCollection.Find(user => user.Username == username).FirstOrDefaultAsync();

        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null;
        }

        return user;
    }

    public async Task<LoginResponse?> RefreshTokensAsync(RefreshTokenRequest request)
    {
        var user = await ValidateRefreshToken(request.Username, request.RefreshToken);

        if (user == null)
        {
            return null;
        }

        var token = CreateToken(user);
        var refreshToken = await GenerateAndStoreRefreshTokenAsync(user);

        return new LoginResponse(token, refreshToken, user.Roles);
    }
}