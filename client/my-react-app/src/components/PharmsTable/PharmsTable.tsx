import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import "./PharmsTable.css";

type Pharmacy = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type RowData = Pharmacy & {
  distanceKm: number;
  walkMinutes: number;
  queueLength: number;
  selected: boolean;
};

type Props = {
  city: string;
  userLat: number;
  userLng: number;
};

export default function PharmaciesTable({ city, userLat, userLng }: Props) {
  const [data, setData] = useState<RowData[]>([]);
  const [travelMode, setTravelMode] = useState<"WALK" | "CAR">("WALK");
  const selectedMedicines = useSelector(
  (state: RootState) => state.selectedMedicines.items
);
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/pharmacies");
      const pharmacies: Pharmacy[] = await res.json();

      const enriched: RowData[] = pharmacies.map((p) => {
        const distanceKm = calcDistance(userLat, userLng, p.lat, p.lng);
        const walkMinutes = Math.round(distanceKm * 12); // הערכה: 5 קמ"ש
        const queueLength = Math.floor(Math.random() * 20);

        return {
          ...p,
          distanceKm,
          walkMinutes,
          queueLength,
          selected: false,
        };
      });

      setData(enriched);
    }

    load();
  }, [userLat, userLng]);

  function toggleSelect(id: number) {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  }

  function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  function openMap() {
    const selected = data.filter((d) => d.selected);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${selected[0]?.lat},${selected[0]?.lng}`;
    window.open(url, "_blank");
  }

  return (
    <div className="container">
       <div>
  <h3>תרופות שנבחרו</h3>

  <div className="pharms-selected-list">
    {selectedMedicines.map((m) => (
      <div key={m} className="pharms-selected-item">
        {m}
      </div>
    ))}
  </div>
</div>
<br></br>
<br></br>
<br></br>
      <h2 className="title">
        Pharmacies near you in the city of {city}
      </h2>


      <table className="table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Address</th>
            <th>Distance (km)</th>
            <th>Queue Length</th>
            <th>Walk Minutes</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={row.selected}
                  onChange={() => toggleSelect(row.id)}
                />
              </td>
              <td>{row.name}</td>
              <td>{row.address}</td>
              <td>{row.distanceKm}</td>
              <td>{row.queueLength}</td>
              <td>
                {travelMode === "WALK"
                  ? row.walkMinutes
                  : Math.round(row.walkMinutes / 3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       <div>

  
  </div>
      <div className="modeBar">
        <div className="topButtons">
        <button
          className={travelMode === "WALK" ? "active" : ""}
          onClick={() => setTravelMode("WALK")}
        >
          Walk
        </button>

        <button
          className={travelMode === "CAR" ? "active" : ""}
          onClick={() => setTravelMode("CAR")}
        >
          Travel
        </button>
          </div>
        <button className="mapBtn" onClick={openMap}>
          To Map
        </button>
      </div>
    </div>
  );
}