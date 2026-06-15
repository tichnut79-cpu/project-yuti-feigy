import './App.css'
import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [cityResults, setCityResults] = useState([]);

  const [street, setStreet] = useState("");
  const [streetResults, setStreetResults] = useState([]);

  // חיפוש עיר
  const searchCities = async (value) => {
    setCity(value);

    if (!value) return;

    const res = await fetch(`https://localhost:8080/api/geo/cities?q=${value}`);
    const data = await res.json();

    setCityResults(data);
  };

  // חיפוש רחוב
  const searchStreets = async (value) => {
    setStreet(value);

    if (!value || !city) return;

    const res = await fetch(
      `https://localhost:8080/api/geo/streets?q=${value}&city=${city}`
    );

    const data = await res.json();
    setStreetResults(data);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* עיר */}
      <h3>עיר</h3>
      <input
        value={city}
        onChange={(e) => searchCities(e.target.value)}
        placeholder="הקלד עיר"
      />

      {cityResults.map((c, i) => (
        <div key={i} onClick={() => {
          setCity(c.display_name);
          setCityResults([]);
        }}>
          {c.display_name}
        </div>
      ))}

      <hr />

      {/* רחוב */}
      <h3>רחוב</h3>
      <input
        value={street}
        onChange={(e) => searchStreets(e.target.value)}
        placeholder="הקלד רחוב"
      />

      {streetResults.map((s, i) => (
        <div key={i} onClick={() => {
          setStreet(s.display_name);
          setStreetResults([]);
        }}>
          {s.display_name}
        </div>
      ))}

    </div>
  );
}

export default App;

