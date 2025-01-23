import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  // Fetch des annonces depuis le backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/annonces');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des annonces');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="announcements-page">
      <h2>Liste des Annonces</h2>
      {error && <p className="error-message">{error}</p>}
      {announcements.length === 0 ? (
        <p>Aucune annonce disponible</p>
      ) : (
        <ul className="announcements-list">
          {announcements.map((announcement) => (
            <li key={announcement._id} className="announcement-item">
              <h3>{announcement.title}</h3>
              <p>{announcement.description}</p>
              {announcement.image && (
                <img src={`http://localhost:5000/uploads/${announcement.image}`} alt={announcement.title} className="announcement-image" />
              )}
              <Link to={`/edit/${announcement._id}`} className="edit-link">Modifier</Link>
              <button onClick={() => handleDelete(announcement._id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'annonce');
      }

      setAnnouncements(announcements.filter((ann) => ann._id !== id)); // Retirer l'annonce supprimée de l'affichage
    } catch (err) {
      setError(err.message);
    }
  };
};

export default Announcements;
