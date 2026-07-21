export interface AuditoriaMbDto {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  accion: string;
  entidad: string;
  entidadId?: number;
  detalle?: string;
  createdAt: string;
}
