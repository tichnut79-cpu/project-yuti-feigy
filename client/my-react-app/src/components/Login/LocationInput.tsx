const API = import.meta.env.VITE_API_URL;
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import { useDispatch } from "react-redux";
import { setCity, setStreet } from "../../Slices/locationSlice"; // עדכן נתיב
import React, { useRef, useState } from "react";

export default function LocationInput() {
  const dispatch = useDispatch();

const [cityInput, setCityInput] = useState("");
const [streetInput, setStreetInput] = useState("");
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(null);
  const [streetResults, setStreetResults] = useState([]);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  const city = useSelector((state: RootState) => state.location.city);
  const street = useSelector((state: RootState) => state.location.street);

  const searchCities = (value:string) => {
  setCityInput(value);
  dispatch(setCity(value));

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
  setStreetInput(value);
  dispatch(setStreet(value));
if (!value || !cityInput) return;
  const cleanCity = encodeURIComponent(cityInput);

  const res = await fetch(
  `${API}/api/geo/streets?q=${value}&city=${encodeURIComponent(cityInput)}`
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
        value={cityInput}
        onChange={(e) => searchCities(e.target.value)}
        placeholder="Enter city"
      />
       {city.trim() === "" && (
        <div className="field-warning">יש למלא שדה זה</div>
          )}
      {results.length > 0 && (
        <div className="dropdown">
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                const selectedCity = item.display?.split(",")[0] ?? "";
                setCityInput(selectedCity);
                 dispatch(setCity(selectedCity));

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
        value={streetInput}
        onChange={(e) => searchStreets(e.target.value)}
        placeholder="Enter street"
      />
      {street.trim() === "" && (
      <div className="field-warning">יש למלא שדה זה</div>
        )}
      {streetResults.length > 0 && (
        <div className="dropdown">
          {streetResults.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setStreetInput(item.name);
                dispatch(setStreet(item.name));
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