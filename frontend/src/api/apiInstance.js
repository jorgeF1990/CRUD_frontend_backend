import axios from "axios";

// Configuración de la URL base
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || "http://tu-dominio.com/api";
  }
  
  // En desarrollo, usa IP explícita para evitar problemas IPv6
  return "http://127.0.0.1:2222/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Log para depuración
    if (import.meta.env.DEV) {
      console.log(`➡️ Enviando solicitud a: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Error en solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
API.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`⬅️ Respuesta recibida de: ${response.config.url}`, response);
    }
    return response;
  },
  (error) => {
    const errorInfo = {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data
          }
        : null
    };
    
    console.error("❌ Error en la API:", errorInfo);
    
    // Manejo especial para errores de conexión
    if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: "No se pudo conectar con el servidor"
      });
    }
    
    return Promise.reject(error);
  }
);

export { API };