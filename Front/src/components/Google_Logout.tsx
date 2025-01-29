import { GoogleLogout } from "react-google-login";

const clientId =
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com";

function GoogleLogoutCpnt() {
  const onLogoutSuccess = () => {
    console.log("Logout Success ! ");
  };

  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
        disabledStyle={{ display: "none" }}
      />
    </div>
  );
}
export default GoogleLogoutCpnt;
