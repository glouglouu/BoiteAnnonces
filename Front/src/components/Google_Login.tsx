import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { UserContext } from "../Context";

function GoogleLoginCpnt() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext not found");
  const { setUser } = context;

  const onSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      console.error("No credential found");
      return;
    }

    try {
      const token = credentialResponse.credential;
      const response = await fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with Google");
      }

      const res = await response.json();
      console.log("Response from server:", res);

      sessionStorage.setItem("token", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: res.user.given_name,
          lastName: res.user.family_name,
          email: res.user.email,
        })
      );

      setUser({
        firstName: res.user.given_name,
        lastName: res.user.family_name,
        email: res.user.email,
        token: res.token,
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  };

  const onFailure = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <div id="signInButton">
        <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginCpnt;
