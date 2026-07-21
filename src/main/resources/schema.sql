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
    descripcion VARCHAR(255)
);

INSERT INTO plantillas_mb (nombre, tipo, asunto, cuerpo, variables, activo) 
SELECT 'Recordatorio de Pago', 'RECORDATORIO', 'Recordatorio de pago pendiente', 
'Hola {nombre}, te recordamos que tienes un saldo pendiente de  con vencimiento el {fecha}. Por favor realiza tu pago a la brevedad. Gracias, Importadora MB.',
'{nombre}, {monto}, {fecha}', true
WHERE NOT EXISTS (SELECT 1 FROM plantillas_mb WHERE nombre = 'Recordatorio de Pago');

INSERT INTO plantillas_mb (nombre, tipo, asunto, cuerpo, variables, activo) 
SELECT 'Notificacion de Cobro', 'COBRO', 'Aviso de cobro', 
'Estimado {nombre}, su factura con monto de  se encuentra vencida. Lo invitamos a acercarse a nuestras oficinas para regularizar su situacion.',
'{nombre}, {monto}', true
WHERE NOT EXISTS (SELECT 1 FROM plantillas_mb WHERE nombre = 'Notificacion de Cobro');

ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE clientes_mb ADD COLUMN IF NOT EXISTS cedula VARCHAR(20);