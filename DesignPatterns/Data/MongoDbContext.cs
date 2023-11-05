using MongoDB.Driver;
using DesignPatterns.Models; // Replace with the actual namespace where your models are
namespace DesignPatterns.Data
{

    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        // Access your MongoDB collections here
        public IMongoCollection<Item> Items => _database.GetCollection<Item>("Items");
    }
}