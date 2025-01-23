import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // S'assurer que les données sont envoyées correctement
    const dataToSend = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // S'assurer que le type de contenu est "application/json"
        },
        body: JSON.stringify(dataToSend), // Envoyer les données sous forme de JSON
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la connexion');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Sauvegarder le token dans localStorage
      navigate('/'); // Rediriger vers la page principale après la connexion réussie
    } catch (err) {
      setError(err.message); // Afficher l'erreur en cas de problème
    }
  };

  return (
    <div className="login">
      <h2>Connexion</h2>
      {error && <p className="error-message">{error}</p>} {/* Afficher l'erreur */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
