CREATE TABLE IF NOT EXISTS notificaciones_mb (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios_mb(id),
    tipo VARCHAR(20) NOT NULL DEFAULT 'info',
    mensaje TEXT NOT NULL,
    cliente_id BIGINT,
    leido BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones_mb(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones_mb(usuario_id, leido);

ALTER TABLE notificaciones_mb ADD COLUMN IF NOT EXISTS cliente_id BIGINT;
