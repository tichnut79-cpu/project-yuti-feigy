import "./Login.css";
import { useState ,useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch, } from "react-redux";
import { setToken } from "../../Slices/authSlice";
import React from "react";
import type { RootState } from "../../App/store";
import LocationInput from "./LocationInput";
import { setCity, setStreet,setManualConfirmed } from "../../Slices/locationSlice";
import icons from "../Icons/Icons"
import {setLocationReady} from "../../Slices/locationSlice"
const codeAdmin=import.meta.env.CODE_ADMIN;
interface CredentialResponse {
  credential?: string;
  select_by?: string;
}
const clientId: string = "YOUR_GOOGLE_CLIENT_ID";
const LoginWithGoogle: React.FC = () => {

  const [adminPassword, setAdminPassword] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [useAutoLocation, setUseAutoLocation] = useState<boolean>(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [geoReady, setGeoReady] = useState(false);
  const [autoLocationConfirmed, setAutoLocationConfirmed] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = async (response: any) => {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: codeAdmin}),
  });
if (!res.ok) {
  const text = await res.text();
  console.error("Server error:", text);
  return;
}
  const data = await res.json();

  dispatch(setToken(data.token)); 
  navigate("/search");
};
  useEffect(() => {
    dispatch(setLocationReady(false));
  if (!useAutoLocation) return;

  if (!navigator.geolocation) return;

  setLoadingLocation(true);

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/geo/reverse?lat=${lat}&lng=${lng}`
      );

      const data = await res.json();

      if (data.city && data.street) {
        dispatch(setCity(data.city));
        dispatch(setStreet(data.street));
        dispatch(setLocationReady(true));
        setGeoReady(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLocation(false);
    }
  }, () => {
    setLoadingLocation(false);
  });

}, [useAutoLocation]);

  const handleError = () => {
    console.log("Google login failed");
  };
   const handleLogin = () => {
    if (!canEnter) return;
   navigate("/search");
   }
 const dispatch = useDispatch();


const city = useSelector((state: RootState) => state.location.city);
const street = useSelector((state: RootState) => state.location.street);
const hasLocation =city.trim().length > 0 &&street.trim().length > 0;

const canEnter =
  (useAutoLocation && autoLocationConfirmed) ||
  (!useAutoLocation && hasLocation);

const canSave = city.trim().length > 0 && street.trim().length > 0;
  return (
  <GoogleOAuthProvider clientId={clientId}>

    <div className="input-group">
    </div>

    <div className="login-page">
      <div className="login-box">

        <h1>Sign in</h1>

        <div className="input-group">
          <label>ID Number</label>
          <input type="ID" placeholder="Enter your ID number" />
        </div>

        <div className="input-group">
          <label >Location method</label>

          <div className="location-toggle">

  <div
    className={`location-card ${useAutoLocation ? "active" : ""}`}
    onClick={() => {setUseAutoLocation(true);
      dispatch(setLocationReady(false));
      setAutoLocationConfirmed(true);
    }}
  >
    <div className="card-icon">{icons.gps()}</div>
    <div className="title">Use computer location</div>
    <div className="desc">Detect my location automatically</div>
  </div>

  <div
  className={`location-card ${useAutoLocation === false ? "active" : ""}`}
  onClick={() => {
    setUseAutoLocation(false);
    setShowLocationModal(true);
  }}
>
  Enter manually
</div>

</div>
        </div>

         <div className="input-group">
            <label>Health Fund</label>
            <input type="HealthFund" list="healthFundList" placeholder="Enter your Health Fund"/>
            <datalist id="healthFundList">
            <option value="כללית" />
              <option value="מכבי" />
              <option value="מאוחדת" />
              <option value="לאומית" />
            </datalist>
          </div>



        <button
  className={`login-btn ${!canEnter ? "disabled-btn" : ""}`}
  disabled={!canEnter}
  onClick={handleLogin}
>
  Sign in
</button>

        <div className="divider">or</div>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />

      </div>
      {showLocationModal && (
  <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>

    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      <h2>Enter your location</h2>

      <LocationInput />

      <button
        className="login-btn"
        disabled={!canSave}
        onClick={() => {
    dispatch(setCity(city));
    dispatch(setStreet(street));
    dispatch(setManualConfirmed(true));
    setShowLocationModal(false);
}}  >
        Save
      </button>

    </div>

  </div>
)}
    </div>

  </GoogleOAuthProvider>
);
};

export default LoginWithGoogle;