import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Asistencia } from './asistencia.service';


@Injectable({
  providedIn: 'root'
})
export class AsistenciaStateService {
  private historialSubject = new BehaviorSubject<Asistencia[]>([]);
  historial$ = this.historialSubject.asObservable();

  actualizarHistorial(nuevoHistorial: Asistencia[]): void {
    this.historialSubject.next(nuevoHistorial);
  }

  obtenerHistorialActual(): Asistencia[] {
    return this.historialSubject.getValue();
  }
}
