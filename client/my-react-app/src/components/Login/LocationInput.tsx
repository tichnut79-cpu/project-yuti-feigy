
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import { setCity, setStreet } from "../../Slices/locationSlice";

const API = import.meta.env.VITE_API_URL;

export default function LocationInput() {
  const dispatch = useDispatch();

  const city = useSelector((state: RootState) => state.location.city);
  const street = useSelector((state: RootState) => state.location.street);

  const [cityInput, setCityInput] = useState(city);
  const [streetInput, setStreetInput] = useState(street);

  const [cityResults, setCityResults] = useState<any[]>([]);
  const [streetResults, setStreetResults] = useState<any[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  /* =========================
     CITY SEARCH (debounced)
     ========================= */
  const searchCities = (value: string) => {
    setCityInput(value);
    dispatch(setCity(value));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    debounceRef.current = window.setTimeout(async () => {
      if (value.trim().length < 2) {
        setCityResults([]);
        return;
      }

      try {
        const res = await fetch(
          `${API}/api/geo/cities?q=${value}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setCityResults(data.value || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    }, 350);
  };

  /* =========================
     STREET SEARCH
     ========================= */
  const searchStreets = async (value: string) => {
    setStreetInput(value);
    dispatch(setStreet(value));

    if (!value || !cityInput) return;

    try {
      const res = await fetch(
        `${API}/api/geo/streets?q=${value}&city=${encodeURIComponent(cityInput)}`
      );

      const data = await res.json();
      setStreetResults(data.value || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="location-wrapper">

      {/* ================= CITY ================= */}
      <div className="autocomplete-field">
        <label>City</label>

        <div className="input-shell">
          <input
            value={cityInput}
            onChange={(e) => searchCities(e.target.value)}
            placeholder="Enter city"
            autoComplete="off"
          />
        </div>

        {cityResults.length > 0 && (
          <div className="dropdown-modern">
            {cityResults.map((item, i) => {
              const label = item.display?.split(",")[0] ?? item.display;

              return (
                <div
                  key={i}
                  className="dropdown-item"
                  onClick={() => {
                    setCityInput(label);
                    dispatch(setCity(label));
                    setCityResults([]);
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= STREET ================= */}
      <div className="autocomplete-field">
        <label>Street</label>

        <div className="input-shell">
          <input
            value={streetInput}
            onChange={(e) => searchStreets(e.target.value)}
            placeholder="Enter street"
            autoComplete="off"
          />
        </div>

        {streetResults.length > 0 && (
          <div className="dropdown-modern">
            {streetResults.map((item, i) => (
              <div
                key={i}
                className="dropdown-item"
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
