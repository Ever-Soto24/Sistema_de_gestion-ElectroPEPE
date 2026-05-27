// Rutas para obtener las categorías (solo lectura, se usan en formularios)
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

// GET /api/categorias - obtener todas las categorías
router.get('/', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query(`SELECT * FROM categorias ORDER BY nombre`);
    return res.status(200).json(filas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las categorías' });
  }
});

export default router;





