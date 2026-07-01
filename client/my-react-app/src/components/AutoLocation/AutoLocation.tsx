// AutoLocation.tsx
import { useEffect, useState } from "react";

interface AutoLocationProps {
  onLocationResult: (city: string, street: string) => void;
  trigger: number; // כשישתנה ל-true, יתחיל תהליך קבלת המיקום
}
const AutoLocation: React.FC<AutoLocationProps> = ({ onLocationResult, trigger }) => {
const [userLocation, setuserLocation] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;

    const onSuccess = (pos: any) => {
      console.log("LAT:", pos.coords.latitude);
      console.log("LNG:", pos.coords.longitude);
      setuserLocation([
        pos.coords.latitude,
        pos.coords.longitude,
      ]);
    };

    const onError = (err: any) => {
      console.warn("GPS failed, using fallback:", err);
    };

    const watch = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);
  return null; // קומפוננטה ויזואלית - לא מציגה כלום בעצמה
};

export default AutoLocation;