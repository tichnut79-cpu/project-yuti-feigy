using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;

[ApiController]
[Route("api/location")]
public class LocationController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly GeoLocationService _service;

    public LocationController(GeoLocationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetLocationAsync();
        return Ok(new { lat = result.Lat, lng = result.Lng });
    }
    [HttpGet("ip")]
    public async Task<IActionResult> GetLocationByIp()
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            ip = Request.Headers["X-Forwarded-For"].ToString().Split(',')[0];
        }

        Console.WriteLine($"USER IP: {ip}");

        var result = await GetLocationFromIp(ip);

        return Ok(result);
    }

    private async Task<object> GetLocationFromIp(string ip)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<IpWhoResponse>(
                $"https://ipwho.is/{ip}"
            );

            if (response == null || !response.success)
            {
                return new
                {
                    city = "Unknown City",
                    street = "Unknown Street"
                };
            }

            return new
            {
                city = response.city,
                street = response.region
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Geo error: {ex.Message}");

            return new
            {
                city = "Unknown City",
                street = "Unknown Street"
            };
        }
    }

    public class IpWhoResponse
    {
        public bool success { get; set; }
        public string city { get; set; }
        public string region { get; set; }
    }
}