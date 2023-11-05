using DesignPatterns.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DesignPatterns.Repositories
{
    public class ItemRepository
    {
        private readonly IMongoCollection<Item> _items;

        public ItemRepository(IMongoClient client, string databaseName)
        {
            var database = client.GetDatabase(databaseName);
            _items = database.GetCollection<Item>("Items");
        }

        // Read all items
        public async Task<List<Item>> GetAllAsync()
        {
            return await _items.Find(item => true).ToListAsync();
        }

        // Read an item by Id
        public async Task<Item> GetByIdAsync(string id)
        {
            return await _items.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }

        // Add a new item
        public async Task AddAsync(Item item)
        {
            await _items.InsertOneAsync(item);
        }

        // Update an item
        public async Task<bool> UpdateAsync(string id, Item item)
        {
            ReplaceOneResult updateResult =
                await _items.ReplaceOneAsync(
                    filter: g => g.Id == id,
                    replacement: item);
            return updateResult.IsAcknowledged
                   && updateResult.ModifiedCount > 0;
        }

        // Delete an item
        public async Task<bool> DeleteAsync(string id)
        {
            FilterDefinition<Item> filter = Builders<Item>.Filter.Eq(m => m.Id, id);
            DeleteResult deleteResult = await _items.DeleteOneAsync(filter);
            
            return deleteResult.IsAcknowledged
                   && deleteResult.DeletedCount > 0;
        }
    }
}
