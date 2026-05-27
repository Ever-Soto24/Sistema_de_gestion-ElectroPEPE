// Página para gestionar las ventas de la tienda
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Ventas = () => {
  const { esAdmin } = useAuth();
  const navigate = useNavigate();

  const [ventas, setVentas]                       = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaDetalle, setVentaDetalle]           = useState(null);
  const [mensaje, setMensaje]                     = useState('');
  const [clientes, setClientes]                   = useState([]);
  const [empleados, setEmpleados]                 = useState([]);
  const [productos, setProductos]                 = useState([]);

  const [formulario, setFormulario] = useState({
    id_cliente: '', id_empleado: '', productos: [],
  });

  const [itemActual, setItemActual] = useState({
    id_producto: '', cantidad: '', precio_unitario: '',
  });

  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  const obtenerVentas = async () => {
    try {
      const respuesta = await api.get('/ventas');
      setVentas(respuesta.data);
    } catch (error) {
      setMensaje('Error al obtener las ventas');
    }
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await api.get('/clientes');
      setClientes(respuesta.data);
    } catch (error) {
      console.log('Error al obtener clientes');
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await api.get('/empleados');
      setEmpleados(respuesta.data);
    } catch (error) {
      console.log('Error al obtener empleados');
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await api.get('/productos');
      setProductos(respuesta.data);
    } catch (error) {
      console.log('Error al obtener productos');
    }
  };

  const verDetalle = async (id) => {
    try {
      const respuesta = await api.get(`/ventas/${id}`);
      setVentaDetalle(respuesta.data);
    } catch (error) {
      setMensaje('Error al obtener el detalle');
    }
  };

  const agregarProducto = () => {
    if (!itemActual.id_producto || !itemActual.cantidad || !itemActual.precio_unitario) {
      alert('Completa todos los campos del producto');
      return;
    }
    const producto = productos.find(p => p.id_producto === parseInt(itemActual.id_producto));
    setFormulario({
      ...formulario,
      productos: [...formulario.productos, { ...itemActual, nombre: producto?.nombre }],
    });
    setItemActual({ id_producto: '', cantidad: '', precio_unitario: '' });
  };

  const quitarProducto = (index) => {
    const nuevos = formulario.productos.filter((_, i) => i !== index);
    setFormulario({ ...formulario, productos: nuevos });
  };

  const guardarVenta = async () => {
    if (!formulario.id_cliente || !formulario.id_empleado || formulario.productos.length === 0) {
      alert('Completa todos los campos y agrega al menos un producto');
      return;
    }
    try {
      await api.post('/ventas', formulario);
      setMensaje('Venta registrada');
      setMostrarFormulario(false);
      setFormulario({ id_cliente: '', id_empleado: '', productos: [] });
      obtenerVentas();
    } catch (error) {
      setMensaje('Error al registrar la venta');
    }
  };

  const anularVenta = async (id) => {
    if (!window.confirm('¿Anular esta venta?')) return;
    try {
      await api.put(`/ventas/${id}/anular`);
      setMensaje('Venta anulada');
      obtenerVentas();
    } catch (error) {
      setMensaje('Error al anular la venta');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ventas</h2>

        {mensaje && (
          <div className="border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 text-sm">
            {mensaje}
          </div>
        )}

        {esAdmin && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
          >
            Nueva venta
          </button>
        )}

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Nueva venta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cliente</label>
                <select
                  value={formulario.id_cliente}
                  onChange={(e) => setFormulario({ ...formulario, id_cliente: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Vendedor</label>
                <select
                  value={formulario.id_empleado}
                  onChange={(e) => setFormulario({ ...formulario, id_empleado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {empleados.map((e) => (
                    <option key={e.id_empleado} value={e.id_empleado}>
                      {e.nombre} {e.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-700 mb-2">Agregar productos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Producto</label>
                <select
                  value={itemActual.id_producto}
                  onChange={(e) => {
                    const prod = productos.find(p => p.id_producto === parseInt(e.target.value));
                    setItemActual({ ...itemActual, id_producto: e.target.value, precio_unitario: prod?.precio || '' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  value={itemActual.cantidad}
                  onChange={(e) => setItemActual({ ...itemActual, cantidad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Precio unitario</label>
                <input
                  type="number"
                  value={itemActual.precio_unitario}
                  onChange={(e) => setItemActual({ ...itemActual, precio_unitario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={agregarProducto}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm mb-4"
            >
              Agregar producto
            </button>

            {formulario.productos.length > 0 && (
              <table className="w-full text-sm mb-4 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-600">Producto</th>
                    <th className="text-left px-3 py-2 text-gray-600">Cantidad</th>
                    <th className="text-left px-3 py-2 text-gray-600">Precio</th>
                    <th className="text-left px-3 py-2 text-gray-600">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formulario.productos.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{item.nombre}</td>
                      <td className="px-3 py-2">{item.cantidad}</td>
                      <td className="px-3 py-2">${Number(item.precio_unitario).toLocaleString()}</td>
                      <td className="px-3 py-2">${(item.cantidad * item.precio_unitario).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => quitarProducto(index)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex gap-3">
              <button
                onClick={guardarVenta}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar venta
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

        {ventaDetalle && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalle venta #{ventaDetalle.id_venta}</h3>
              <button
                onClick={() => setVentaDetalle(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Cerrar
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">Cliente: {ventaDetalle.cliente}</p>
            <p className="text-sm text-gray-600 mb-1">Vendedor: {ventaDetalle.vendedor}</p>
            <p className="text-sm text-gray-600 mb-4">Total: ${Number(ventaDetalle.total).toLocaleString()}</p>
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-600">Producto</th>
                  <th className="text-left px-3 py-2 text-gray-600">Marca</th>
                  <th className="text-left px-3 py-2 text-gray-600">Cantidad</th>
                  <th className="text-left px-3 py-2 text-gray-600">Precio</th>
                  <th className="text-left px-3 py-2 text-gray-600">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventaDetalle.detalle?.map((item) => (
                  <tr key={item.id_detalle} className="border-t">
                    <td className="px-3 py-2">{item.producto}</td>
                    <td className="px-3 py-2">{item.marca}</td>
                    <td className="px-3 py-2">{item.cantidad}</td>
                    <td className="px-3 py-2">${Number(item.precio_unitario).toLocaleString()}</td>
                    <td className="px-3 py-2">${Number(item.subtotal).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">#</th>
                <th className="text-left px-4 py-3 text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-600">Vendedor</th>
                <th className="text-left px-4 py-3 text-gray-600">Total</th>
                <th className="text-left px-4 py-3 text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{venta.id_venta}</td>
                  <td className="px-4 py-3">{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{venta.cliente}</td>
                  <td className="px-4 py-3">{venta.vendedor}</td>
                  <td className="px-4 py-3">${Number(venta.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${
                      venta.estado === 'completada' ? 'text-blue-600' :
                      venta.estado === 'anulada'    ? 'text-gray-400' :
                                                      'text-gray-600'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => verDetalle(venta.id_venta)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Ver detalle
                    </button>
                    {esAdmin && venta.estado !== 'anulada' && (
                      <button
                        onClick={() => anularVenta(venta.id_venta)}
                        className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50"
                      >
                        Anular
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ventas;