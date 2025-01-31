import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  type ValidateEmailCredentials = {
    email: string;
    isActive: boolean;
    code: string;
  };

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [validateEmailInput, setValidateEmailInput] =
    useState<ValidateEmailCredentials>({
      email: "",
      isActive: false,
      code: "",
    });

  useEffect(() => {
    console.log(validateEmailInput);
  }, [validateEmailInput]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    const dataToSend = { firstName, lastName, email, password };

    try {
      const response: any = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (!data) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }
      setValidateEmailInput({
        email: data.email,
        isActive: true,
        code: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(validateEmailInput);
    try {
      const response = await fetch("http://localhost:5000/api/users/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: validateEmailInput.code,
          email: validateEmailInput.email,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi du code");
      }
      const data = await response.json();
      console.log(data.message);
      setSuccessMessage(data.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {!validateEmailInput.isActive ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Inscription
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 font-medium mb-1"
              >
                Prénom :
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Votre prénom"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 font-medium mb-1"
              >
                Nom :
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Votre nom"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email :
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Votre adresse email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Mot de passe :
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Votre mot de passe"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600"
            >
              S'inscrire
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 text-white font-medium py-2 rounded-md hover:bg-gray-600 mt-2"
          >
            Retour à l'accueil
          </button>
        </>
      ) : (
        <>
          {successMessage && (
            <>
              <div className="text-green-500 text-center mb-4">
                {successMessage}
              </div>
              <Link to="/login">Go back to login page</Link>
            </>
          )}
          <form
            onSubmit={handleSubmitCode}
            className="flex flex-col items-center space-y-2"
            action=""
          >
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="number"
            >
              Entrez le code de confirmation envoyé par mail:{" "}
            </label>
            <input
              onChange={(e) =>
                setValidateEmailInput({
                  ...validateEmailInput,
                  code: e.target.value,
                })
              }
              type="number"
              className="w-full border rounded-md p-2"
              id="number"
              name="number"
              required
            />
            <button
              className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600"
              type="submit"
            >
              Confirmer
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;
