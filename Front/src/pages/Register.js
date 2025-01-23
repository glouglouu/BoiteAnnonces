import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    // Vérification que tous les champs sont remplis
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      setError('Tous les champs sont requis');
      return;
    }

    const dataToSend = { firstName, lastName, email, password };

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assurez-vous que le type de contenu est "application/json"
        },
        body: JSON.stringify(dataToSend), // Envoi des données sous forme de JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Sauvegarder le token dans localStorage
      navigate('/'); // Rediriger vers la page principale après l'inscription réussie
    } catch (err) {
      setError(err.message); // Afficher l'erreur en cas de problème
    }
  };

  return (
    <div className="register">
      <h2>Inscription</h2>
      {error && <p className="error-message">{error}</p>} {/* Afficher l'erreur */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prénom :</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
