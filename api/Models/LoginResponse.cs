namespace api.Models;

public record LoginResponse(
    string Token,
    string RefreshToken,
    string[] Roles
) {}