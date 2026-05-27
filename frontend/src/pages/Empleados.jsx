// Página para gestionar los empleados de la tienda
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Empleados = () => {
  const { esAdmin } = useAuth();
  const navigate = useNavigate();

  const [empleados, setEmpleados]                   = useState([]);
  const [mostrarFormulario, setMostrarFormulario]   = useState(false);
  const [empleadoEditando, setEmpleadoEditando]     = useState(null);
  const [busqueda, setBusqueda]                     = useState('');
  const [mensaje, setMensaje]                       = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '', apellido: '', edad: '',
    cargo: '', fecha_contrato: '', salario: '', ciudad: '',
  });

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await api.get('/empleados');
      setEmpleados(respuesta.data);
    } catch (error) {
      setMensaje('Error al obtener los empleados');
    }
  };

  const buscarEmpleados = async () => {
    if (!busqueda.trim()) {
      obtenerEmpleados();
      return;
    }
    try {
      const respuesta = await api.get(`/empleados/buscar/${busqueda}`);
      setEmpleados(respuesta.data);
    } catch (error) {
      setMensaje('Error al buscar empleados');
    }
  };

  const abrirFormularioNuevo = () => {
    setEmpleadoEditando(null);
    setFormulario({ nombre: '', apellido: '', edad: '', cargo: '', fecha_contrato: '', salario: '', ciudad: '' });
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (empleado) => {
    setEmpleadoEditando(empleado);
    setFormulario({
      nombre:         empleado.nombre,
      apellido:       empleado.apellido,
      edad:           empleado.edad,
      cargo:          empleado.cargo,
      fecha_contrato: empleado.fecha_contrato?.split('T')[0],
      salario:        empleado.salario,
      ciudad:         empleado.ciudad,
      activo:         empleado.activo,
    });
    setMostrarFormulario(true);
  };

  const guardarEmpleado = async () => {
    try {
      if (empleadoEditando) {
        await api.put(`/empleados/${empleadoEditando.id_empleado}`, formulario);
        setMensaje('Empleado actualizado');
      } else {
        await api.post('/empleados', formulario);
        setMensaje('Empleado creado');
      }
      setMostrarFormulario(false);
      obtenerEmpleados();
    } catch (error) {
      setMensaje('Error al guardar el empleado');
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm('¿Eliminar este empleado?')) return;
    try {
      await api.delete(`/empleados/${id}`);
      setMensaje('Empleado eliminado');
      obtenerEmpleados();
    } catch (error) {
      setMensaje('Error al eliminar el empleado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Electrodomésticos Pepe</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
        >
          Volver al inicio
        </button>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Empleados</h2>

        {mensaje && (
          <div className="border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 text-sm">
            {mensaje}
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o cargo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarEmpleados}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {esAdmin && (
            <button
              onClick={abrirFormularioNuevo}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Nuevo empleado
            </button>
          )}
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {empleadoEditando ? 'Editar empleado' : 'Nuevo empleado'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={formulario.apellido}
                  onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Edad</label>
                <input
                  type="number"
                  value={formulario.edad}
                  onChange={(e) => setFormulario({ ...formulario, edad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cargo</label>
                <input
                  type="text"
                  value={formulario.cargo}
                  onChange={(e) => setFormulario({ ...formulario, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha de contrato</label>
                <input
                  type="date"
                  value={formulario.fecha_contrato}
                  onChange={(e) => setFormulario({ ...formulario, fecha_contrato: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Salario</label>
                <input
                  type="number"
                  value={formulario.salario}
                  onChange={(e) => setFormulario({ ...formulario, salario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formulario.ciudad}
                  onChange={(e) => setFormulario({ ...formulario, ciudad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={guardarEmpleado}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-600">Cargo</th>
                <th className="text-left px-4 py-3 text-gray-600">Ciudad</th>
                <th className="text-left px-4 py-3 text-gray-600">Salario</th>
                <th className="text-left px-4 py-3 text-gray-600">Contrato</th>
                {esAdmin && (
                  <th className="text-left px-4 py-3 text-gray-600">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id_empleado} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{empleado.nombre} {empleado.apellido}</td>
                  <td className="px-4 py-3">{empleado.cargo}</td>
                  <td className="px-4 py-3">{empleado.ciudad}</td>
                  <td className="px-4 py-3">${Number(empleado.salario).toLocaleString()}</td>
                  <td className="px-4 py-3">{empleado.fecha_contrato?.split('T')[0]}</td>
                  {esAdmin && (
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => abrirFormularioEditar(empleado)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarEmpleado(empleado.id_empleado)}
                        className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Empleados;