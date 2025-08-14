export interface HorarioAsignado {
  usuario?: { id: number };
  fechaInicio: string | Date;
  fechaFin?: string | Date;
}
