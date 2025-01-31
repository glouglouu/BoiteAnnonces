import React from "react";

const GitHubLogout: React.FC = () => {
  const handleLogout = () => {
    // Supprime les informations utilisateur du localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Recharge la page ou redirige vers une autre route
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      Se déconnecter
    </button>
  );
};

export default GitHubLogout;
