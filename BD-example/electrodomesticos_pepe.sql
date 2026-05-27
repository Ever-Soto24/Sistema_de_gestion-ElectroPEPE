-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-05-2026 a las 18:46:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `electrodomesticos_pepe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Refrigeración', 'Neveras y congeladores'),
(2, 'Lavado', 'Lavadoras y secadoras'),
(3, 'Cocina', 'Estufas, hornos y microondas'),
(4, 'Climatización', 'Aires acondicionados y ventiladores'),
(5, 'Televisión', 'Televisores y pantallas'),
(6, 'Audio', 'Equipos de sonido y parlantes'),
(7, 'Pequeños', 'Licuadoras, planchas y similares');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `apellido` varchar(80) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ciudad` varchar(80) DEFAULT NULL,
  `limite_credito` decimal(12,2) NOT NULL DEFAULT 0.00,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `telefono`, `email`, `ciudad`, `limite_credito`, `activo`, `creado_en`) VALUES
(1, 'Pedro', 'R.', '3000000010', 'cliente1@ficticio.co', 'Barranquilla', 5000000.00, 1, '2026-05-22 22:18:28'),
(2, 'Luisa', 'M.', '3000000011', 'cliente2@ficticio.co', 'Barranquilla', 3000000.00, 1, '2026-05-22 22:18:28'),
(3, 'Fernando', 'C.', '3000000012', 'cliente3@ficticio.co', 'Cartagena', 4000000.00, 1, '2026-05-22 22:18:28'),
(4, 'Diana', 'S.', '3000000013', 'cliente4@ficticio.co', 'Barranquilla', 2000000.00, 1, '2026-05-22 22:18:28'),
(5, 'Ricardo', 'P.', '3000000014', 'cliente5@ficticio.co', 'Bogotá', 6000000.00, 1, '2026-05-22 22:18:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id_detalle`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 11, 1, 2890000.00),
(2, 1, 16, 1, 420000.00),
(3, 2, 18, 1, 2400000.00),
(4, 3, 13, 1, 1950000.00),
(5, 3, 19, 2, 280000.00),
(6, 4, 18, 1, 1350000.00),
(7, 5, 17, 1, 2100000.00),
(8, 5, 20, 1, 180000.00);

--
-- Disparadores `detalle_ventas`
--
DELIMITER $$
CREATE TRIGGER `trg_actualizar_total` AFTER INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
  UPDATE ventas
  SET total = (
    SELECT SUM(subtotal)
    FROM detalle_ventas
    WHERE id_venta = NEW.id_venta
  )
  WHERE id_venta = NEW.id_venta;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_descontar_stock` AFTER INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
  UPDATE inventario
  SET stock = stock - NEW.cantidad,
      ultima_entrada = CURRENT_TIMESTAMP
  WHERE id_producto = NEW.id_producto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `apellido` varchar(80) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `cargo` varchar(60) NOT NULL,
  `fecha_contrato` date NOT NULL,
  `salario` decimal(12,2) NOT NULL,
  `ciudad` varchar(80) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `nombre`, `apellido`, `edad`, `cargo`, `fecha_contrato`, `salario`, `ciudad`, `id_usuario`, `activo`) VALUES
(1, 'Carlos', 'M.', 35, 'Gerente de Ventas', '2018-03-01', 4500000.00, 'Barranquilla', 1, 1),
(2, 'Valentina', 'T.', 28, 'Vendedor', '2020-06-15', 2200000.00, 'Barranquilla', NULL, 1),
(3, 'Jorge', 'H.', 32, 'Vendedor', '2019-11-10', 2200000.00, 'Barranquilla', NULL, 1),
(4, 'María', 'L.', 26, 'Cajero', '2021-02-20', 1800000.00, 'Barranquilla', NULL, 1),
(5, 'Andrés', 'G.', 30, 'Técnico', '2020-08-05', 2500000.00, 'Barranquilla', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 5,
  `ultima_entrada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `stock`, `stock_minimo`, `ultima_entrada`) VALUES
