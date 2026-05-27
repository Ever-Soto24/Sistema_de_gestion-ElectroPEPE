// Página de login con diseño split-screen
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await api.post('/auth/login', { email, password });
      const { token, usuario } = respuesta.data;
      login(token, usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">

      {/* Panel izquierdo: formulario de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-12 bg-white">
        <div className="w-full max-w-md">

          {/* Logo y título */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700">Electronicos Pepe</h1>
            <p className="text-gray-500 mt-1">      Gestión Administrativa </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xxxx@tcc.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={cargando}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          
        
        </div>
      </div>

      {/* Panel derecho: imagen con velo blur */}
      <div className="hidden md:block md:w-1/2 relative">
        {/* Imagen de fondo */}
        <img
          src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=2002&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Tienda de electrodomésticos"
          className="w-full h-full object-cover"
        />
        {/* Velo oscuro con blur encima de la imagen */}
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex flex-col justify-end p-12">
      
            
        
          <p className="text-blue-200 mt-4 text-lg">
            Control total sobre su negocio
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;