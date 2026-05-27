// Importamos mysql2 para conectarnos a la base de datos
import mysql from 'mysql2/promise';
import symbols from 'log-symbols';
import { config } from './env.js';

// Creamos un pool de conexiones
// Un pool reutiliza conexiones en vez de abrir una nueva cada vez
const pool = mysql.createPool({
  host:     config.db.host,
  user:     config.db.usuario,
  password: config.db.password,
  database: config.db.nombre,
  waitForConnections: true,
  connectionLimit: 10, }); // máximo 10 conexiones simultáneas


// Verificamos que la conexión funcione al arrancar
const probarConexion = async () => {
  try {
    const conexion = await pool.getConnection();
    console.log(symbols.success, 'Conexión a la base de datos exitosa');
    conexion.release(); // liberamos la conexión al pool
  } catch (error) {
    console.error(symbols.error, 'Error conectando a la base de datos:', error.message);
    process.exit(1);}}; // si no hay BD, el sistema no debe arrancar
  

probarConexion();

export default pool;