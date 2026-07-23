CREATE TABLE IF NOT EXISTS clientes_mb (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    registration_date TIMESTAMP,
    debt NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    phone VARCHAR(20),
    email VARCHAR(100),
    cedula VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS movimientos_mb (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes_mb(id),
    tipo VARCHAR(20) NOT NULL,
    monto NUMERIC(12,2) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    saldo_resultante NUMERIC(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_movimientos_cliente ON movimientos_mb(cliente_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_mb(fecha);

CREATE TABLE IF NOT EXISTS notificaciones_mb (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'info',
    mensaje TEXT NOT NULL,
    cliente_id BIGINT,
    leido BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones_mb(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones_mb(usuario_id, leido);

CREATE TABLE IF NOT EXISTS plantillas_mb (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    asunto VARCHAR(200),
    cuerpo TEXT NOT NULL,
    variables VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auditoria_mb (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    usuario_nombre VARCHAR(150),
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id BIGINT,
    detalle TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuracion_mb (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS cedula VARCHAR(20);
ALTER TABLE configuracion_mb ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE configuracion_mb ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

INSERT INTO configuracion_mb (clave, valor, descripcion, created_at, updated_at)
SELECT * FROM (VALUES
    ('interes_mora', '2.5', 'Interés mensual por mora (%)', NOW(), NOW()),
    ('dias_gracia', '15', 'Días de gracia antes de aplicar mora', NOW(), NOW()),
    ('iva_porcentaje', '12', 'Porcentaje de IVA aplicado', NOW(), NOW()),
    ('descuento_porcentaje', '10', 'Porcentaje de descuento al activar descuento en cliente', NOW(), NOW()),
    ('whatsapp_numero', '+593 99 999 9999', 'Número de WhatsApp para notificaciones', NOW(), NOW()),
    ('email_contacto', 'info@importadoramb.com', 'Correo de contacto para notificaciones', NOW(), NOW()),
    ('limite_credito_default', '500.00', 'Límite de crédito por defecto al crear cliente', NOW(), NOW()),
    ('nombre_empresa', 'Importadora MB', 'Nombre de la empresa que se muestra en la interfaz', NOW(), NOW())
) AS v(clave, valor, descripcion, created_at, updated_at)
ON CONFLICT (clave) DO NOTHING;

INSERT INTO auditoria_mb (usuario_id, usuario_nombre, accion, entidad, entidad_id, detalle, created_at)
SELECT * FROM (VALUES
    (1, 'Sistema', 'CREAR', 'CONFIGURACION', NULL, 'Configuración inicial del sistema', NOW() - INTERVAL '30 days'),
    (4, 'Admin Principal', 'CREAR', 'CLIENTE', 1, 'Creación del cliente Juan Pérez', NOW() - INTERVAL '25 days'),
    (4, 'Admin Principal', 'CREAR', 'CLIENTE', 2, 'Creación del cliente María García', NOW() - INTERVAL '24 days'),
    (3, 'Agente Ventas', 'PAGO', 'CLIENTE', 1, 'Registro de pago por $150.00 - Saldo: $350.00', NOW() - INTERVAL '10 days'),
    (4, 'Admin Principal', 'CARGO', 'CLIENTE', 2, 'Registro de cargo por $300.00 - Saldo: $800.00', NOW() - INTERVAL '8 days'),
    (3, 'Agente Ventas', 'ACTUALIZAR', 'CLIENTE', 1, 'Actualización de teléfono y email', NOW() - INTERVAL '5 days'),
    (4, 'Admin Principal', 'ACTUALIZAR', 'CONFIGURACION', NULL, 'Interés de mora actualizado a 3.0%', NOW() - INTERVAL '3 days'),
    (3, 'Agente Ventas', 'CREAR', 'CLIENTE', 3, 'Creación del cliente Carlos López', NOW() - INTERVAL '2 days'),
    (1, 'Sistema', 'CREAR', 'USUARIO', 4, 'Creación del usuario Admin Principal', NOW() - INTERVAL '20 days'),
    (1, 'Sistema', 'CREAR', 'USUARIO', 3, 'Creación del usuario Agente Ventas', NOW() - INTERVAL '20 days')
) AS v(usuario_id, usuario_nombre, accion, entidad, entidad_id, detalle, created_at)
WHERE NOT EXISTS (SELECT 1 FROM auditoria_mb);

UPDATE auditoria_mb a
SET usuario_nombre = COALESCE((SELECT nombre FROM usuarios_mb u WHERE u.id = a.usuario_id), 'Sistema')
WHERE a.usuario_nombre IS NULL OR a.usuario_nombre = '';