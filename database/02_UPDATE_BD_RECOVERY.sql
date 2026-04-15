-- ============================================================
-- ACTUALIZAR TABLA USUARIOS PARA RECUPERACIÓN DE CONTRASEÑA
-- Ejecuta esto en phpMyAdmin en la BD rutas_buses
-- ============================================================

-- Agregar columnas para manejo de tokens
ALTER IGNORE TABLE usuarios ADD COLUMN recovery_token VARCHAR(255);
ALTER IGNORE TABLE usuarios ADD COLUMN recovery_token_expiry DATETIME;
ALTER IGNORE TABLE usuarios ADD COLUMN token_used BOOLEAN DEFAULT FALSE;
