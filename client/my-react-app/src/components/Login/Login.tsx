import "./Login.css";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch, } from "react-redux";
import { setToken } from "../../Slices/authSlice";
import React from "react";
import type { RootState } from "../../App/store";
import LocationInput from "./LocationInput";
interface CredentialResponse {
  credential?: string;
  select_by?: string;
}
const clientId: string = "YOUR_GOOGLE_CLIENT_ID";
const LoginWithGoogle: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState("");

  const navigate = useNavigate();

  const handleSuccess = async (response: any) => {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "1111" }),
  });

  const data = await res.json();

  dispatch(setToken(data.token)); // 🔥 קריטי
  navigate("/search");
};

  const handleError = () => {
    console.log("Google login failed");
  };
   const handleLogin = () => {
   navigate("/search");
   }
 const dispatch = useDispatch();

const handleAdminLogin = async () => {
  console.log("VALUE SENT:", adminPassword);
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword }),
  });

  const data = await res.json();
  console.log("TOKEN:", data.token);
  dispatch(setToken(data.token));   // שומר JWT
  navigate("/admin");               // מעבר ל-ADMIN
};

const city = useSelector((state: RootState) => state.location.city);
const street = useSelector((state: RootState) => state.location.street);

const isLocationValid =
  city.trim() !== "" && street.trim() !== "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="input-group">
  <label>Admin Password</label>

  <input
    type="password"
    value={adminPassword}

    onChange={(e) => setAdminPassword(e.target.value)}
    placeholder="Enter admin password"
  />

  <button onClick={handleAdminLogin}>
    Enter Admin
  </button>
</div>
      <div className="login-page">

        <div className="login-box">

          <h1>Sign in</h1>

          <div className="input-group">
            <label>ID Number</label>
            <input type="ID" placeholder="Enter your ID number"/>
          </div>

          <div className="input-group">

            <LocationInput/>
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
  className={`login-btn ${!isLocationValid ? "disabled-btn" : ""}`}
  onClick={handleLogin}
  disabled={!isLocationValid}
>
  Sign in
</button>

          <div className="divider">
            or
          </div>

          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              width="270"
            />
          </div>

        </div>

      </div>

    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogle;