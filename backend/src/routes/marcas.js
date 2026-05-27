// Rutas para obtener las marcas (solo lectura, se usan en formularios)
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

// GET /api/marcas - obtener todas las marcas
router.get('/', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM marcas ORDER BY nombre`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las marcas' });
  }
});

export default router;