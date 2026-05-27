// Rutas para gestionar las ventas de la tienda
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';
import verificarRol from '../middleware/roles.js';

const router = express.Router();

// GET /api/ventas - obtener todas las ventas
router.get('/', verificarToken, async (req, res) => {
  try {
    const [ventas] = await pool.query(
      `SELECT v.id_venta, v.fecha_venta,
              CONCAT(c.nombre, ' ', c.apellido) AS cliente,
              CONCAT(e.nombre, ' ', e.apellido) AS vendedor,
              v.total, v.estado
       FROM ventas v
       JOIN clientes c  ON c.id_cliente = v.id_cliente
       JOIN empleados e ON e.id_empleado = v.id_empleado
       ORDER BY v.fecha_venta DESC`
    );
    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las ventas' });
  }
});

// GET /api/ventas/:id - obtener una venta con su detalle completo
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Obtenemos la cabecera de la venta
    const [filas] = await pool.query(
      `SELECT v.id_venta, v.fecha_venta,
              CONCAT(c.nombre, ' ', c.apellido) AS cliente,
              CONCAT(e.nombre, ' ', e.apellido) AS vendedor,
              v.total, v.estado
       FROM ventas v
       JOIN clientes c  ON c.id_cliente = v.id_cliente
       JOIN empleados e ON e.id_empleado = v.id_empleado
       WHERE v.id_venta = ?`,
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    // Obtenemos el detalle de la venta
    const [detalle] = await pool.query(
      `SELECT dv.id_detalle, p.nombre AS producto,
              m.nombre AS marca, dv.cantidad,
              dv.precio_unitario, dv.subtotal
       FROM detalle_ventas dv
       JOIN productos p ON p.id_producto = dv.id_producto
       JOIN marcas m    ON m.id_marca = p.id_marca
       WHERE dv.id_venta = ?`,
      [id]
    );

    // Respondemos con la venta y su detalle juntos
    return res.status(200).json({ ...filas[0], detalle });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener la venta' });
  }
});

// POST /api/ventas - registrar una venta nueva (solo admin)
router.post('/', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id_cliente, id_empleado, productos } = req.body;

  // Verificamos que vengan los datos obligatorios
  if (!id_cliente || !id_empleado || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  // Usamos una conexión individual para manejar la transacción
  const conexion = await pool.getConnection();

  try {
    // Iniciamos la transacción: si algo falla, se revierte todo
    await conexion.beginTransaction();

    // Insertamos la cabecera de la venta
    const [venta] = await conexion.query(
      `INSERT INTO ventas (id_cliente, id_empleado, estado)
       VALUES (?, ?, 'completada')`,
      [id_cliente, id_empleado]
    );

    const idVenta = venta.insertId;

    // Insertamos cada producto del detalle
    // El trigger trg_descontar_stock descuenta el stock automáticamente
    // El trigger trg_actualizar_total actualiza el total automáticamente
    for (const item of productos) {
      await conexion.query(
        `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [idVenta, item.id_producto, item.cantidad, item.precio_unitario]
      );
    }

    // Confirmamos la transacción
    await conexion.commit();

    return res.status(201).json({ 
      mensaje: 'Venta registrada exitosamente',
      id: idVenta 
    });
  } catch (error) {
    // Si algo falla revertimos todo para no dejar datos a medias
    await conexion.rollback();
    return res.status(500).json({ mensaje: 'Error al registrar la venta' });
  } finally {
    // Siempre liberamos la conexión al pool
    conexion.release();
  }
});

// PUT /api/ventas/:id/anular - anular una venta (solo admin)
// El trigger trg_devolver_stock devuelve el stock automáticamente
router.put('/:id/anular', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query(
      `UPDATE ventas SET estado = 'anulada' WHERE id_venta = ? AND estado != 'anulada'`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Venta no encontrada o ya estaba anulada' });
    }

    return res.status(200).json({ mensaje: 'Venta anulada exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al anular la venta' });
  }
});

export default router;