-- ============================================================
-- BASE DE DATOS: rutas_buses (VERSIÓN CORREGIDA)
-- Correcciones aplicadas:
--   1. Paradas duplicadas (29-56) eliminadas
--   2. Rutas duplicadas (7-12) eliminadas
--   3. ruta_paradas duplicados eliminados
--   4. Contraseñas marcadas para usar hash (¡cambiar en producción!)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================================
-- TABLA: buses
-- ============================================================
CREATE TABLE `buses` (
  `id_bus` int(11) NOT NULL AUTO_INCREMENT,
  `numero_bus` varchar(20) DEFAULT NULL,
  `placa` varchar(20) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_bus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `buses` (`id_bus`, `numero_bus`, `placa`, `capacidad`) VALUES
(3, 'La Carolina',     'LC003', 35),
(4, 'Transmetro',      'TR004', 80),
(5, 'Boston - Boston', 'BB005', 30),
(6, 'Puerto Colombia', 'PC006', 40),
(7, 'Coolitoral',      'CL001', 40),
(8, 'Trasmecar',       'TM002', 40);

-- ============================================================
-- TABLA: rutas  (duplicados 7-12 eliminados)
-- ============================================================
CREATE TABLE `rutas` (
  `id_ruta` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_ruta` varchar(100) DEFAULT NULL,
  `origen` varchar(100) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `distancia_km` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_ruta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `rutas` (`id_ruta`, `nombre_ruta`, `origen`, `destino`, `distancia_km`) VALUES
(1, 'Ruta Coolitoral',      'Via 40',              'Carrera 76',               20.00),
(2, 'Ruta Trasmecar',       'Centro',              'Barrios del suroccidente', 18.00),
(3, 'Ruta La Carolina',     'Miramar',             'Carrera 71',               15.00),
(4, 'Ruta Transmetro',      'Portal de Soledad',   'Universidades',            22.00),
(5, 'Ruta Boston',          'Boston',              'Boston',                   14.00),
(6, 'Ruta Puerto Colombia', 'Centro Barranquilla', 'Puerto Colombia',          25.00);

-- ============================================================
-- TABLA: paradas  (duplicados 29-56 eliminados)
-- ============================================================
CREATE TABLE `paradas` (
  `id_parada` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_parada` varchar(100) DEFAULT NULL,
  `latitud` decimal(10,6) DEFAULT NULL,
  `longitud` decimal(10,6) DEFAULT NULL,
  PRIMARY KEY (`id_parada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `paradas` (`id_parada`, `nombre_parada`, `latitud`, `longitud`) VALUES
(1,  'Via 40',                       11.010000, -74.820000),
(2,  'Calle 72',                     10.990000, -74.800000),
(3,  'Carrera 38',                   10.980000, -74.795000),
(4,  'Centro Barranquilla',          10.968000, -74.781000),
(5,  'Calle 30',                     10.970000, -74.780000),
(6,  'Circunvalar',                  10.985000, -74.810000),
(7,  'Riomar',                       11.000000, -74.840000),
(8,  'Ciudad Jardin',                10.995000, -74.835000),
(9,  'Carrera 75',                   10.998000, -74.842000),
(10, 'Calle 84',                     11.002000, -74.845000),
(11, 'Carrera 76',                   11.004000, -74.846000),
(12, 'Soledad',                      10.910000, -74.770000),
(13, 'Terminal de Transportes',      10.975000, -74.780000),
(14, 'Universidad del Atlantico',    11.019000, -74.851000),
(15, 'Miramar',                      11.010000, -74.845000),
(16, 'Portal de Soledad',            10.905000, -74.760000),
(17, 'Estacion Joe Arroyo',          10.970000, -74.790000),
(18, 'Parque Cultural',              10.972000, -74.788000),
(19, 'Catedral',                     10.968000, -74.781000),
(20, 'Carrera 46',                   10.975000, -74.792000),
(21, 'Prado',                        10.980000, -74.795000),
(22, 'Alameda del Rio',              11.030000, -74.870000),
(23, 'Las Flores',                   11.050000, -74.880000),
(24, 'Boston',                       10.965000, -74.775000),
(25, 'Hospital Universidad del Norte', 11.015000, -74.850000),
(26, 'Carrera 21',                   10.960000, -74.770000),
(27, 'Puerto Colombia',              11.010000, -74.960000),
(28, 'Corredor Universitario',       11.020000, -74.870000);

-- ============================================================
-- TABLA: bus_ruta
-- ============================================================
CREATE TABLE `bus_ruta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bus` int(11) DEFAULT NULL,
  `id_ruta` int(11) DEFAULT NULL,
  `horario_salida` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bus` (`id_bus`),
  KEY `id_ruta` (`id_ruta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bus_ruta` (`id`, `id_bus`, `id_ruta`, `horario_salida`) VALUES
(1, 3, 3, '06:00:00'),
(2, 4, 4, '06:20:00'),
(3, 5, 5, '06:40:00'),
(4, 6, 6, '07:00:00'),
(5, 7, 7, '07:20:00'),
(6, 8, 8, '07:40:00');

-- ============================================================
-- TABLA: ruta_paradas  (duplicados eliminados)
-- ============================================================
CREATE TABLE `ruta_paradas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ruta` int(11) DEFAULT NULL,
  `id_parada` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_ruta` (`id_ruta`),
  KEY `id_parada` (`id_parada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ruta_paradas` (`id_ruta`, `id_parada`, `orden`) VALUES
-- Ruta 3: La Carolina
(3,  1,  1),(3,  2,  2),(3,  3,  3),(3,  4,  4),(3,  5,  5),
(3,  6,  6),(3,  7,  7),(3,  8,  8),(3,  9,  9),(3, 10, 10),(3, 11, 11),
-- Ruta 4: Transmetro
(4,  4,  1),(4,  5,  2),(4, 12,  3),(4, 13,  4),(4,  6,  5),(4,  3,  6),(4, 14,  7),
-- Ruta 5: Boston
(5, 15,  1),(5,  2,  2),(5,  3,  3),(5,  4,  4),(5,  6,  5),(5,  8,  6),(5, 10,  7),
-- Ruta 6: Puerto Colombia
(6, 16,  1),(6, 17,  2),(6, 18,  3),(6, 19,  4),(6, 20,  5),(6, 21,  6),(6, 22,  7),(6, 23,  8),
-- Ruta 7: Coolitoral
(7, 24,  1),(7,  4,  2),(7, 25,  3),(7,  5,  4),(7, 26,  5),(7, 24,  6),
-- Ruta 8: Trasmecar
(8,  4,  1),(8,  3,  2),(8,  2,  3),(8,  6,  4),(8, 28,  5),(8,  6,  6),(8, 27,  7);

-- ============================================================
-- TABLA: usuarios
-- ⚠️  IMPORTANTE: en producción usa password_hash() en PHP
--     nunca guardes contraseñas en texto plano
-- ============================================================
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo_usuario` enum('admin','usuario') DEFAULT 'usuario',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Contraseñas hasheadas con password_hash('123456', PASSWORD_BCRYPT)
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `password`, `tipo_usuario`, `fecha_registro`) VALUES
(1, 'Administrador', 'admin@buses.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',   '2026-03-13 19:28:35'),
(2, 'Juan Perez',    'juan@gmail.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario', '2026-03-13 19:28:35'),
(7, 'Maria Lopez',   'maria@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario', '2026-03-13 19:34:12'),
(8, 'Carlos Ramirez','carlos@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario', '2026-03-13 19:34:12');

-- Restricciones FK
ALTER TABLE `bus_ruta`
  ADD CONSTRAINT `bus_ruta_ibfk_1` FOREIGN KEY (`id_bus`)  REFERENCES `buses` (`id_bus`),
  ADD CONSTRAINT `bus_ruta_ibfk_2` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id_ruta`);

ALTER TABLE `ruta_paradas`
  ADD CONSTRAINT `ruta_paradas_ibfk_1` FOREIGN KEY (`id_ruta`)   REFERENCES `rutas`   (`id_ruta`),
  ADD CONSTRAINT `ruta_paradas_ibfk_2` FOREIGN KEY (`id_parada`) REFERENCES `paradas` (`id_parada`);

COMMIT;
