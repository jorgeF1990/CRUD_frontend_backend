import axios from 'axios';

// Crear instancia de Axios con configuración
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:2222/api',
  timeout: 10000,
  withCredentials: true, // Necesario para cookies/autenticación
});

// Interceptor para agregar token de autorización
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores globalmente si se desea
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("API sin respuesta:", error.request);
    } else {
      console.error("Error general en API:", error.message);
    }
    return Promise.reject(error);
  }
);

export { API };