(11, 11, 14, 3, '2026-05-22 22:20:18'),
(12, 12, 8, 3, '2026-05-22 22:17:29'),
(13, 13, 19, 5, '2026-05-22 22:20:18'),
(14, 14, 6, 2, '2026-05-22 22:17:29'),
(15, 15, 10, 3, '2026-05-22 22:17:29'),
(16, 16, 11, 3, '2026-05-22 22:20:18'),
(17, 17, 8, 4, '2026-05-22 22:20:18'),
(18, 18, 23, 5, '2026-05-22 22:20:18'),
(19, 19, 28, 5, '2026-05-22 22:20:18'),
(20, 20, 39, 8, '2026-05-22 22:20:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `id_marca` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `pais_origen` varchar(60) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id_marca`, `nombre`, `pais_origen`, `activa`) VALUES
(1, 'Samsung', 'Corea del Sur', 1),
(2, 'LG', 'Corea del Sur', 1),
(3, 'Whirlpool', 'Estados Unidos', 1),
(4, 'Haceb', 'Colombia', 1),
(5, 'Mabe', 'México', 1),
(6, 'Sony', 'Japón', 1),
(7, 'Panasonic', 'Japón', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_marca` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `id_categoria`, `id_marca`, `id_proveedor`, `activo`, `creado_en`) VALUES
(11, 'Nevera No Frost 400L', 'Dos puertas con dispensador', 2890000.00, 1, 1, 1, 1, '2026-05-22 22:15:07'),
(12, 'Nevera Una Puerta 250L', 'Compacta para apartamento', 1450000.00, 1, 4, 1, 1, '2026-05-22 22:15:07'),
(13, 'Lavadora Carga Frontal 18kg', 'Inverter con 14 programas', 1950000.00, 2, 2, 1, 1, '2026-05-22 22:15:07'),
(14, 'Lavadora Carga Superior 14kg', 'Digital con 8 programas', 1200000.00, 2, 5, 1, 1, '2026-05-22 22:15:07'),
(15, 'Estufa 4 Puestos a Gas', 'Encendido eléctrico con horno', 890000.00, 3, 4, 3, 1, '2026-05-22 22:15:07'),
(16, 'Horno Microondas 28L', 'Digital con grill y convección', 420000.00, 3, 5, 3, 1, '2026-05-22 22:15:07'),
(17, 'Aire Acondicionado 18000BTU', 'Minisplit inverter frío/calor', 2100000.00, 4, 1, 2, 1, '2026-05-22 22:15:07'),
(18, 'Televisor Smart 55\"', 'TV 4K UHD con control de voz', 2400000.00, 5, 2, 2, 1, '2026-05-22 22:15:07'),
(19, 'Licuadora 1000W', '5 velocidades vaso de vidrio', 280000.00, 7, 4, 1, 1, '2026-05-22 22:15:07'),
(20, 'Plancha Eléctrica', 'Suela cerámica antiadherente', 180000.00, 7, 7, 3, 1, '2026-05-22 22:15:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(80) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ciudad` varchar(80) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `contacto`, `telefono`, `email`, `ciudad`, `activo`) VALUES
(1, 'Distribuidora Caribe S.A.S', 'Luis P.', '3000000001', 'proveedor1@ficticio.co', 'Barranquilla', 1),
(2, 'Importaciones Tech Ltda', 'Ana R.', '3000000002', 'proveedor2@ficticio.co', 'Medellín', 1),
(3, 'ElectroDistribuciones S.A.', 'Carlos M.', '3000000003', 'proveedor3@ficticio.co', 'Bogotá', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'Acceso total: CRUD, reportes, usuarios'),
(2, 'consulta', 'Solo lectura: consultas y reportes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `ultimo_login` datetime DEFAULT NULL,
  `intentos_fallidos` int(11) NOT NULL DEFAULT 0,
  `bloqueado_hasta` datetime DEFAULT NULL,
  `token_reset` varchar(255) DEFAULT NULL,
  `token_expira` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password_hash`, `id_rol`, `activo`, `creado_en`, `ultimo_login`, `intentos_fallidos`, `bloqueado_hasta`, `token_reset`, `token_expira`) VALUES
(1, 'Admin P.', 'admin@tcc.com', '$2b$12$mpH32kqiFq/DYmWeUeDANuj6L/3RtXt6EahRB.G57ghQ1ksqNSFwy', 1, 1, '2026-05-22 22:18:27', '2026-05-26 17:10:09', 0, NULL, NULL, NULL),
(2, 'Consulta R.', 'consulta@tcc.com', '$2b$12$mpH32kqiFq/DYmWeUeDANuj6L/3RtXt6EahRB.G57ghQ1ksqNSFwy', 2, 1, '2026-05-22 22:18:27', NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `fecha_venta` datetime NOT NULL DEFAULT current_timestamp(),
  `id_cliente` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estado` enum('pendiente','completada','anulada') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `fecha_venta`, `id_cliente`, `id_empleado`, `total`, `estado`) VALUES
(1, '2025-01-10 10:30:00', 1, 2, 3310000.00, 'completada'),
(2, '2025-01-15 14:00:00', 2, 3, 2400000.00, 'completada'),
(3, '2025-02-03 09:15:00', 3, 2, 2510000.00, 'completada'),
(4, '2025-02-20 16:45:00', 4, 3, 1350000.00, 'completada'),
(5, '2025-03-05 11:00:00', 5, 2, 2280000.00, 'completada');

--
-- Disparadores `ventas`
--
DELIMITER $$
CREATE TRIGGER `trg_devolver_stock` AFTER UPDATE ON `ventas` FOR EACH ROW BEGIN
  IF NEW.estado = 'anulada' AND OLD.estado != 'anulada' THEN
    UPDATE inventario i
    JOIN detalle_ventas d ON d.id_producto = i.id_producto
    SET i.stock = i.stock + d.cantidad
    WHERE d.id_venta = NEW.id_venta;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_clientes_compras`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_clientes_compras` (
`id_cliente` int(11)
,`cliente` varchar(161)
,`telefono` varchar(20)
,`email` varchar(100)
,`limite_credito` decimal(12,2)
,`num_compras` bigint(21)
,`total_comprado` decimal(34,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_detalle_ventas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_detalle_ventas` (
`id_detalle` int(11)
,`id_venta` int(11)
,`fecha_venta` datetime
,`cliente` varchar(161)
,`producto` varchar(120)
,`marca` varchar(80)
,`cantidad` int(11)
,`precio_unitario` decimal(12,2)
,`subtotal` decimal(12,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_productos_disponibles`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_productos_disponibles` (
`id_producto` int(11)
,`producto` varchar(120)
,`categoria` varchar(80)
,`marca` varchar(80)
,`precio` decimal(12,2)
,`stock` int(11)
,`stock_minimo` int(11)
,`estado_stock` varchar(4)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_stock_bajo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_stock_bajo` (
`id_producto` int(11)
,`producto` varchar(120)
,`marca` varchar(80)
,`stock` int(11)
,`stock_minimo` int(11)
,`proveedor` varchar(100)
,`telefono_proveedor` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_ventas_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_ventas_completa` (
`id_venta` int(11)
,`fecha_venta` datetime
,`cliente` varchar(161)
,`vendedor` varchar(161)
,`total` decimal(12,2)
,`estado` enum('pendiente','completada','anulada')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_ventas_por_empleado`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_ventas_por_empleado` (
`id_empleado` int(11)
,`empleado` varchar(161)
,`cargo` varchar(60)
,`total_ventas` bigint(21)
,`monto_total` decimal(34,2)
,`promedio_venta` decimal(16,6)
,`venta_maxima` decimal(12,2)
,`venta_minima` decimal(12,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_clientes_compras`
--
DROP TABLE IF EXISTS `vista_clientes_compras`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_clientes_compras`  AS SELECT `c`.`id_cliente` AS `id_cliente`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente`, `c`.`telefono` AS `telefono`, `c`.`email` AS `email`, `c`.`limite_credito` AS `limite_credito`, count(`v`.`id_venta`) AS `num_compras`, coalesce(sum(`v`.`total`),0) AS `total_comprado` FROM (`clientes` `c` left join `ventas` `v` on(`v`.`id_cliente` = `c`.`id_cliente` and `v`.`estado` = 'completada')) GROUP BY `c`.`id_cliente`, `c`.`nombre`, `c`.`apellido`, `c`.`telefono`, `c`.`email`, `c`.`limite_credito` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_detalle_ventas`
--
DROP TABLE IF EXISTS `vista_detalle_ventas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_detalle_ventas`  AS SELECT `dv`.`id_detalle` AS `id_detalle`, `v`.`id_venta` AS `id_venta`, `v`.`fecha_venta` AS `fecha_venta`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente`, `p`.`nombre` AS `producto`, `m`.`nombre` AS `marca`, `dv`.`cantidad` AS `cantidad`, `dv`.`precio_unitario` AS `precio_unitario`, `dv`.`subtotal` AS `subtotal` FROM ((((`detalle_ventas` `dv` join `ventas` `v` on(`v`.`id_venta` = `dv`.`id_venta`)) join `clientes` `c` on(`c`.`id_cliente` = `v`.`id_cliente`)) join `productos` `p` on(`p`.`id_producto` = `dv`.`id_producto`)) join `marcas` `m` on(`m`.`id_marca` = `p`.`id_marca`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_productos_disponibles`
--
DROP TABLE IF EXISTS `vista_productos_disponibles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_productos_disponibles`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `producto`, `c`.`nombre` AS `categoria`, `m`.`nombre` AS `marca`, `p`.`precio` AS `precio`, `i`.`stock` AS `stock`, `i`.`stock_minimo` AS `stock_minimo`, CASE WHEN `i`.`stock` <= `i`.`stock_minimo` THEN 'BAJO' ELSE 'OK' END AS `estado_stock` FROM (((`productos` `p` join `categorias` `c` on(`c`.`id_categoria` = `p`.`id_categoria`)) join `marcas` `m` on(`m`.`id_marca` = `p`.`id_marca`)) join `inventario` `i` on(`i`.`id_producto` = `p`.`id_producto`)) WHERE `p`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_stock_bajo`
--
DROP TABLE IF EXISTS `vista_stock_bajo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_stock_bajo`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `producto`, `m`.`nombre` AS `marca`, `i`.`stock` AS `stock`, `i`.`stock_minimo` AS `stock_minimo`, `pr`.`nombre` AS `proveedor`, `pr`.`telefono` AS `telefono_proveedor` FROM (((`inventario` `i` join `productos` `p` on(`p`.`id_producto` = `i`.`id_producto`)) join `marcas` `m` on(`m`.`id_marca` = `p`.`id_marca`)) join `proveedores` `pr` on(`pr`.`id_proveedor` = `p`.`id_proveedor`)) WHERE `i`.`stock` <= `i`.`stock_minimo` AND `p`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_ventas_completa`
--
DROP TABLE IF EXISTS `vista_ventas_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_ventas_completa`  AS SELECT `v`.`id_venta` AS `id_venta`, `v`.`fecha_venta` AS `fecha_venta`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente`, concat(`e`.`nombre`,' ',`e`.`apellido`) AS `vendedor`, `v`.`total` AS `total`, `v`.`estado` AS `estado` FROM ((`ventas` `v` join `clientes` `c` on(`c`.`id_cliente` = `v`.`id_cliente`)) join `empleados` `e` on(`e`.`id_empleado` = `v`.`id_empleado`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_ventas_por_empleado`
--
DROP TABLE IF EXISTS `vista_ventas_por_empleado`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_ventas_por_empleado`  AS SELECT `e`.`id_empleado` AS `id_empleado`, concat(`e`.`nombre`,' ',`e`.`apellido`) AS `empleado`, `e`.`cargo` AS `cargo`, count(`v`.`id_venta`) AS `total_ventas`, sum(`v`.`total`) AS `monto_total`, avg(`v`.`total`) AS `promedio_venta`, max(`v`.`total`) AS `venta_maxima`, min(`v`.`total`) AS `venta_minima` FROM (`empleados` `e` left join `ventas` `v` on(`v`.`id_empleado` = `e`.`id_empleado` and `v`.`estado` = 'completada')) GROUP BY `e`.`id_empleado`, `e`.`nombre`, `e`.`apellido`, `e`.`cargo` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `idx_clientes_nombre` (`nombre`,`apellido`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `id_producto` (`id_producto`),
  ADD KEY `idx_inventario_stock` (`stock`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `idx_productos_nombre` (`nombre`),
  ADD KEY `idx_productos_categoria` (`id_categoria`),
  ADD KEY `idx_productos_marca` (`id_marca`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `idx_ventas_fecha` (`fecha_venta`),
  ADD KEY `idx_ventas_cliente` (`id_cliente`),
  ADD KEY `idx_ventas_empleado` (`id_empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
