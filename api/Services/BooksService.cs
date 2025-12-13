using api.Models;
using DotNetEnv;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using MongoDB.Driver;

namespace api.Services;

public class BooksService
{
    private readonly IMongoCollection<Book> _booksCollection;

    public BooksService(
        IOptions<BookStoreDatabaseSettings> bookStoreDatabaseSettings
    )
    {
        Env.Load();

        var mongoClient = new MongoClient(
            System.Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING")
        );

        var mongoDatabase = mongoClient.GetDatabase(
            bookStoreDatabaseSettings.Value.DatabaseName
        );

        _booksCollection = mongoDatabase.GetCollection<Book>(
            bookStoreDatabaseSettings.Value.BooksCollectionName
        );
    }

    public async Task<List<Book>> GetAsync() =>
        await _booksCollection.Find(_ => true).ToListAsync();

    public async Task PostAsync(Book book) =>
        await _booksCollection.InsertOneAsync(book);
}