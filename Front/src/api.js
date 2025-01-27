const API_URL = "http://localhost:5000/api"; // URL de base de l'API

/**
 * Fonction générique pour effectuer des requêtes API.
 *
 * @param {string} endpoint - L'endpoint de l'API.
 * @param {"GET" | "POST" | "PUT" | "DELETE"} method - La méthode HTTP (GET, POST, PUT, DELETE).
 * @param {Object} [data] - Les données à envoyer (facultatif).
 * @param {string} [token] - Le token JWT pour l'authentification (facultatif).
 * @returns {Promise<any>} - La réponse de l'API sous forme de JSON.
 */
const request = async (endpoint, method, data, token) => {
  try {
    // Préparation des en-têtes
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Options de la requête
    const options = {
      method,
      headers,
    };

    // Ajouter les données au corps de la requête si nécessaire
    if (data) {
      options.body = JSON.stringify(data);
    }

    // Effectuer la requête
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Vérifier le statut de la réponse
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Une erreur est survenue");
    }

    // Retourner les données JSON
    return await response.json();
  } catch (error) {
    // Gérer les erreurs de communication
    throw new Error(error.message || "Erreur de communication avec le serveur");
  }
};

// Fonction GET
export const getData = (endpoint, token) => request(endpoint, "GET", undefined, token);

// Fonction POST
export const postData = (endpoint, data, token) => request(endpoint, "POST", data, token);

// Fonction PUT
export const putData = (endpoint, data, token) => request(endpoint, "PUT", data, token);

// Fonction DELETE
export const deleteData = (endpoint, token) => request(endpoint, "DELETE", undefined, token);
