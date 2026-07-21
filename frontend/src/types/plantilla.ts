export interface PlantillaMbDto {
  id: number;
  nombre: string;
  tipo: string;
  asunto?: string;
  cuerpo: string;
  variables?: string;
  activo: boolean;
  createdAt: string;
}
