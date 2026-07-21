export interface MovimientoMbDto {
  id: number;
  clienteId: number;
  tipo: string;
  monto: number;
  descripcion: string | null;
  fecha: string;
  saldoResultante: number;
}