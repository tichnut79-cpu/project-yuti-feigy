using Microsoft.EntityFrameworkCore;
using ApiPharm.Models;

var builder = WebApplication.CreateBuilder(args);

// קריאה מ־ENV
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

var connectionString = $"Server=host.docker.internal,1434;" +
                       $"Database={dbName};" +
                       $"User Id={dbUser};" +
                       $"Password={dbPassword};" +
                       $"MultipleActiveResultSets=true;TrustServerCertificate=true;";

builder.Services.AddDbContext<MedicineDBcontext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();

app.Run();