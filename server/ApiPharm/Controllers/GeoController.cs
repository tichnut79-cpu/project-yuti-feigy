using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/geo")]
public class GeoController : ControllerBase
{
    private readonly GeoService _geo;

    public GeoController(GeoService geo)
    {
        _geo = geo;
    }

    [HttpGet("cities")]
    public async Task<IActionResult> Cities(string q)
    {
        return Ok(await _geo.GetCities(q));
    }

    [HttpGet("streets")]
    public async Task<IActionResult> Streets(string q, string city)
    {
        return Ok(await _geo.GetStreets(q, city));
    }

}