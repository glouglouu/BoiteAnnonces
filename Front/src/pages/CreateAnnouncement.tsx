import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAnnouncement: React.FC = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image: File | null;
    category: string;
    price: string;
    location: string;
  }>({
    title: "",
    description: "",
    image: null,
    category: "",
    price: "",
    location: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, image, category, price, location } = formData;
    if (!title || !description || !image || !category || !price || !location) {
      setError("Tous les champs sont requis");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("title", title);
    dataToSend.append("description", description);
    dataToSend.append("image", image);
    dataToSend.append("category", category);
    dataToSend.append("price", price);
    dataToSend.append("location", location);

    try {
      const response = await fetch("http://localhost:5000/api/annonces", {
        method: "POST",
        body: dataToSend,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce");
      }

      setSuccessMessage("Annonce créée avec succès !");
      setFormData({
        title: "",
        description: "",
        image: null,
        category: "",
        price: "",
        location: "",
      });
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Créer une Annonce
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4 text-center">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
            Titre :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Titre de l'annonce"
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
            placeholder="Description de l'annonce"
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
          <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
            Prix (€) :
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Prix"
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
            placeholder="Ville ou région"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
            Image :
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600"
        >
          Créer l'Annonce
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-gray-500 text-white font-medium py-2 rounded-md hover:bg-gray-600 mt-2"
        >
          Retour à l'accueil
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
