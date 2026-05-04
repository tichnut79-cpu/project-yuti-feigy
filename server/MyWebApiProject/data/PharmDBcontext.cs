using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

class PharmDBcontext:dbContext{
public DBSet<Pharm> Pharms {Get;Set;}	 
}
