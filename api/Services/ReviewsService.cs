using api.Database;
using api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api.Services;

public class ReviewsService
{
    private readonly IMongoCollection<Review> _reviewsCollection;

    public ReviewsService(
        IOptions<DbSettings> dbSettings,
        DbContext dbContext
    )
    {
        _reviewsCollection = dbContext.MongoDatabase.GetCollection<Review>(
            dbSettings.Value.ReviewsCollectionName
        );
    }

    public async Task PostReviewAsync(ReviewPostRequest request)
    {
        var review = new Review
        {
            BookId = request.BookId,
            Rating = request.Rating,
            Text = request.Text,
            Author = request.Author
        };
        await _reviewsCollection.InsertOneAsync(review);
    }

    public async Task<List<Review>> GetReviewAsync(string bookId) =>
        await _reviewsCollection.Find(x => x.BookId == bookId).ToListAsync();
    
    public async Task<Dictionary<string, int>> GetReviewNumbersAsync()
    {
        var reviews = await _reviewsCollection.Find(_ => true).ToListAsync();
        var dictionary = new Dictionary<string, int>();
        foreach (var review in reviews)
        {
            if (dictionary.TryGetValue(review.BookId, out var count))
            {
                dictionary[review.BookId] = count + 1;
            }
            else
            {
                dictionary[review.BookId] = 1;
            }
        }
        return dictionary;
    }
}