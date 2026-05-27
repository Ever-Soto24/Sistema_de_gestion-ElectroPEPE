// Este middleware verifica que el usuario tenga el rol necesario
// Se usa después de verificarToken en las rutas que solo el admin puede usar
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // req.usuario viene del middleware verificarToken
    const rolUsuario = req.usuario.rol;

    // Verificamos si el rol del usuario está entre los permitidos
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permisos para realizar esta acción' 
      });
    }

    next(); // el rol es válido, continuamos
  };
};

export default verificarRol;