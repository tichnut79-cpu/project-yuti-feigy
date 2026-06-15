using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Json;
using System.Text.Json;

public class GeoService
{
    private readonly HttpClient _http;
    private readonly IMemoryCache _cache;

    public GeoService(IHttpClientFactory factory, IMemoryCache cache)
    {
        _http = factory.CreateClient();
        _cache = cache;
    }

    private void SetHeaders()
    {
        _http.DefaultRequestHeaders.UserAgent.Clear();
        _http.DefaultRequestHeaders.UserAgent.ParseAdd("my-csharp-app");
    }
public async Task<object?> GetCities(string q)
{
    try
    {
        if (string.IsNullOrWhiteSpace(q))
            return new object[0];

        var qNorm = q.Trim().ToLower();

        var key = $"city_{qNorm}";
        if (_cache.TryGetValue(key, out object cached))
            return cached;

        SetHeaders();

        qNorm = q.Trim().ToLower();

var url =
    $"https://nominatim.openstreetmap.org/search?format=json&q={q}&countrycodes=il&addressdetails=1&limit=10&accept-language=en";

var raw = await _http.GetFromJsonAsync<JsonElement[]>(url);

if (raw == null)
    return new object[0];

var result = raw
    .Select(x =>
    {
        var display = x.GetProperty("display_name").ToString();
        var name = display.Split(',')[0];

        return new
        {
            name,
            lat = x.GetProperty("lat").ToString(),
            lon = x.GetProperty("lon").ToString()
        };
    })
    .Where(x =>
    !string.IsNullOrWhiteSpace(x.name) &&
    x.name.ToLower().Contains(qNorm)
)
    .Take(10)
    .ToList();

        _cache.Set(key, result, TimeSpan.FromHours(24));

        return result;
    }
    catch
    {
        return new object[0];
    }
}

  public async Task<object?> GetStreets(string q, string city)
    {
        if (string.IsNullOrWhiteSpace(q) || string.IsNullOrWhiteSpace(city))
            return null;

        var key = $"street_{city}_{q}";
        if (_cache.TryGetValue(key, out object cached))
            return cached;

        SetHeaders();

        var url =
            $"https://nominatim.openstreetmap.org/search?format=json&q={q} {city}&countrycodes=il&limit=5";

        var result = await _http.GetFromJsonAsync<object[]>(url);

        _cache.Set(key, result, TimeSpan.FromHours(24));

        return result;
    }
}