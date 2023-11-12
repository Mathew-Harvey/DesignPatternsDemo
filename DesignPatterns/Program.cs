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

// Register the PrinterQueueService as a singleton
builder.Services.AddSingleton<PrinterQueueService>();

// Register the OpenAI
builder.Services.AddHttpClient<OpenAIService>(); 
builder.Services.AddSingleton(sp =>
{
    var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
    var apiKey = builder.Configuration["OpenAI:ApiKey"]; // Ensure you have this in your appsettings.json
    return new OpenAIService(httpClient, apiKey);
});
builder.Services.AddSingleton<PrinterQueueService>(sp =>
{
    var hubContext = sp.GetRequiredService<IHubContext<PrinterHub>>();
    var openAIService = sp.GetRequiredService<OpenAIService>();
    return new PrinterQueueService(hubContext, openAIService);
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policyBuilder => policyBuilder.WithOrigins("http://127.0.0.1:5500") // Replace with your actual front-end URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Use CORS policy
app.UseCors("CorsPolicy");

// Other middleware
app.UseRouting();
app.MapHub<PrinterHub>("/printerHub");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
