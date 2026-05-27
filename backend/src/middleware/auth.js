// Este middleware verifica que el usuario esté autenticado
// Se ejecuta antes de cada ruta protegida
import jwt from 'jsonwebtoken';
import symbols from 'log-symbols';
import { config } from '../config/env.js';

const verificarToken = (req, res, next) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, rechazamos la petición
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // Verificamos que el token sea válido y no haya expirado
    const datos = jwt.verify(token, config.jwt.secreto);
    req.usuario = datos; // guardamos los datos del usuario en la petición
    next(); // continuamos a la ruta
  } catch (error) {
    console.error(symbols.error, 'Token inválido:', error.message);
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

export default verificarToken;