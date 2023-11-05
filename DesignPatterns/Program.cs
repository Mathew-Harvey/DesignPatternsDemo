using DesignPatterns.Data; // Adjust the namespace to where your MongoDbContext is
using DesignPatterns.Repositories; // Adjust the namespace to where your ItemRepository is
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
var mongoConnectionString = builder.Configuration["ConnectionStrings:MongoDB"] ?? "your-default-connection-string";
// var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB");
var mongoDatabaseName = builder.Configuration["MongoDB:DatabaseName"];
var mongoClient = new MongoClient(mongoConnectionString);


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
    options.AddPolicy("AllowMyFrontend",
        builder => builder.WithOrigins("http://192.168.50.242:3001") // Replace with the actual port and domain of your frontend
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});


var app = builder.Build();

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

app.UseCors("AllowMyFrontend");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
