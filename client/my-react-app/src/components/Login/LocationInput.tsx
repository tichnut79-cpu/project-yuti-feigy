const API = import.meta.env.VITE_API_URL;

import { useRef,useState } from "react";

export default function LocationInput() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(null);
  const [streetResults, setStreetResults] = useState([]);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

const searchCities = (value) => {
  setCity(value);

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
  if (abortRef.current) {
    abortRef.current.abort();
  }

  const controller = new AbortController();
  abortRef.current = controller;

  debounceRef.current=setTimeout(async () => {
    if (value.trim().length<2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/geo/cities?q=${value}`,
        { signal: controller.signal }
      );

      const data = await res.json();
      setResults(data.value);
    } catch (err) {
      if (err.name === "AbortError") {
        return; // ← זה התקין
      }
      console.error(err);
    }
  }, 400);
};



  const searchStreets = async (value: string) => {
  setStreet(value);

  if (!value || !city) return;

  const cleanCity = city;

  const res = await fetch(
  `${API}/api/geo/streets?q=${value}&city=${encodeURIComponent(city)}`
);
  const data = await res.json();
  setStreetResults(data.value);
};

  return (
  <div className="location-wrapper">

    {/* עיר */}
    <div className="autocomplete-wrapper">
      <h3>City</h3>

      <input
        value={city}
        onChange={(e) => searchCities(e.target.value)}
        placeholder="Enter city"
      />

      {results.length > 0 && (
        <div className="dropdown">
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setCity(item.display?.split(",")[0] ?? "");
                setResults([]);
}}
            >
              {item.display}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* רחוב */}
    <div className="autocomplete-wrapper">
      <h3>Street</h3>

      <input
        value={street}
        onChange={(e) => searchStreets(e.target.value)}
        placeholder="Enter street"
      />

      {streetResults.length > 0 && (
        <div className="dropdown">
          {streetResults.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setStreet(item.name);
                setStreetResults([]);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
);
}