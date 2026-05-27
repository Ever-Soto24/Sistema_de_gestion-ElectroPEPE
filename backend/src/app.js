// Archivo principal de Express: configura middlewares y las rutas de la API
import express from 'express';
import cors from 'cors';

import authRoutes       from './routes/auth.js';
import productosRoutes  from './routes/productos.js';
import clientesRoutes   from './routes/clientes.js';
import empleadosRoutes  from './routes/empleados.js';
import ventasRoutes     from './routes/ventas.js';
import reportesRoutes   from './routes/reportes.js';
import categoriasRoutes from './routes/categorias.js';
import marcasRoutes     from './routes/marcas.js';
import proveedoresRoutes from './routes/proveedores.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Rutas de ventas y clientes
app.use('/api/ventas', ventasRoutes);
app.use('/api/clientes', clientesRoutes);

// Rutas de empleados, proveedores y categorías
app.use('/api/empleados', empleadosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/categorias', categoriasRoutes);

// Rutas de reportes
app.use('/api/reportes', reportesRoutes);

export default app;