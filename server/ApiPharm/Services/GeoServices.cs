
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

    private static string Normalize(string s)
{
    return (s ?? "")
        .ToLower()
        .Replace("'", "")
        .Replace("׳", "")
        .Replace("\"", "")
        .Replace("-", "")
        .Replace(" ", "")
        .Trim();
}

    public async Task<IActionResult> GetCities(string q)
{
    SetHeaders();
    if (string.IsNullOrWhiteSpace(q))
        return new OkObjectResult(Array.Empty<object>());

    var query = q.Trim();

    var url =
        $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(query)}&countrycodes=il&limit=20&addressdetails=1";

    JsonElement[] raw;

    try
    {
        raw = await _http.GetFromJsonAsync<JsonElement[]>(url);
    }
    catch
    {
        return new OkObjectResult(Array.Empty<object>());
    }

    if (raw == null || raw.Length == 0)
        return new OkObjectResult(Array.Empty<object>());

    var result = raw
    .Where(x =>
        x.TryGetProperty("class", out var c) &&
        c.GetString() == "place" &&
        x.TryGetProperty("type", out var t) &&
        new[] { "city", "town", "village", "hamlet" }
            .Contains(t.GetString())
    )
    .Select(x => new
    {
        display = x.GetProperty("display_name").GetString()
    })
    .GroupBy(x =>
    {
        var name = x.display ?? "";
        return Normalize(name.Split(',')[0]); // 👈 רק שם העיר!
    })
    .Select(g => new
    {
        display = g.First().display
    })
    .ToList();
    return new OkObjectResult(result);
}

    private static int Levenshtein(string a, string b)
    {
        if (string.IsNullOrEmpty(a)) return b.Length;
        if (string.IsNullOrEmpty(b)) return a.Length;

        var dp = new int[a.Length + 1, b.Length + 1];

        for (int i = 0; i <= a.Length; i++)
            for (int j = 0; j <= b.Length; j++)
            {
                if (i == 0) dp[i, j] = j;
                else if (j == 0) dp[i, j] = i;
                else
                {
                    int cost = a[i - 1] == b[j - 1] ? 0 : 1;

                    dp[i, j] = Math.Min(
                        Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1),
                        dp[i - 1, j - 1] + cost
                    );
                }
            }

        return dp[a.Length, b.Length];
    }
}