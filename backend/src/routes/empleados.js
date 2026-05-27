









// Rutas para gestionar los empleados de la tienda
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';
import verificarRol from '../middleware/roles.js';

const router = express.Router();

// GET /api/empleados - obtener todos los empleados
router.get('/', verificarToken, async (req, res) => {
  try {
    const [empleados] = await pool.query(
      `SELECT e.id_empleado, e.nombre, e.apellido, e.edad,
              e.cargo, e.fecha_contrato, e.salario, e.ciudad,
              e.activo, u.email AS usuario_email, r.nombre AS rol
       FROM empleados e
       LEFT JOIN usuarios u ON u.id_usuario = e.id_usuario
       LEFT JOIN roles r    ON r.id_rol = u.id_rol
       ORDER BY e.nombre`
    );return res.status(200).json(empleados);} catch (error) {return res.status(500).json({ mensaje: 'Error al obtener los empleados' });}});


// GET /api/empleados/buscar/:termino - buscar empleados por nombre, apellido o cargo
router.get('/buscar/:termino', verificarToken, async (req, res) => {
  const { termino } = req.params;
  try {
    const [empleados] = await pool.query(
      `SELECT id_empleado, nombre, apellido, cargo, ciudad
       FROM empleados
       WHERE activo = 1
       AND (nombre LIKE ? OR apellido LIKE ? OR cargo LIKE ?)
       ORDER BY nombre`,
      [`%${termino}%`, `%${termino}%`, `%${termino}%`]);return res.status(200).json(empleados);} catch (error) {return res.status(500).json({ mensaje: 'Error al buscar empleados' });}});


// GET /api/empleados/:id - obtener un empleado por su id
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [filas] = await pool.query(
      `SELECT e.id_empleado, e.nombre, e.apellido, e.edad,
              e.cargo, e.fecha_contrato, e.salario, e.ciudad, e.activo
       FROM empleados e
       WHERE e.id_empleado = ?`,
      [id]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }return res.status(200).json(filas[0]);} catch (error) {return res.status(500).json({ mensaje: 'Error al obtener el empleado' });}});



// POST /api/empleados - crear un empleado (solo admin)
router.post('/', verificarToken, verificarRol('admin'), async (req, res) => {
  const { nombre, apellido, edad, cargo, fecha_contrato, salario, ciudad } = req.body;

  // Verificamos que vengan los datos obligatorios
  if (!nombre || !apellido || !cargo || !fecha_contrato || !salario) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO empleados (nombre, apellido, edad, cargo, fecha_contrato, salario, ciudad)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, edad, cargo, fecha_contrato, salario, ciudad]
    );

    return res.status(201).json({ 
      mensaje: 'Empleado creado exitosamente',
      id: resultado.insertId 
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear el empleado' });}});

// PUT /api/empleados/:id - actualizar un empleado (solo admin)
router.put('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, cargo, fecha_contrato, salario, ciudad, activo } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE empleados
       SET nombre = ?, apellido = ?, edad = ?, cargo = ?,
           fecha_contrato = ?, salario = ?, ciudad = ?, activo = ?
       WHERE id_empleado = ?`,
      [nombre, apellido, edad, cargo, fecha_contrato, salario, ciudad, activo, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Empleado actualizado exitosamente' });} catch (error) {return res.status(500).json({ mensaje: 'Error al actualizar el empleado' });}});

// DELETE /api/empleados/:id - desactivar un empleado (solo admin)
router.delete('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    // Desactivamos en vez de borrar para conservar el historial de ventas
    const [resultado] = await pool.query(
      `UPDATE empleados SET activo = 0 WHERE id_empleado = ?`,
      [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });}return res.status(200).json({ mensaje: 'Empleado eliminado exitosamente' });
    } catch (error) {return res.status(500).json({ mensaje: 'Error al eliminar el empleado' });}});

export default router;