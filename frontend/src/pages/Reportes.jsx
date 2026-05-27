// Página de reportes usando las vistas de la base de datos
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Reportes = () => {
  const navigate = useNavigate();

  const [reporteActivo, setReporteActivo] = useState('productos');
  const [datos, setDatos]                 = useState([]);
  const [cargando, setCargando]           = useState(false);
  const [mensaje, setMensaje]             = useState('');

  useEffect(() => {
    cargarReporte(reporteActivo);
  }, [reporteActivo]);

  const cargarReporte = async (tipo) => {
    setCargando(true);
    setMensaje('');
    try {
      const respuesta = await api.get(`/reportes/${tipo}`);
      setDatos(respuesta.data);
    } catch (error) {
      setMensaje('Error al cargar el reporte');
    } finally {
      setCargando(false);
    }
  };

  const reportes = [
    { id: 'productos',           label: 'Productos disponibles' },
    { id: 'stock-bajo',          label: 'Stock bajo'            },
    { id: 'ventas',              label: 'Ventas'                },
    { id: 'ventas-por-empleado', label: 'Ventas por empleado'   },
    { id: 'clientes',            label: 'Clientes'              },
    { id: 'detalle-ventas',      label: 'Detalle de ventas'     },
  ];

  const columnas = datos.length > 0 ? Object.keys(datos[0]) : [];

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h2>

        {mensaje && (
          <div className="border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 text-sm">
            {mensaje}
          </div>
        )}

        {/* Botones para seleccionar el reporte */}
        <div className="flex flex-wrap gap-3 mb-6">
          {reportes.map((r) => (
            <button
              key={r.id}
              onClick={() => setReporteActivo(r.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                reporteActivo === r.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Tabla de resultados */}
        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {columnas.map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-gray-600 capitalize">
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {columnas.map((col) => (
                      <td key={col} className="px-4 py-3">
                        {typeof fila[col] === 'number' && fila[col] > 999
                          ? `$${Number(fila[col]).toLocaleString()}`
                          : fila[col] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {datos.length === 0 && (
              <p className="text-center text-gray-400 py-8">No hay datos para mostrar</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;