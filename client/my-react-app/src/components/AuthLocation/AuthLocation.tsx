import "./AuthLocation.css"
import { useEffect, useState } from "react";

type GeoAddress = {
  city: string;
  street: string;
};

async function getAddressFromCoords(lat: number, lng: number): Promise<GeoAddress> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/geo/reverse?lat=${lat}&lng=${lng}`
  );

  const data = await res.json();

  return {
    city: data.city,
    street: data.street,
  };
}
export default function AuthLocationComponent() {
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("הדפדפן לא תומך במיקום");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            },
            (err) => {
                setError("לא ניתן לקבל מיקום");
            }
        );
    }, []);

    return (
        <div>
            <h2>מיקום נוכחי</h2>

            {error && <p>{error}</p>}

            {lat && lng ? (
                <p>
                    Latitude: {lat} <br />
                    Longitude: {lng}
                </p>
            ) : (
                !error && <p>טוען מיקום...</p>
            )}
        </div>
    );
}