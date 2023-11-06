using DesignPatterns.Data; // Adjust the namespace to where your MongoDbContext is
using DesignPatterns.Repositories; // Adjust the namespace to where your ItemRepository is
using DesignPatterns.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
// Add services to the container.
builder.Services.AddControllers();
var mongoConnectionString = builder.Configuration["ConnectionStrings:MongoDB"] ?? "your-default-connection-string";
var mongoDatabaseName = builder.Configuration["MongoDB:DatabaseName"];
var mongoClient = new MongoClient(mongoConnectionString);


// Check for null or empty database name
if (string.IsNullOrEmpty(mongoDatabaseName))
{
    throw new InvalidOperationException("Database name is not configured.");
}

// Register the MongoDbContext with the necessary constructor parameters
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoConnectionString));


// Register the ItemRepository as a scoped service
builder.Services.AddScoped<ItemRepository>(serviceProvider =>
{
    var mongoClient = serviceProvider.GetRequiredService<IMongoClient>();
    return new ItemRepository(mongoClient, mongoDatabaseName);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", 
    builder => builder.WithOrigins("http://192.168.50.242:3001") // The exact URL of your frontend
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials());
  
});



var app = builder.Build();
app.UseCors("CorsPolicy");

var hubContext = app.Services.GetRequiredService<IHubContext<PrinterHub>>();
PrinterQueueService.Instance.SetHubContext(hubContext);

app.MapHub<PrinterHub>("/printerhub");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
