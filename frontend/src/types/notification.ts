export interface NotificacionMbDto {
  id: number;
  tipo: string;
  mensaje: string;
  clienteId?: number;
  leido: boolean;
  createdAt: string;
}
