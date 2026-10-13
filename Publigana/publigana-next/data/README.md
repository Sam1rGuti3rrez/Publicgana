# Catálogo municipal colombiano (DIVIPOLA)

`divipola-municipalities.json` es un snapshot de municipios (`tipo_municipio =
Municipio`) del conjunto gubernamental **DIVIPOLA - Códigos municipios**,
atribuido al Departamento Administrativo Nacional de Estadística (DANE):

- Catálogo oficial y explicación de DIVIPOLA: <https://www.dane.gov.co/index.php/sistema-estadistico-nacional-sen/normas-y-estandares/nomenclaturas-y-clasificaciones/nomenclaturas/codificacion-de-la-division-politico-administrativa-de-colombia-divipola>
- Geovisor DANE: <https://geoportal.dane.gov.co/geovisores/territorio/consulta-divipola-division-politico-administrativa-de-colombia/>
- Conjunto de datos gubernamental atribuido al DANE (ID `gdxc-w37w`): <https://www.datos.gov.co/resource/gdxc-w37w.json>

El snapshot se usa tanto por los selectores como por la validación del servidor.
El servidor resuelve cada código contra este catálogo, no contra el nombre
enviado por el cliente. Los nombres mostrados son los oficiales del conjunto.
El dato seleccionado representa la unidad político-administrativa de residencia
(municipio o distrito), no una localidad urbana independiente. La cabecera
municipal pertenece a esa unidad y no se duplica como otro municipio en el
selector; la comprobación demuestra que el código corresponde al catálogo
colombiano, pero no verifica de forma independiente el domicilio declarado.

## Actualización

1. Revisa el geovisor DIVIPOLA del DANE y confirma que el conjunto de datos de
   `datos.gov.co` sigue atribuido al DANE y conserva los campos
   `cod_mpio`, `nom_mpio`, `cod_dpto`, `dpto` y `tipo_municipio`.
2. Desde `publigana-next`, ejecuta `npm run update:divipola`. El script descarga
   solo registros clasificados como municipio y falla ante respuestas vacías,
   códigos que no sean de cinco dígitos, campos incompletos o códigos
   duplicados.
3. Revisa el diff del JSON y valida cambios de códigos/nombres con el DANE.
4. Si se retiran o agregan códigos, conserva los códigos que ya fueron
   almacenados en cuentas/leads y prepara por separado la compatibilidad de la
   base; no reasignes ubicaciones históricas automáticamente.

Las áreas no municipalizadas y las islas que el conjunto clasifica por separado
no se incluyen como municipios para esta política de registro.
