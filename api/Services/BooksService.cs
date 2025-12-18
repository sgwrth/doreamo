using api.Database;
using api.Models;
using DotNetEnv;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api.Services;

public class BooksService
{
    private readonly IMongoCollection<Book> _booksCollection;

    public BooksService(
        IOptions<DbSettings> dbSettings,
        DbContext dbContext
    )
    {
        _booksCollection = dbContext.MongoDatabase.GetCollection<Book>(
            dbSettings.Value.BooksCollectionName
        );
    }

    public async Task<List<Book>> GetAsync() =>
        await _booksCollection.Find(_ => true).ToListAsync();

    public async Task PostAsync(Book book) =>
        await _booksCollection.InsertOneAsync(book);
}