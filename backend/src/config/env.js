






// Cargamos las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();

// Exportamos las variables para usarlas en toda la aplicación
export const config = {
  puerto: process.env.PORT || 3000,
  db: {
    host:     process.env.DB_HOST,
    usuario:  process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    nombre:   process.env.DB_NAME,
  },
  jwt: {
    secreto:  process.env.JWT_SECRET,
    expira:   process.env.JWT_EXPIRES_IN,
  }
};