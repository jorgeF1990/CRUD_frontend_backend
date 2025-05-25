// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { API } from "../api/apiInstance";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Login.css";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        // Verificamos el perfil luego del login
        const userRes = await API.get("/user/profile");
        setUser(userRes.data);

        navigate("/dashboard");
      } else {
        setError("No se recibió token del servidor");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error en el inicio de sesión");
    }
  };

  return (
    <div className="login">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
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
          autoComplete="current-password"
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export { Login };
