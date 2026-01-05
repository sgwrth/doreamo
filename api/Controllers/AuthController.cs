using api.Database;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    DbContext dbContext,
    IOptions<DbSettings> dbSettings,
    AuthService authService
): ControllerBase
{
    private readonly IMongoCollection<User> _usersCollection = dbContext.MongoDatabase
        .GetCollection<User>(dbSettings.Value.UsersCollectionName);

    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync(UserDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Username)
            || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Missing registration data.");
        }

        if (await _usersCollection.Find(
            user => user.Username == request.Username
        ).AnyAsync())
        {
            return BadRequest("Registration failed.");
        }

        var newUser = new User();

        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(newUser, request.Password);

        newUser.Username = request.Username;
        newUser.PasswordHash = hashedPassword;
        newUser.Roles = [Role.User];

        await _usersCollection.InsertOneAsync(newUser);

        return Ok("Registration successful.");
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> LoginAsync(UserDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Username)
                || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Missing login data.");
        }

        var user = await _usersCollection.Find(
            user => user.Username == request.Username
        ).FirstOrDefaultAsync();

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

        var token = authService.CreateToken(user);
        var refreshToken = await authService.GenerateAndStoreRefreshTokenAsync(user);

        return Ok(new LoginResponse(token, refreshToken, user.Roles));
    }

    [HttpPost("refreshtokens")]
    public async Task<ActionResult<LoginResponse>> RefreshTokensAsync(RefreshTokenRequest request)
    {
        var result = await authService.RefreshTokensAsync(request);

        if (result is null || result.Token is null || result.RefreshToken is null)
        {
            return Unauthorized("Invalid refresh token");
        }

        return Ok(result);
    }
}