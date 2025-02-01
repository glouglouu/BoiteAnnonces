import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Announcement {
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  title: string;
  description: string;
  image: string | null;
  category: string;
  price: string;
  location: string;
}

const EditAnnouncement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Announcement>({
    author: {
      firstName: "",
      lastName: "",
      email: "",
    },
    title: "",
    description: "",
    image: null,
    category: "",
    price: "",
    location: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Gérer le fichier image localement
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Récupération des détails de l'annonce
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/annonces/${id}`
        );
        if (!response.ok) {
          throw new Error("Annonce introuvable.");
        }
        const data = await response.json();
        setFormData({
          author: data.author,
          title: data.title,
          description: data.description,
          image: data.image || null,
          category: data.category,
          price: data.price,
          location: data.location,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue s'est produite.");
        }
      }
    };

    if (id) fetchAnnouncement();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files.length > 0) {
      setSelectedImage(files[0]);
      setFormData({ ...formData, image: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("title", formData.author.email);
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("category", formData.category);
    updatedData.append("price", formData.price);
    updatedData.append("location", formData.location);

    if (selectedImage) {
      updatedData.append("image", selectedImage); // Ajouter le fichier image
    }

    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${id}`, {
        method: "PATCH",
        body: updatedData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'annonce.");
      }

      setSuccessMessage("Annonce mise à jour avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };
  console.log(formData);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Détails{" "}
        {currentUser.email === formData.author?.email && "et modification"} de
        l'annonce
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      {/* Section de visualisation des détails */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow">
        <h3 className="text-xl font-bold">{formData.title}</h3>
        <p className="text-gray-700">{formData.description}</p>
        <p className="text-gray-600">Catégorie : {formData.category}</p>
        <p className="text-gray-600">Prix : {formData.price} €</p>
        <p className="text-gray-600">Localisation : {formData.location}</p>
        {formData.image && (
          <img
            src={require(`${process.env.SERVER_URL}/${formData.image}`)}
            alt="Annonce"
            className="w-full h-auto max-w-md rounded-lg mt-4"
          />
        )}
      </div>

      {currentUser.email === formData.author?.email && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-1"
            >
              Titre :
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description :
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows={4}
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-1"
            >
              Catégorie :
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="tech">Technologie</option>
              <option value="fashion">Mode</option>
              <option value="home">Maison</option>
              <option value="cars">Voitures</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Prix (€) :
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium mb-1"
            >
              Localisation :
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-1"
            >
              Image :
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Mettre à jour
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Retour à l'accueil
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditAnnouncement;
