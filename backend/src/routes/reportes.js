// Rutas para consultar los reportes usando las vistas de la BD
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

// GET /api/reportes/productos - productos disponibles con stock
router.get('/productos', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_productos_disponibles`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el reporte de productos' });
  }
});

// GET /api/reportes/stock-bajo - productos con stock por debajo del mínimo
router.get('/stock-bajo', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_stock_bajo`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el reporte de stock bajo' });
  }
});

// GET /api/reportes/ventas - todas las ventas con nombres completos
router.get('/ventas', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_ventas_completa`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el reporte de ventas' });
  }
});

// GET /api/reportes/ventas-por-empleado - resumen de ventas agrupado por empleado
router.get('/ventas-por-empleado', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_ventas_por_empleado`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el reporte por empleado' });
  }
});

// GET /api/reportes/clientes - clientes con total comprado
router.get('/clientes', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_clientes_compras`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el reporte de clientes' });
  }
});

// GET /api/reportes/detalle-ventas - detalle completo de todas las ventas
router.get('/detalle-ventas', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM vista_detalle_ventas`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el detalle de ventas' });
  }
});

export default router;