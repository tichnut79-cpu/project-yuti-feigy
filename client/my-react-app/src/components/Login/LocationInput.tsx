import { useRef,useState } from "react";

export default function LocationInput() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const [results, setResults] = useState([]);
const [timer, setTimer] = useState(null);
  const [streetResults, setStreetResults] = useState([]);
  const timerRef = useRef(null);
  // debounce פשוט

  const searchCities = async (value) => {
  setCity(value);
    if (!value || value.trim().length === 0) {
    setResults([]);
    return;
  }
  if (timerRef.current) clearTimeout(timerRef.current);

  timerRef.current=setTimeout(async()=>{
    const res = await fetch(
    `http://localhost:8080/api/geo/cities?q=${encodeURIComponent(value)}`
  );
  const data = await res.json();
setResults(data);
  },400);

};

  const searchStreets = async (value: string) => {
  setStreet(value);

  if (!value || !city) return;

  const cleanCity = city.split(",")[0];

  const res = await fetch(
    `http://localhost:8080/api/geo/streets?q=${value}&city=${encodeURIComponent(cleanCity)}`
  );

  const data = await res.json();
  setStreetResults(data);
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
                setCity(item.display ?? "");
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