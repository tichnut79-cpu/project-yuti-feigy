import './Login.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

interface CredentialResponse {
  credential?: string;
  select_by?: string;
}

const clientId: string = "YOUR_GOOGLE_CLIENT_ID";

const LoginWithGoogle: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (response: CredentialResponse) => {
    console.log("Google login successful:", response.credential);
    navigate("/search");
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="google-login-container">
        <h2>Login with Google</h2>
        <div className="google-login-button-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
        </div>
        <button onClick={() => navigate("/search")}>
  מעבר לחיפוש תרופות
</button>
      </div>
      
    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogle;