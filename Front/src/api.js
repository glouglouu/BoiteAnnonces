// api.js - Centralise les appels API pour simplifier les requêtes dans le frontend

const API_URL = 'http://localhost:5000/api'; // URL de base de l'API

// Fonction pour envoyer une requête GET
export const getData = async (endpoint, token = '') => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', // Si le token est fourni, on l'ajoute dans les en-têtes
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erreur de communication avec le serveur');
  }
};

// Fonction pour envoyer une requête POST
export const postData = async (endpoint, data, token = '') => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', // Si le token est fourni, on l'ajoute dans les en-têtes
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'envoi des données');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erreur de communication avec le serveur');
  }
};

// Fonction pour envoyer une requête PUT (mise à jour)
export const putData = async (endpoint, data, token = '') => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', // Si le token est fourni, on l'ajoute dans les en-têtes
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la mise à jour des données');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erreur de communication avec le serveur');
  }
};

// Fonction pour envoyer une requête DELETE (suppression)
export const deleteData = async (endpoint, token = '') => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', // Si le token est fourni, on l'ajoute dans les en-têtes
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erreur de communication avec le serveur');
  }
};
