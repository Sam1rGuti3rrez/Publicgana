-- Conteo de cuentas existentes sin municipio DIVIPOLA verificado.
-- No devuelve nombres, correos, teléfonos ni identificadores personales.
SELECT rol.nombre AS rol, COUNT(*) AS cuentas_pendientes
FROM usuario
JOIN rol ON rol.id_rol = usuario.rol_id
WHERE usuario.municipality_code IS NULL
  AND UPPER(rol.nombre) IN ('PROMOTOR', 'NEGOCIO')
GROUP BY rol.nombre
ORDER BY rol.nombre;
