
import "./Login.css";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React from "react";

import { setToken } from "../../Slices/authSlice";
import type { RootState } from "../../App/store";
import LocationInput from "./LocationInput";
import {
  setCity,
  setStreet,
  setManualConfirmed,
  setLocationReady,
} from "../../Slices/locationSlice";

import icons from "../Icons/Icons";
import AutoLocation from "../AutoLocation/AutoLocation";

const clientId = "YOUR_GOOGLE_CLIENT_ID";
const codeAdmin = import.meta.env.CODE_ADMIN;

const LoginWithGoogle: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const city = useSelector((state: RootState) => state.location.city);
  const street = useSelector((state: RootState) => state.location.street);

  const [useAutoLocation, setUseAutoLocation] = useState<boolean | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [autoLocationConfirmed, setAutoLocationConfirmed] = useState(false);
  const [autoLocationTrigger, setAutoLocationTrigger] = useState(0);

  const hasLocation =
    city.trim().length > 0 && street.trim().length > 0;

  const canEnter =
    (useAutoLocation && autoLocationConfirmed) ||
    (!useAutoLocation && hasLocation);

  const canSave = hasLocation;

  useEffect(() => {
    dispatch(setLocationReady(false));
  }, []);

  const handleLocationResult = (city: string, street: string) => {
    dispatch(setCity(city));
    dispatch(setStreet(street));
    dispatch(setLocationReady(true));
    setAutoLocationConfirmed(true);
  };

  const handleLogin = () => {
    if (!canEnter) return;
    navigate("/search");
  };

  const handleSuccess = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: codeAdmin }),
    });

    if (!res.ok) return;

    const data = await res.json();
    dispatch(setToken(data.token));

    navigate("/search");
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AutoLocation
        onLocationResult={handleLocationResult}
        trigger={autoLocationTrigger}
      />

      <div className="login-page">
        <div className="login-box">

          <h1>Sign in</h1>
          <p className="subtitle">Secure access to your medical services</p>

          {/* ID */}
          <div className="input-group">
            <label>ID Number</label>
            <input placeholder="Enter your ID number" />
          </div>

          {/* LOCATION */}
          <div className="input-group">
            <label>Location method</label>

            <div className="location-toggle">

              <div
                className={`location-card ${useAutoLocation === true ? "active" : ""}`}
                onClick={() => {
                  setUseAutoLocation(true);
                  dispatch(setLocationReady(false));
                  setAutoLocationConfirmed(true);
                  setAutoLocationTrigger((p) => p + 1);
                }}
              >
                <div className="card-icon">{icons.gps()}</div>
                <div className="title">Use automatic location</div>
                <div className="desc">
                  Detect your location using device GPS
                </div>
              </div>

              <div
                className={`location-card ${useAutoLocation === false ? "active" : ""}`}
                onClick={() => {
                  setUseAutoLocation(false);
                  setShowLocationModal(true);
                }}
              >
                <div className="title">Enter manually</div>
                <div className="desc">
                  Choose city and street yourself
                </div>
              </div>

            </div>
          </div>

          {/* HEALTH FUND */}
          <div className="input-group">
            <label>Health Fund</label>
            <input
              list="healthFundList"
              placeholder="Select your health fund"
            />
            <datalist id="healthFundList">
              <option value="כללית" />
              <option value="מכבי" />
              <option value="מאוחדת" />
              <option value="לאומית" />
            </datalist>
          </div>

          {/* BUTTON */}
          <button
            className={`login-btn ${!canEnter ? "disabled-btn" : ""}`}
            disabled={!canEnter}
            onClick={handleLogin}
          >
            Sign in
          </button>

          {/* DIVIDER */}
          <div className="divider">OR CONTINUE WITH</div>

          {/* GOOGLE */}
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />

        </div>

        {/* MODAL */}
        {showLocationModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowLocationModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Enter your location</h2>

              <LocationInput />

              <button
                className="login-btn"
                disabled={!canSave}
                onClick={() => {
                  dispatch(setManualConfirmed(true));
                  setShowLocationModal(false);
                }}
              >
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
