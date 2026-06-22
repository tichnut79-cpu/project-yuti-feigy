import React, { useEffect, useState } from "react";
import { getPharmacies } from "./PharmApi";
import { usePharmacyStore } from "../../App/pharmacyStore";
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
};

type Props = {
    city: string;
    userLat: number;
    userLng: number;
};

export default function PharmaciesTable({ city, userLat, userLng }: Props) {
    const {
        pharmacies,
        setPharmacies,
        travelMode,
        setTravelMode,
        selectedId,
        setSelectedId,
    } = usePharmacyStore();

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `http://localhost:8080/api/pharm?city=${city}`
            );

            if (!res.ok) {
                console.error("Failed to fetch pharmacies:", res.status);
                return;
            }

            const data: Pharmacy[] = await res.json();
            const mapped = data.map((p) => ({
                ...p,
                queueLength: p.waiting_quantity ?? p.Waiting_quantity,
            }));
            setPharmacies(mapped);
        }

        if (city) load();
    }, [city]);

    // function toggleSelect(id: number) {
    //     setData((prev) =>
    //         prev.map((item) => ({
    //             ...item,
    //             selected: item.id === id ? !item.selected : false
    //         }))
    //     );
    // }

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
        const selected = pharmacies.find((p) => p.id === selectedId);

        if (!selected) {
            alert("Please select a pharmacy first");
            return;
        }

        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${selected.lat},${selected.lng}`;

        window.open(url, "_blank");
    }

    return (
        <div className="container">
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
                    {pharmacies && pharmacies.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedId === row.id}
                                    onChange={() => setSelectedId(row.id)}
                                //  setSelectedId(selectedId === row.id ? null : row.id)
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