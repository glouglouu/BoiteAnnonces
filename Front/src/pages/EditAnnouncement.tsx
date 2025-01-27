import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Announcement {
  title: string;
  description: string;
  image: File | null;
}

const EditAnnouncement: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Typage explicite de l'ID depuis les paramètres d'URL
  const [formData, setFormData] = useState<Announcement>({
    title: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState<string | null>(null); // Typage explicite des erreurs
  const [success, setSuccess] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/annonces/${id}`);
        if (!response.ok) {
          throw new Error("Annonce introuvable.");
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          image: null, // Ne garde pas l'ancienne image pour permettre la modification
        });
        setCurrentImage(data.image); // Conserver l'ancienne image si présente
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue s'est produite.");
        }
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append("title", formData.title);
    updatedFormData.append("description", formData.description);
    if (formData.image) updatedFormData.append("image", formData.image);

    try {
      const response = await fetch(`/api/annonces/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: updatedFormData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour de l'annonce");
      }

      setSuccess(true);
      setError(null);

      // Rediriger vers la page principale après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="edit-announcement-page">
      <h2>Modifier l'annonce</h2>
      {success && (
        <p className="success-message">Annonce mise à jour avec succès ! Redirection...</p>
      )}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image (facultative) :</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg, image/png"
            onChange={handleChange}
          />
        </div>
        {currentImage && !formData.image && (
          <div>
            <img
              src={`/uploads/${currentImage}`}
              alt="Image de l'annonce actuelle"
              className="current-image"
            />
            <p>Image actuelle</p>
          </div>
        )}
        <button type="submit">Mettre à jour l'annonce</button>
      </form>
    </div>
  );
};

export default EditAnnouncement;
