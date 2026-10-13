-- Conteo de leads existentes sin municipio DIVIPOLA verificado.
-- No devuelve nombres, correos, ciudades ni identificadores personales.
SELECT COUNT(*) AS leads_pendientes_de_verificacion
FROM leads
WHERE municipality_code IS NULL;
