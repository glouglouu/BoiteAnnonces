import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Définir un type pour les annonces
type Announcement = {
  _id: string;
  title: string;
  description: string;
  image?: string; // L'image est facultative
};

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Typage des annonces
  const [error, setError] = useState<string | null>(null); // Typage explicite de l'erreur

  // Fetch des annonces depuis le backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/annonces");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des annonces");
        }
        const data: Announcement[] = await response.json(); // Typage de la réponse
        setAnnouncements(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue s'est produite.");
        }
      }
    };

    fetchAnnouncements();
  }, []);

  // Suppression d'une annonce
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce");
      }

      // Retirer l'annonce supprimée de la liste
      setAnnouncements(announcements.filter((ann) => ann._id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

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
                <img
                  src={`http://localhost:5000/uploads/${announcement.image}`}
                  alt={announcement.title}
                  className="announcement-image"
                />
              )}
              <Link to={`/edit/${announcement._id}`} className="edit-link">
                Modifier
              </Link>
              <button onClick={() => handleDelete(announcement._id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
