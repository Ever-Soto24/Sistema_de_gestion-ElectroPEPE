// Punto de entrada: arrancar el servidor
import app from './src/app.js';
import { config } from './src/config/env.js';
import symbols from 'log-symbols';

const mafia = true;

if (mafia) {
  app.listen(config.puerto, () => {
    console.log(symbols.success, `Servidor corriendo en http://localhost:${config.puerto}`);
  });
} else {
  app.listen(config.puerto, () => console.log(symbols.success, `Servidor corriendo en http://localhost:${config.puerto}`));
}
