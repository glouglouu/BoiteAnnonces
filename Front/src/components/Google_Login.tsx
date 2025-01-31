import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { UserContext } from "../Context";

const clientId =
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com";

function GoogleLoginCpnt() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext not found");
  const { user, setUser } = context;

  const onSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const fetchApiWithToken = await fetch(
      "http://localhost:5000/api/users/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchApiWithToken.json().then((res) => {
      console.log(res);
      localStorage.setItem("token", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: res.user.given_name,
          lastName: res.user.family_name,
          email: res.user.email,
        })
      );
      window.location.href = "/";
    });
  };

  const onFailure = () => {
    console.log("Login Failed!");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div id="signInButton">
        <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginCpnt;
