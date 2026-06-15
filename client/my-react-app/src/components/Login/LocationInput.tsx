import { useState } from "react";

export default function LocationInput() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const [cityResults, setCityResults] = useState<any[]>([]);
  const [streetResults, setStreetResults] = useState<any[]>([]);

  const searchCities = async (q: string) => {
    setCity(q);
    if (!q) return;

    const res = await fetch(`http://localhost:8080/api/geo/cities?q=${q}`);
    const data = await res.json();
    setCityResults(data);
  };

  const searchStreets = async (q: string) => {
    setStreet(q);
    if (!q || !city) return;

    const res = await fetch(
      `http://localhost:8080/api/geo/streets?q=${q}&city=${city}`
    );
    const data = await res.json();
    setStreetResults(data);
  };

  return (
    <div className="location-wrapper">

      <label>Location</label>

      {/* עיר */}
      <div className="autocomplete-wrapper">

  <input
    value={city}
    placeholder="Enter city"
    onChange={(e) => searchCities(e.target.value)}
  />

  {cityResults.length > 0 && (
    <div className="dropdown">
      {cityResults.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            setCity(item.name ?? "");
            setCityResults([]);
          }}
          style={{ cursor: "pointer" }}
        >
          {(item.name ?? "").split(",")[0]}
        </div>
      ))}
    </div>
  )}

</div>

      {/* רחוב */}
      <div className="autocomplete-wrapper">

        <input
          value={street}
          placeholder="Enter street"
          onChange={(e) => searchStreets(e.target.value)}
        />

        {streetResults.length > 0 && (
          <div className="dropdown">
            {streetResults.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setStreet(item.display_name?.split(",")[0] ?? "");
                  setStreetResults([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {item.display_name?.split(",")[0]}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}