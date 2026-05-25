import './Login.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface CredentialResponse {
  credential?: string;
  select_by?: string;
}

const clientId: string = "YOUR_GOOGLE_CLIENT_ID";

const LoginWithGoogle: React.FC = () => {
  const handleSuccess = (response: CredentialResponse) => {
    console.log("Google login successful:", response.credential);
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
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogle;