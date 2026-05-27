// Rutas de autenticación: login y logout
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { config } from '../config/env.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificamos que vengan los datos necesarios
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  try {
    // Buscamos el usuario por email junto con su rol
    const [filas] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.password_hash, 
              u.activo, u.intentos_fallidos, u.bloqueado_hasta,
              r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.email = ?`,
      [email]
    );

    const usuario = filas[0];

    // Si no existe el usuario
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Si el usuario está inactivo
    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo, contacta al administrador' });
    }

    // Verificamos si está bloqueado por intentos fallidos
    if (usuario.bloqueado_hasta && new Date() < new Date(usuario.bloqueado_hasta)) {
      return res.status(401).json({ 
        mensaje: 'Usuario bloqueado temporalmente, intenta más tarde' 
      });
    }

    // Comparamos la contraseña con el hash guardado en la BD
    const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordCorrecta) {
      // Sumamos un intento fallido
      const intentos = usuario.intentos_fallidos + 1;
      
      // Si llega a 5 intentos, bloqueamos por 15 minutos
      const bloqueadoHasta = intentos >= 5 
        ? new Date(Date.now() + 15 * 60 * 1000) 
        : null;

      await pool.query(
        `UPDATE usuarios 
         SET intentos_fallidos = ?, bloqueado_hasta = ? 
         WHERE id_usuario = ?`,
        [intentos, bloqueadoHasta, usuario.id_usuario]
      );

      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Login exitoso: reseteamos los intentos fallidos
    await pool.query(
      `UPDATE usuarios 
       SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_login = NOW() 
       WHERE id_usuario = ?`,
      [usuario.id_usuario]
    );

    // Generamos el token JWT con los datos del usuario
    const token = jwt.sign(
      { 
        id:     usuario.id_usuario, 
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol 
      },
      config.jwt.secreto,
      { expiresIn: config.jwt.expira }
    );

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id:     usuario.id_usuario,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol
      }
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

export default router;