import React, { useState } from "react";
import  {API } from "../api/apiInstance";
import "./Register.css";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (formData.username.trim().length < 3) {
        throw new Error("El nombre de usuario debe tener al menos 3 caracteres.");
      }

      if (!validateEmail(formData.email)) {
        throw new Error("El correo electrónico no es válido.");
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      const res = await API.post("/auth/register", formData);
      console.log("Respuesta del servidor:", res.data);

      setSuccess("¡Registro exitoso!");
      setFormData({ username: "", email: "", password: "" });

    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Error en el registro.";
      setError(msg);
    }
  };

  return (
    <div className="register">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
};

export { Register };
