# Session 1: Setting Up the Project Framework

## Goal
Create the foundational structure of the web application with a C# backend and establish the basic routing and MongoDB connection.

## Pseudocode
```csharp
// Initialize the MVC project structure in Startup.cs
public class Startup {
    public void ConfigureServices(IServiceCollection services) {
        services.AddControllersWithViews(); // Add MVC services to the project
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
        // ... existing code ...

        // Set up routing
        app.UseRouting();

        app.UseEndpoints(endpoints => {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}

// MongoDB Singleton for the database connection in MongoDbConnection.cs
public class MongoDbConnection {
    private static MongoDbConnection _instance;
    private MongoClient _client;
    private IMongoDatabase _database;
    
    private MongoDbConnection() {
        // Establish connection to MongoDB
        _client = new MongoClient("your_mongodb_connection_string");
        _database = _client.GetDatabase("your_database_name");
    }

    public static MongoDbConnection Instance {
        get {
            if (_instance == null) {
                _instance = new MongoDbConnection();
            }
            return _instance;
        }
    }

    public IMongoDatabase Database => _database;
}
```
## Tasks
Initialize a new MVC project in your preferred IDE.
Configure the services and routing in Startup.cs.
Implement the Singleton pattern for MongoDB connection in MongoDbConnection.cs.
Create placeholder views for each of the 8 design patterns.
## Hosting Solution
Begin development on localhost.
For deployment, consider GitHub Pages for static frontend hosting.
For the backend, look into Heroku or Azure App Service's free tiers.
MongoDB Atlas offers a free tier for database hosting.
## Expected Outcome
Running application skeleton with MVC configured.
Accessible routes for future design pattern implementations.
Singleton connection to MongoDB established.
## Time Allocation
MVC project setup: 1 hour.
Routing configuration: 1 hour.
Singleton MongoDB connection: 1 hour.
Placeholder views setup: 1 hour.
