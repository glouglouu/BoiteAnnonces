import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com";

function GoogleLogoutCpnt() {
  function onLogoutSuccess() {
    console.log("Logout Success!");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirection après la déconnexion
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div id="signOutButton">
        <button onClick={onLogoutSuccess} className="logout-button">
          Logout
        </button>
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLogoutCpnt;