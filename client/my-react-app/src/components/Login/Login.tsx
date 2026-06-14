import "./Login.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import React from "react";

interface CredentialResponse {
  credential?: string;
  select_by?: string;
}

const clientId: string = "YOUR_GOOGLE_CLIENT_ID";
const LoginWithGoogle: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (response: CredentialResponse) => {
    console.log("Google login successful:", response.credential);
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-page">

        <div className="login-box">

          <h1>Sign in</h1>

          <div className="input-group">
            <label>ID Number</label>
            <input type="ID" placeholder="Enter your ID number"/>
          </div>

          <div className="input-group">
            <label>Location</label>
            <input type="Location" placeholder="Enter your location"/>
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

          <button className="login-btn" onClick={() => navigate("/search")}>
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