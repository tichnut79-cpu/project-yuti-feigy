using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class GeoLocationService
{
    private readonly HttpClient _client;
    private readonly string _apiKey;

    public GeoLocationService(HttpClient client, string apiKey)
    {
        _client = client;
        _apiKey = apiKey;
    }

    public async Task<(double Lat, double Lng)> GetLocationAsync()
    {
        string url = $"https://www.googleapis.com/geolocation/v1/geolocate?key={_apiKey}";

        var payload = new { considerIp = true };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync(url, content);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(responseBody);
        var location = doc.RootElement.GetProperty("location");

        return (
            location.GetProperty("lat").GetDouble(),
            location.GetProperty("lng").GetDouble()
        );
    }
}