// Página para gestionar los clientes de la tienda
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Clientes = () => {
  const { esAdmin } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '', apellido: '', telefono: '',
    email: '', ciudad: '', limite_credito: '',
  });

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const respuesta = await api.get('/clientes');
      setClientes(respuesta.data);
    } catch (error) {
      setMensaje('Error al obtener los clientes');
    }
  };

  const buscarClientes = async () => {
    if (!busqueda.trim()) {
      obtenerClientes();
      return;
    }
    try {
      const respuesta = await api.get(`/clientes/buscar/${busqueda}`);
      setClientes(respuesta.data);
    } catch (error) {
      setMensaje('Error al buscar clientes');
    }
  };

  const abrirFormularioNuevo = () => {
    setClienteEditando(null);
    setFormulario({ nombre: '', apellido: '', telefono: '', email: '', ciudad: '', limite_credito: '' });
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (cliente) => {
    setClienteEditando(cliente);
    setFormulario({
      nombre:         cliente.nombre,
      apellido:       cliente.apellido,
      telefono:       cliente.telefono,
      email:          cliente.email,
      ciudad:         cliente.ciudad,
      limite_credito: cliente.limite_credito,
      activo:         cliente.activo,
    });
    setMostrarFormulario(true);
  };

  const guardarCliente = async () => {
    try {
      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando.id_cliente}`, formulario);
        setMensaje('Cliente actualizado');
      } else {
        await api.post('/clientes', formulario);
        setMensaje('Cliente creado');
      }
      setMostrarFormulario(false);
      obtenerClientes();
    } catch (error) {
      setMensaje('Error al guardar el cliente');
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      setMensaje('Cliente eliminado');
      obtenerClientes();
    } catch (error) {
      setMensaje('Error al eliminar el cliente');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Clientes</h2>

        {mensaje && (
          <div className="border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 text-sm">
            {mensaje}
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarClientes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {esAdmin && (
            <button
              onClick={abrirFormularioNuevo}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Nuevo cliente
            </button>
          )}
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}
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
                <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
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
              <div>
                <label className="block text-sm text-gray-700 mb-1">Límite de crédito</label>
                <input
                  type="number"
                  value={formulario.limite_credito}
                  onChange={(e) => setFormulario({ ...formulario, limite_credito: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={guardarCliente}
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
                <th className="text-left px-4 py-3 text-gray-600">Teléfono</th>
                <th className="text-left px-4 py-3 text-gray-600">Email</th>
                <th className="text-left px-4 py-3 text-gray-600">Ciudad</th>
                <th className="text-left px-4 py-3 text-gray-600">Límite crédito</th>
                {esAdmin && (
                  <th className="text-left px-4 py-3 text-gray-600">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{cliente.nombre} {cliente.apellido}</td>
                  <td className="px-4 py-3">{cliente.telefono}</td>
                  <td className="px-4 py-3">{cliente.email}</td>
                  <td className="px-4 py-3">{cliente.ciudad}</td>
                  <td className="px-4 py-3">${Number(cliente.limite_credito).toLocaleString()}</td>
                  {esAdmin && (
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => abrirFormularioEditar(cliente)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarCliente(cliente.id_cliente)}
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

export default Clientes;