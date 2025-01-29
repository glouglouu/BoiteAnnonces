import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId =
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com";

function GoogleLoginCpnt() {
  const onSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    console.log("token", token);
    const fetchApiWithToken = await fetch(
      "http://localhost:5000/api/users/google",
      {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const response = await fetchApiWithToken.json();
    if (response.ok) {
      console.log(response);
      localStorage.setItem("token", response.token);
      window.location.href = "/";
    }
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
