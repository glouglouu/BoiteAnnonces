import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditAnnouncement = () => {
  const { id } = useParams(); // Récupère l'ID de l'annonce depuis l'URL
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/annonces/${id}`);
        if (!response.ok) {
          throw new Error('Annonce introuvable.');
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          image: null, // Ne garde pas l'ancienne image pour permettre la modification
        });
        setCurrentImage(data.image); // Conserver l'ancienne image si présente
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append('title', formData.title);
    updatedFormData.append('description', formData.description);
    if (formData.image) updatedFormData.append('image', formData.image);

    try {
      const response = await fetch(`/api/annonces/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: updatedFormData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour de l\'annonce');
      }

      setSuccess(true);
      setError(null);

      // Rediriger vers la page principale après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="edit-announcement-page">
      <h2>Modifier l'annonce</h2>
      {success && <p className="success-message">Annonce mise à jour avec succès ! Redirection...</p>}
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
            <img src={`/uploads/${currentImage}`} alt="Image de l'annonce actuelle" className="current-image" />
            <p>Image actuelle</p>
          </div>
        )}
        <button type="submit">Mettre à jour l'annonce</button>
      </form>
    </div>
  );
};

export default EditAnnouncement;
