import React, { useState } from 'react';

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState(null);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: e.target.files[0] }); // Mise à jour de l'image
    } else {
      setFormData({ ...formData, [name]: value }); // Mise à jour des autres champs
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    const { title, description, image } = formData;
    if (!title || !description || !image) {
      setError('Tous les champs sont requis');
      return;
    }

    // Créer un objet FormData pour envoyer les données, y compris l'image
    const dataToSend = new FormData();
    dataToSend.append('title', title);
    dataToSend.append('description', description);
    dataToSend.append('image', image); // Ajouter l'image à FormData

    try {
      // Effectuer la requête POST pour envoyer les données au backend
      const response = await fetch('http://localhost:5000/api/annonces', {
        method: 'POST',
        body: dataToSend, // Utiliser FormData pour l'upload des fichiers
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'annonce');
      }

      const data = await response.json();
      console.log('Annonce créée avec succès', data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Créer une Annonce</h2>
      {error && <p>{error}</p>} {/* Afficher l'erreur si présente */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description :</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image :</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Créer l'Annonce</button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
