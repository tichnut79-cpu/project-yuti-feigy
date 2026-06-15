using Microsoft.EntityFrameworkCore;
using ApiPharm.Models;
using System.Linq.Expressions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<GeoService>();
// קריאה מ־ENV
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

var connectionString = $"Server=sqlserver;" +
                       $"Database={dbName};" +
                       $"User Id={dbUser};" +
                       $"Password={dbPassword};" +
                       $"MultipleActiveResultSets=true;"+
                       $"TrustServerCertificate=true;";

builder.Services.AddDbContext<MedicineDBcontext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost",
                "http://localhost:80",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using(var scope=app.Services.CreateAsyncScope())
{
    var DbContext=scope.ServiceProvider.GetRequiredService<MedicineDBcontext>();
    DbContext.Database.Migrate();
}

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = string.Empty; // <- ההבדל המרכזי
});

app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();

app.Run();