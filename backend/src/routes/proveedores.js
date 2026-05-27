// Rutas para obtener los proveedores (solo lectura, se usan en formularios)
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

// GET /api/proveedores - obtener todos los proveedores
router.get('/', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM proveedores ORDER BY nombre`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los proveedores' });
  }
});

export default router;