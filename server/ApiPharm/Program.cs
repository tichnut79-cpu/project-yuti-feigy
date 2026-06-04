using Microsoft.EntityFrameworkCore;
using ApiPharm.Models;

var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddDbContext<MedicineDBcontext>(options =>
//     options.UseSqlServer(connectionString));


builder.Services.AddDbContext<MedicineDBcontext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins("http://localhost")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

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