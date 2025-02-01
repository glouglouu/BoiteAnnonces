import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiHeart2Fill, RiHeart2Line, RiDeleteBinLine } from "react-icons/ri";
interface Announcement {
  _id: string;
  title: string;
  description: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  isFavorite: boolean;
}

type User = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

const Home: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [ownAnnonces, setOwnAnnonces] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>("date"); // Tri par défaut
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [announcementsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Récupérer les annonces depuis le backend
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/annonces");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces :", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log(storedUser);
  }, []);

  // Fonction pour basculer le statut favori
  const toggleFavorite = async (id: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement._id === id
          ? { ...announcement, isFavorite: !announcement.isFavorite }
          : announcement
      )
    );
  };

  // Fonction pour supprimer une annonce
  const deleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce.");
      }
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id !== id)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce :", error);
    }
  };

  // Tri des annonces
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Filtrage des annonces
  const filteredAnnouncements = sortedAnnouncements.filter((announcement) => {
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFavorites = !favoritesOnly || announcement.isFavorite;

    return matchesSearch && matchesFavorites;
  });

  // Pagination
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const totalPages = Math.ceil(
    filteredAnnouncements.length / announcementsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Boite Annonces</h1>
        <div className="flex items-center space-x-4">
          {user.firstName ? (
            <>
              <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
                {user.firstName}
              </button>
              <button
                onClick={() => {
                  setUser({
                    firstName: null,
                    lastName: null,
                    email: null,
                  });
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                }}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
              >
                Deconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Annonces disponibles</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => {
              user.firstName
                ? navigate("/create")
                : alert(
                    "Veuillez vous connecter pour utiliser cette fonctionnalitée"
                  );
            }}
          >
            Ajouter une annonce
          </button>
        </div>

        {/* Barre de recherche et tri */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            className="flex-1 border rounded-md p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
            />
            <span>Favoris uniquement</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={ownAnnonces}
              onChange={(e) => setOwnAnnonces(e.target.checked)}
            />
            <span>Mes annonces</span>
          </label>
          <select
            className="border rounded-md p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Trier par date</option>
            <option value="title">Trier par titre</option>
          </select>
        </div>

        {/* Liste des annonces */}
        <ul className="space-y-4">
          {currentAnnouncements.length === 0 && (
            <p>Aucune annonce disponible.</p>
          )}
          {ownAnnonces ? (
            <>
              {currentAnnouncements
                .filter(
                  (announcement) => announcement.author.email === user.email
                )
                .map((announcement) => (
                  <li
                    key={announcement._id}
                    className="bg-white p-4 rounded-md shadow flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-700">
                        {announcement.description}
                      </p>
                      <small className="text-gray-500">
                        Publié par {announcement.author.firstName} le{" "}
                        {announcement.createdAt}
                      </small>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        className={`text-xl ${
                          announcement.isFavorite
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onClick={() => toggleFavorite(announcement._id)}
                      >
                        {announcement.isFavorite ? (
                          <RiHeart2Fill />
                        ) : (
                          <RiHeart2Line />
                        )}
                      </button>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => navigate(`/edit/${announcement._id}`)}
                      >
                        Voir les détails
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => deleteAnnouncement(announcement._id)}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </li>
                ))}
            </>
          ) : (
            <>
              {currentAnnouncements.map((announcement) => (
                <li
                  key={announcement._id}
                  className="bg-white p-4 rounded-md shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                    <p className="text-gray-700">{announcement.description}</p>
                    <small className="text-gray-500">
                      Publié par {announcement.author.firstName} le{" "}
                      {announcement.createdAt}
                    </small>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`text-xl ${
                        announcement.isFavorite
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                      onClick={() => toggleFavorite(announcement._id)}
                    >
                      {announcement.isFavorite ? (
                        <RiHeart2Fill />
                      ) : (
                        <RiHeart2Line />
                      )}
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/edit/${announcement._id}`)}
                    >
                      Voir les détails
                    </button>
                    {user.email === announcement.author.email && (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => deleteAnnouncement(announcement._id)}
                      >
                        <RiDeleteBinLine />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
