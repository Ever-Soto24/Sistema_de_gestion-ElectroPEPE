// Rutas para gestionar los clientes de la tienda
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';
import verificarRol from '../middleware/roles.js';

const router = express.Router();

// GET /api/clientes - obtener todos los clientes
router.get('/', verificarToken, async (req, res) => {
  try {
    const [clientes] = await pool.query(
      `SELECT id_cliente, nombre, apellido, telefono, 
              email, ciudad, limite_credito, activo, creado_en
       FROM clientes
       ORDER BY nombre`
    );
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los clientes' });
  }
});

// GET /api/clientes/:id - obtener un cliente por su id
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [filas] = await pool.query(
      `SELECT id_cliente, nombre, apellido, telefono,
              email, ciudad, limite_credito, activo, creado_en
       FROM clientes
       WHERE id_cliente = ?`,
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.status(200).json(filas[0]);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el cliente' });
  }
});

// GET /api/clientes/buscar/:termino - buscar clientes por nombre, apellido o ciudad
router.get('/buscar/:termino', verificarToken, async (req, res) => {
  const { termino } = req.params;
  try {
    const [clientes] = await pool.query(
      `SELECT id_cliente, nombre, apellido, telefono, email, ciudad
       FROM clientes
       WHERE activo = 1
       AND (nombre LIKE ? OR apellido LIKE ? OR ciudad LIKE ?)
       ORDER BY nombre`,
      [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al buscar clientes' });
  }
});

// POST /api/clientes - crear un cliente (solo admin)
router.post('/', verificarToken, verificarRol('admin'), async (req, res) => {
  const { nombre, apellido, telefono, email, ciudad, limite_credito } = req.body;

  // Verificamos que vengan los datos obligatorios
  if (!nombre || !apellido) {
    return res.status(400).json({ mensaje: 'Nombre y apellido son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO clientes (nombre, apellido, telefono, email, ciudad, limite_credito)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, email, ciudad, limite_credito || 0]
    );

    return res.status(201).json({ 
      mensaje: 'Cliente creado exitosamente',
      id: resultado.insertId 
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear el cliente' });
  }
});

// PUT /api/clientes/:id - actualizar un cliente (solo admin)
router.put('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, email, ciudad, limite_credito, activo } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE clientes
       SET nombre = ?, apellido = ?, telefono = ?, 
           email = ?, ciudad = ?, limite_credito = ?, activo = ?
       WHERE id_cliente = ?`,
      [nombre, apellido, telefono, email, ciudad, limite_credito, activo, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Cliente actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
  }
});

// DELETE /api/clientes/:id - desactivar un cliente (solo admin)
router.delete('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    // Desactivamos en vez de borrar para no perder el historial de ventas
    const [resultado] = await pool.query(
      `UPDATE clientes SET activo = 0 WHERE id_cliente = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el cliente' });
  }
});

export default router;