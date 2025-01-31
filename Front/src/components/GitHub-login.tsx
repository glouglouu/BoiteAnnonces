import React from "react";

const CLIENT_ID = "Iv23ctQcewuO1YVw1wYp"; // Ton Client ID GitHub
const REDIRECT_URI = "http://localhost:3000"; // URL de redirection pour GitHub après login

const GitHubLogin: React.FC = () => {
  const handleLogin = () => {
    // Redirige l'utilisateur vers la page d'authentification GitHub
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
    >
      Se connecter avec GitHub
    </button>
  );
};

export default GitHubLogin;
