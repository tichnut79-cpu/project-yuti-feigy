import { useEffect } from "react";

interface AutoLocationProps {
  onLocationResult: (city: string, street: string) => void;
  trigger: number;
}

const AutoLocation: React.FC<AutoLocationProps> = ({
  onLocationResult,
  trigger,
}) => {
  const MAX_TRIES = 3;

  const getGPS = (attempt = 1) => {
    console.log("GPS attempt:", attempt);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log("GPS SUCCESS");

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/geo/reverse?lat=${lat}&lng=${lng}`
          );

          const data = await res.json();

          const city =
            data.city ||
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "";

          const street =
            data.street ||
            data.address?.road ||
            data.address?.street ||
            "";

          onLocationResult(city, street);
        } catch (e) {
          console.error("Reverse geocode error:", e);
        }
      },
      async (err) => {
        console.warn("GPS failed:", err);

        if (attempt < MAX_TRIES) {
          setTimeout(() => getGPS(attempt + 1), 2000);
        } else {
          console.log("Switching to IP fallback");

          try {
            const res = await fetch("http://localhost:8080/api/location/ip");
            const data = await res.json();

            const city = data.city || "";
            const street = data.region || "";

            onLocationResult(city, street);
          } catch (e) {
            console.error("IP fallback failed:", e);
          }
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 600000,
      }
    );
  };

  useEffect(() => {
    if (trigger === 0) return;
    if (!navigator.geolocation) return;

    getGPS();
  }, [trigger]);

  return null;
};

export default AutoLocation;