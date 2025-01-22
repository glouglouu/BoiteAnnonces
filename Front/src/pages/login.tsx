import React, { useState } from "react";

export default function Login() {
  type User = {
    name: string;
    surname: string;
    email: string;
    password: string;
  };

  const [user, setUser] = useState<User>({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const handleSubmit = () => {
    console.log("Form submitted");
    console.log(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-wide">Login</h1>
      <form
        onChange={(e) => handleChange(e)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full max-w-md mt-4 p-6 bg-gray-100 rounded-lg shadow-lg"
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="name" className="text-lg font-bold mb-2">
            Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="surname" className="text-lg font-bold mb-2">
            Surname
          </label>
          <input
            name="surname"
            id="surname"
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-lg font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-lg font-bold mb-2">
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
