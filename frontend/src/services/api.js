// Configuración base de axios para comunicarse con la API
import axios from 'axios';

// Creamos una instancia de axios con la URL base de la API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor de peticiones: agrega el token JWT a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas: si el token expiró redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;