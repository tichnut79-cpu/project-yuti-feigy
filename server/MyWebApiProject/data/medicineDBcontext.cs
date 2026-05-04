using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

class medicineDBcontext:dbContext{
public DBSet<medicine> medicines {Get;Set;}
public DBSet<medicineInPharm> medicineInPharm {Get;Set;} 
}
