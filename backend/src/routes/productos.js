













// Rutas para gestionar los productos de la tienda
import express from 'express';
import pool from '../config/db.js';
import verificarToken from '../middleware/auth.js';
import verificarRol from '../middleware/roles.js';

const router = express.Router();

// GET /api/productos - obtener todos los productos con su categoria, marca e inventario
router.get('/', verificarToken, async (req, res) => {
  try {
    const [productos] = await pool.query(
      `SELECT p.id_producto, p.nombre, p.descripcion, p.precio,
              c.nombre AS categoria, m.nombre AS marca,
              pr.nombre AS proveedor, i.stock, i.stock_minimo,
              CASE WHEN i.stock <= i.stock_minimo THEN 'BAJO' ELSE 'OK' END AS estado_stock,
              p.activo
       FROM productos p
       JOIN categorias c  ON c.id_categoria = p.id_categoria
       JOIN marcas m      ON m.id_marca = p.id_marca
       JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
       JOIN inventario i  ON i.id_producto = p.id_producto
       ORDER BY p.nombre`
    );
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
});

// GET /api/productos/:id - obtener un producto por su id
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [filas] = await pool.query(
      `SELECT p.id_producto, p.nombre, p.descripcion, p.precio,
              c.nombre AS categoria, m.nombre AS marca,
              pr.nombre AS proveedor, i.stock, i.stock_minimo
       FROM productos p
       JOIN categorias c   ON c.id_categoria = p.id_categoria
       JOIN marcas m       ON m.id_marca = p.id_marca
       JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
       JOIN inventario i   ON i.id_producto = p.id_producto
       WHERE p.id_producto = ?`,
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json(filas[0]);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el producto' });
  }
});

// POST /api/productos - crear un producto (solo admin)
router.post('/', verificarToken, verificarRol('admin'), async (req, res) => {
  const { nombre, descripcion, precio, id_categoria, id_marca, id_proveedor, stock, stock_minimo } = req.body;

  // Verificamos que vengan los datos obligatorios
  if (!nombre || !precio || !id_categoria || !id_marca || !id_proveedor) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    // Insertamos el producto
    const [resultado] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, id_categoria, id_marca, id_proveedor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, id_categoria, id_marca, id_proveedor]
    );

    // Insertamos el inventario inicial del producto
    await pool.query(
      `INSERT INTO inventario (id_producto, stock, stock_minimo, ultima_entrada)
       VALUES (?, ?, ?, NOW())`,
      [resultado.insertId, stock || 0, stock_minimo || 5]
    );

    return res.status(201).json({ 
      mensaje: 'Producto creado exitosamente',
      id: resultado.insertId 
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
});

// PUT /api/productos/:id - actualizar un producto (solo admin)
router.put('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, id_categoria, id_marca, id_proveedor, activo } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio = ?, 
           id_categoria = ?, id_marca = ?, id_proveedor = ?, activo = ?
       WHERE id_producto = ?`,
      [nombre, descripcion, precio, id_categoria, id_marca, id_proveedor, activo, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Producto actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// DELETE /api/productos/:id - eliminar un producto (solo admin)
router.delete('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    // En vez de borrar físicamente, desactivamos el producto
    const [resultado] = await pool.query(
      `UPDATE productos SET activo = 0 WHERE id_producto = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// GET /api/productos/buscar/:termino - buscar productos por nombre, marca o categoria
router.get('/buscar/:termino', verificarToken, async (req, res) => {
  const { termino } = req.params;
  try {
    const [productos] = await pool.query(
      `SELECT p.id_producto, p.nombre, p.descripcion, p.precio,
              c.nombre AS categoria, m.nombre AS marca, i.stock
       FROM productos p
       JOIN categorias c ON c.id_categoria = p.id_categoria
       JOIN marcas m     ON m.id_marca = p.id_marca
       JOIN inventario i ON i.id_producto = p.id_producto
       WHERE p.activo = 1
       AND (p.nombre LIKE ? OR c.nombre LIKE ? OR m.nombre LIKE ?)
       ORDER BY p.nombre`,
      [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al buscar productos' });
  }
});

export default router;








