/* export interface Asistencia {
  id?: number;
  usuarioId: number;
  horaEntrada: string;
  horaSalida: string;
  falta: boolean;
  horasExtras: number;
}
*/

export interface Asistencia {
  //usuario:'',
  usuarioId: number;
  fecha: string;  // Agregamos fecha para que coincida con lo que envía Angular
  horaEntrada: string;
  horaSalida: string;
  falta: boolean;
  horasExtras: number;
  
}
