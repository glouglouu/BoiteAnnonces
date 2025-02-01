import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import GoogleLoginCpnt from "../components/Google_Login";
import { gapi } from "gapi-script";

const GOOGLE_CLIENT_ID =
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com"; // Ton Client ID Google
const GITHUB_CLIENT_ID = "Iv23ctQcewuO1YVw1wYp"; // Ton Client ID GitHub
const GITHUB_REDIRECT_URI = "http://localhost:3000"; // URL de redirection pour GitHub

const Login: React.FC = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext not found");
  }

  const { setUser } = context;

  useEffect(() => {
    // Initialisation du client Google
    const initGoogleClient = () => {
      gapi.auth2.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initGoogleClient);

    // Gestion de l'authentification GitHub via callback URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`http://localhost:5000/auth/github/callback?code=${code}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            setSuccessMessage("Connexion réussie avec GitHub !");
            window.history.pushState({}, "", "/");
          }
        })
        .catch((error) =>
          console.error("Erreur lors de l'authentification GitHub :", error)
        );
    }
  }, [setUser]);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion de la soumission du formulaire classique (email/password)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la connexion");
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage("Connexion réussie !");
      setError(null);

      // Redirection vers Home après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user&redirect_uri=${GITHUB_REDIRECT_URI}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Connexion
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      {/* Boutons de connexion Google et GitHub */}
      <div className="flex justify-around items-center mt-4">
        <GoogleLoginCpnt />
        <button
          onClick={handleGitHubLogin}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
        >
          Se connecter avec GitHub
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Votre adresse email"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Mot de passe :
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Votre mot de passe"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600"
        >
          Se connecter
        </button>
        <button
          onClick={() => navigate("/")}
          type="button"
          className="w-full bg-gray-500 text-white font-medium py-2 rounded-md hover:bg-gray-600 mt-2"
        >
          Retour à l'accueil
        </button>
      </form>
    </div>
  );
};

export default Login;
