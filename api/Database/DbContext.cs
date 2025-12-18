using api.Models;
using DotNetEnv;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api.Database;

public class DbContext
{
    public readonly IMongoDatabase MongoDatabase;

    public DbContext(IOptions<DbSettings> dbSettings)
    {
        Env.Load();

        var mongoClient = new MongoClient(
            System.Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING")
        );

        MongoDatabase = mongoClient.GetDatabase(
            dbSettings.Value.DatabaseName
        );
    }
}