/*export interface Horario {
  id?: number;
  diaSemana: string;
  horaEntrada: string;
  horaSalida: string;
  usuario?: {
    id: number;
  };
  usuarioId?: number; // solo lectura local
}
*/

export interface Horario {
  id?: number;
  horaEntrada: string;
  horaSalida: string;
  turno?: string;
  fechaInicio: string;       //  era fechaInicio?: string;
  // fechaInicio: string | null; 
  fechaFin?: string;
   //fechaFin?: string | null;
  toleranciaEntrada: number;
  toleranciaSalida: number;
  esConfiguracion: boolean; 


  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
    dni?: string;
    ctlc?:string;
  };
}


/*
export interface Horario {
  id: number;
  horaEntrada: string;
  horaSalida: string;
  fechaInicio: string;
  fechaFin: string;
  toleranciaEntrada: number;  // ✅ Asegúrate de que estén aquí
  toleranciaSalida: number;   // ✅
  esConfiguracion: boolean;
  usuarioId: number;
}
*/


