
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
        _http.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GeoApp/1.0");
    }

    private static string Normalize(string s)
{
    if (string.IsNullOrWhiteSpace(s))
        return "";

    s = s.ToLower();

    // ניקוי בסיסי
    s = s
        .Replace("'", "")
        .Replace("׳", "")
        .Replace("\"", "")
        .Replace("-", "")
        .Replace(" ", "")
        .Trim();

    return s;
}
private static string Key(string s)
{
    if (string.IsNullOrWhiteSpace(s))
        return "";

    s = s.ToLower();

    return s
        .Replace("'", "")
        .Replace("׳", "")
        .Replace("\"", "")
        .Replace("-", "")
        .Replace(" ", "")
        .Trim();
}
    private static string NormalizeMulti(string s)
{
    var n = Normalize(s);

    // אם זה עברית – להשאיר
    // אם זה אנגלית – להשאיר גם

    return n;
}
    public async Task<IActionResult> GetCities(string q)
{
    SetHeaders();
    if (string.IsNullOrWhiteSpace(q))
        return new OkObjectResult(Array.Empty<object>());

    var query = q.Trim();
    var normalizedQuery = Normalize(query);
    var queryKey = Key(query);
    var url =
    $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(query)}&countrycodes=il&limit=5&addressdetails=1&dedupe=1&accept-language=he";

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
.Select(x => new
{
    display = x.GetProperty("display_name").GetString(),
    key = Key(x.GetProperty("display_name").GetString())
})
.Select(x => new
{
    x.display,
    score = x.key.Contains(queryKey) || queryKey.Contains(x.key)
        ? -10
        : Levenshtein(queryKey, x.key)
})
.OrderBy(x => x.score)
.Take(5)
.ToList();
    return new OkObjectResult(result);
}
public async Task<IActionResult> GetStreets(string q, string city)
{
    SetHeaders();

    if (string.IsNullOrWhiteSpace(q) || string.IsNullOrWhiteSpace(city))
        return new OkObjectResult(Array.Empty<object>());

    var query = $"{q},{city}";

var url =
$"https://nominatim.openstreetmap.org/search?format=json" +
$"&street={Uri.EscapeDataString(q)}" +
$"&city={Uri.EscapeDataString(city)}" +
$"&countrycodes=il" +
$"&addressdetails=1" +
$"&limit=10";

    JsonElement[] raw;

    try
    {
        raw = await _http.GetFromJsonAsync<JsonElement[]>(url);
    }
    catch
    {
        return new OkObjectResult(Array.Empty<object>());
    }
    Console.WriteLine(raw?.Length);
    Console.WriteLine(JsonSerializer.Serialize(raw));
    if (raw == null || raw.Length == 0)
        return new OkObjectResult(Array.Empty<object>());

    var result = raw
        .Where(x =>
            x.TryGetProperty("display_name", out var d) &&
            !string.IsNullOrWhiteSpace(d.GetString())
        )
        .Select(x => new
        {
            display = x.GetProperty("display_name").GetString(),
            name = (x.GetProperty("display_name").GetString() ?? "").Split(',')[0],
            type = x.TryGetProperty("type", out var t) ? t.GetString() : "",
            cls = x.TryGetProperty("class", out var c) ? c.GetString() : ""
        })
        .Where(x =>
            // x.cls == "place" ||
            x.cls == "highway"   // רחובות מגיעים כ-highway
        )
        .Select(x => new
        {
            display = x.display,
            name = x.name
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