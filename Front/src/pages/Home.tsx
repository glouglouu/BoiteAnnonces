import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Announcement {
  id: number;
  title: string;
  description: string;
  owner: string;
  category: string;
  date: string;
  isFavorite: boolean;
  likes: number;
  dislikes: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    setUser({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      isAdmin: true,
    });

    // Simuler des annonces
    setAnnouncements([
      {
        id: 1,
        title: "iPhone 13",
        description: "Un iPhone 13 en parfait état.",
        owner: "John Doe",
        category: "Technologie",
        date: "2023-01-15",
        isFavorite: false,
        likes: 15,
        dislikes: 2,
      },
      {
        id: 2,
        title: "Canapé en cuir",
        description: "Un canapé en cuir de haute qualité.",
        owner: "Jane Smith",
        category: "Maison",
        date: "2023-02-20",
        isFavorite: true,
        likes: 20,
        dislikes: 1,
      },
    ]);
  }, []);

  const toggleFavorite = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? { ...announcement, isFavorite: !announcement.isFavorite }
          : announcement
      )
    );
  };

  const viewDetails = (id: number) => {
    const announcement = announcements.find((a) => a.id === id);
    setSelectedAnnouncement(announcement || null);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Boite Annonces</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="font-bold">Bienvenue, {user.name}</span>
              <button
                onClick={() => setUser(null)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Inscription
              </Link>
            </>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-800"
          >
            {darkMode ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Annonces</h2>
          <Link
            to="/create"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter une annonce
          </Link>
        </div>

        {/* Annonce List */}
        <ul className="mt-6 space-y-4">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{announcement.title}</h3>
                <p>{announcement.description}</p>
                <small className="text-gray-500">
                  Publié par {announcement.owner} le {announcement.date}
                </small>
              </div>
              <div className="space-x-2">
                <button
                  className={`px-3 py-1 rounded ${
                    announcement.isFavorite ? "bg-yellow-400" : "bg-gray-300"
                  }`}
                  onClick={() => toggleFavorite(announcement.id)}
                >
                  {announcement.isFavorite ? "❤️" : "♡"}
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => viewDetails(announcement.id)}
                >
                  Voir détails
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Details Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">
                {selectedAnnouncement.title}
              </h3>
              <p className="mb-2">
                <strong>Description :</strong> {selectedAnnouncement.description}
              </p>
              <p className="mb-2">
                <strong>Propriétaire :</strong> {selectedAnnouncement.owner}
              </p>
              <p className="mb-2">
                <strong>Catégorie :</strong> {selectedAnnouncement.category}
              </p>
              <p className="mb-2">
                <strong>Date :</strong> {selectedAnnouncement.date}
              </p>
              <p className="mb-2">
                <strong>Likes :</strong> {selectedAnnouncement.likes}
              </p>
              <p className="mb-2">
                <strong>Dislikes :</strong> {selectedAnnouncement.dislikes}
              </p>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        <p>&copy; {new Date().getFullYear()} Boite Annonces. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
