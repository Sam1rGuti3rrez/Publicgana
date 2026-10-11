INSERT INTO rol (nombre, descripcion) VALUES
('Administrador', 'Administra todo el sistema'),
('Empresa', 'Gestiona su empresa y publicaciones'),
('Cliente', 'Consulta e interactúa con publicaciones');

INSERT INTO categoria_empresa (nombre, descripcion) VALUES
('Restaurante', 'Comida y bebidas'),
('Tecnología', 'Productos tecnológicos'),
('Moda', 'Ropa y accesorios'),
('Salud', 'Servicios médicos');

INSERT INTO usuario
(nombres, apellidos, correo, telefono, contraseña, fecha_registro, estado, id_rol)
VALUES
('Juan', 'Pérez', 'juan@publigana.com', '3001111111', '123456', CURRENT_TIMESTAMP, true, 1),

('María', 'Gómez', 'maria@publigana.com', '3002222222', '123456', CURRENT_TIMESTAMP, true, 2),

('Carlos', 'Rodríguez', 'carlos@gmail.com', '3003333333', '123456', CURRENT_TIMESTAMP, true, 3);

INSERT INTO empresa
(nombre, descripcion, direccion, telefono, correo, estado, id_usuario, id_categoria)
VALUES
('Pizza Express',
'Restaurante de comida rápida',
'Calle 10 #20-30',
'6011234567',
'contacto@pizzaexpress.com',
true,
2,
1),

('Tech Store',
'Tienda de computadores',
'Carrera 15 #30-20',
'6019876543',
'ventas@techstore.com',
true,
2,
2);

INSERT INTO publicacion
(titulo, descripcion, imagen, fecha_inicio, fecha_fin, estado, id_empresa)
VALUES
('2x1 en pizzas',
'Todos los martes promoción 2x1',
'pizza.jpg',
CURRENT_DATE,
CURRENT_DATE + INTERVAL '30 days',
true,
1),

('Descuento en portátiles',
'20% de descuento toda la semana',
'laptop.jpg',
CURRENT_DATE,
CURRENT_DATE + INTERVAL '15 days',
true,
2);

INSERT INTO comentario
(texto, fecha, id_usuario, id_publicacion)
VALUES
('Excelente promoción.', CURRENT_TIMESTAMP, 3, 1),

('Muy buenos precios.', CURRENT_TIMESTAMP, 3, 2);

INSERT INTO interaccion
(tipo, fecha, id_usuario, id_publicacion)
VALUES
('ME_GUSTA', CURRENT_TIMESTAMP, 3, 1),

('COMPARTIR', CURRENT_TIMESTAMP, 3, 2);

SELECT * FROM rol;
SELECT * FROM categoria_empresa;
SELECT * FROM usuario;
SELECT * FROM empresa;
SELECT * FROM publicacion;
SELECT * FROM comentario;
SELECT * FROM interaccion;