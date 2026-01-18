using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewsService _reviewsService;

    public ReviewController(ReviewsService reviewsService)
    {
        _reviewsService = reviewsService;
    }

    [HttpPost]
    public async Task PostReview(ReviewPostRequest request) =>
        await _reviewsService.PostReviewAsync(request);

    // [Authorize]
    [HttpGet("{bookId}")]
    public async Task<List<Review>> GetReview(string bookId) =>
        await _reviewsService.GetReviewAsync(bookId);
}