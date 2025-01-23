import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token JWT (si stocké dans le localStorage)
    localStorage.removeItem('token');
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link to="/">Boite Annonces</Link>
        </h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Annonces</Link>
            </li>
            <li>
              <Link to="/create">Créer une annonce</Link>
            </li>
            <li>
              <Link to="/register">S'inscrire</Link>
            </li>
            <li>
              <Link to="/login">Se connecter</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
