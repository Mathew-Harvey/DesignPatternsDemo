using DesignPatterns.Data;
using DesignPatterns.Repositories;
using DesignPatterns.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Configure MongoDB
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB") ?? "your-default-connection-string";
var mongoDatabaseName = builder.Configuration["MongoDB:DatabaseName"] ?? "your-default-database-name";

if (string.IsNullOrWhiteSpace(mongoDatabaseName))
{
    throw new InvalidOperationException("Database name is not configured.");
}

// Register the MongoClient as a singleton
builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoConnectionString));

// Register the ItemRepository as a scoped service
builder.Services.AddScoped<ItemRepository>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    return new ItemRepository(mongoClient, mongoDatabaseName);
});

// Register the PrinterQueueService and OpenAIService as singletons
builder.Services.AddSingleton<PrinterQueueService>(sp =>
{
    var hubContext = sp.GetRequiredService<IHubContext<PrinterHub>>();
    var openAIService = sp.GetRequiredService<OpenAIService>();
    return new PrinterQueueService(hubContext, openAIService);
});
builder.Services.AddHttpClient<OpenAIService>(); 
builder.Services.AddSingleton<OpenAIService>(sp =>
{
    var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
    var apiKey = builder.Configuration["OpenAI:ApiKey"]; // Ensure this is secured in production
    return new OpenAIService(httpClient, apiKey);
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policyBuilder => policyBuilder.WithOrigins("http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Use CORS policy
app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error"); // Ensure there is a corresponding Error action
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapHub<PrinterHub>("/printerHub"); // Ensure PrinterHub is correctly implemented
app.MapControllers();

app.Run();
