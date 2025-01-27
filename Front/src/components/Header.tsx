import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Boite Annonces</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-gray-200">
            Accueil
          </Link>
          <Link to="/login" className="hover:text-gray-200">
            Connexion
          </Link>
          <Link to="/register" className="hover:text-gray-200">
            Inscription
          </Link>
          <Link to="/announcements" className="hover:text-gray-200">
            Annonces
          </Link>
          <Link to="/create" className="hover:text-gray-200">
            Créer une annonce
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
