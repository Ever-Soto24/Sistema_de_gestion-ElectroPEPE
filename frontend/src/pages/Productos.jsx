// Página para gestionar los productos de la tienda
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const { esAdmin } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos]                   = useState([]);
  const [mostrarFormulario, setMostrarFormulario]   = useState(false);
  const [productoEditando, setProductoEditando]     = useState(null);
  const [busqueda, setBusqueda]                     = useState('');
  const [mensaje, setMensaje]                       = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '', descripcion: '', precio: '',
    id_categoria: '', id_marca: '', id_proveedor: '',
    stock: '', stock_minimo: '',
  });

  const [categorias, setCategorias]   = useState([]);
  const [marcas, setMarcas]           = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
    obtenerMarcas();
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await api.get('/productos');
      setProductos(respuesta.data);
    } catch (error) {
      setMensaje('Error al obtener los productos');
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await api.get('/categorias');
      setCategorias(respuesta.data);
    } catch (error) {
      console.log('Error al obtener categorias');
    }
  };

  const obtenerMarcas = async () => {
    try {
      const respuesta = await api.get('/marcas');
      setMarcas(respuesta.data);
    } catch (error) {
      console.log('Error al obtener marcas');
    }
  };

  const obtenerProveedores = async () => {
    try {
      const respuesta = await api.get('/proveedores');
      setProveedores(respuesta.data);
    } catch (error) {
      console.log('Error al obtener proveedores');
    }
  };

  const buscarProductos = async () => {
    if (!busqueda.trim()) {
      obtenerProductos();
      return;
    }
    try {
      const respuesta = await api.get(`/productos/buscar/${busqueda}`);
      setProductos(respuesta.data);
    } catch (error) {
      setMensaje('Error al buscar productos');
    }
  };

  const abrirFormularioNuevo = () => {
    setProductoEditando(null);
    setFormulario({
      nombre: '', descripcion: '', precio: '',
      id_categoria: '', id_marca: '', id_proveedor: '',
      stock: '', stock_minimo: '',
    });
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (producto) => {
    setProductoEditando(producto);
    setFormulario({
      nombre:        producto.nombre,
      descripcion:   producto.descripcion,
      precio:        producto.precio,
      id_categoria:  producto.id_categoria,
      id_marca:      producto.id_marca,
      id_proveedor:  producto.id_proveedor,
      stock:         producto.stock,
      stock_minimo:  producto.stock_minimo,
      activo:        producto.activo,
    });
    setMostrarFormulario(true);
  };

  const guardarProducto = async () => {
    try {
      if (productoEditando) {
        await api.put(`/productos/${productoEditando.id_producto}`, formulario);
        setMensaje('Producto actualizado');
      } else {
        await api.post('/productos', formulario);
        setMensaje('Producto creado');
      }
      setMostrarFormulario(false);
      obtenerProductos();
    } catch (error) {
      setMensaje('Error al guardar el producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      setMensaje('Producto eliminado');
      obtenerProductos();
    } catch (error) {
      setMensaje('Error al eliminar el producto');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos</h2>

        {mensaje && (
          <div className="border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 text-sm">
            {mensaje}
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, marca o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarProductos}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {esAdmin && (
            <button
              onClick={abrirFormularioNuevo}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Nuevo producto
            </button>
          )}
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {productoEditando ? 'Editar producto' : 'Nuevo producto'}
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
                <label className="block text-sm text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  value={formulario.precio}
                  onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Categoría</label>
                <select
                  value={formulario.id_categoria}
                  onChange={(e) => setFormulario({ ...formulario, id_categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Marca</label>
                <select
                  value={formulario.id_marca}
                  onChange={(e) => setFormulario({ ...formulario, id_marca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {marcas.map((m) => (
                    <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
                <select
                  value={formulario.id_proveedor}
                  onChange={(e) => setFormulario({ ...formulario, id_proveedor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {proveedores.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock inicial</label>
                <input
                  type="number"
                  value={formulario.stock}
                  onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock mínimo</label>
                <input
                  type="number"
                  value={formulario.stock_minimo}
                  onChange={(e) => setFormulario({ ...formulario, stock_minimo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={guardarProducto}
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
                <th className="text-left px-4 py-3 text-gray-600">Categoría</th>
                <th className="text-left px-4 py-3 text-gray-600">Marca</th>
                <th className="text-left px-4 py-3 text-gray-600">Precio</th>
                <th className="text-left px-4 py-3 text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 text-gray-600">Estado</th>
                {esAdmin && (
                  <th className="text-left px-4 py-3 text-gray-600">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{producto.nombre}</td>
                  <td className="px-4 py-3">{producto.categoria}</td>
                  <td className="px-4 py-3">{producto.marca}</td>
                  <td className="px-4 py-3">${Number(producto.precio).toLocaleString()}</td>
                  <td className="px-4 py-3">{producto.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${
                      producto.estado_stock === 'BAJO' ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {producto.estado_stock}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => abrirFormularioEditar(producto)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id_producto)}
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

export default Productos;