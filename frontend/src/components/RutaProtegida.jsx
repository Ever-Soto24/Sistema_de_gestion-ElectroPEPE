// Componente que protege las rutas privadas
// Si no hay usuario logueado, redirige al login
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RutaProtegida;