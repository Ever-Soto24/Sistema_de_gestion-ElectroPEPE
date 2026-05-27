// Página principal después de hacer login
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  // Obtenemos los datos del usuario que está logueado
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Barra de navegación superior */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Electrodomésticos Pepe</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">¡Bienvenido, {usuario?.nombre}!</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">{usuario?.rol}</span>
          <button
            onClick={cerrarSesion}
            className="text-sm bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de control</h2>

        {/* Tarjetas de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            onClick={() => navigate('/productos')}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-700">Productos</h3>
            <p className="text-gray-500 text-sm mt-1">Ver y gestionar productos</p>
          </div>

          <div
            onClick={() => navigate('/clientes')}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-700">Clientes</h3>
            <p className="text-gray-500 text-sm mt-1">Ver y gestionar clientes</p>
          </div>

          <div
            onClick={() => navigate('/ventas')}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-700">Ventas</h3>
            <p className="text-gray-500 text-sm mt-1">Ver y registrar ventas</p>
          </div>

          {/* Solo el admin ve empleados y reportes */}
          {esAdmin && (
            <>
              <div
                onClick={() => navigate('/empleados')}
                className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Empleados</h3>
                <p className="text-gray-500 text-sm mt-1">Ver y gestionar empleados</p>
              </div>

              <div
                onClick={() => navigate('/reportes')}
                className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">Reportes</h3>
                <p className="text-gray-500 text-sm mt-1">Ver reportes y estadísticas</p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;