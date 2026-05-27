//// AQUÍ ESTÁN TODAS LAS RUTAS DE LAS PAGINAS DEL FRONT 

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Empleados from './pages/Empleados';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import RutaProtegida from './components/RutaProtegida';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
      <Route path="/clientes"  element={<RutaProtegida><Clientes /></RutaProtegida>} />
      <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
      <Route path="/ventas"    element={<RutaProtegida><Ventas /></RutaProtegida>} />
      <Route path="/reportes"  element={<RutaProtegida><Reportes /></RutaProtegida>} />
      <Route path="*"          element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;