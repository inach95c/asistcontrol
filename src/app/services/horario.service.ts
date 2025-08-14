import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../models/horario';
import baseUrl from './helper';

import { HttpHeaders } from '@angular/common/http'; // 👈 asegúrate de tener esta importación

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${baseUrl}/horarios`;

  constructor(private http: HttpClient) {}

  obtenerTodosLosHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/listado-completo`);
  }

  crearHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  obtenerHorariosPorUsuario(usuarioId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }




  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  eliminarTodosHorariosPorUsuario(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuario/${usuarioId}/todos`);
  }
/*
  actualizarHorario(id: number, horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/${id}`, horario);
  }
*/
  asignarHorarioMultiple(payload: {
  usuariosIds: number[],
  horario: any,
  dividirPorDias: boolean
}): Observable<any> {
  return this.http.post(`${this.apiUrl}/asignar-multiple`, payload);
}

  actualizarHorario(id: number, datos: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, datos);
}

/** ✅ NUEVO MÉTODO: Asignar un horario por cada día del rango  no lo uso*/
asignarHorariosPorDia(payload: {
  usuariosIds: number[],
  horarios: {
    horaEntrada: string,
    horaSalida: string,
    fechaInicio: string,
    fechaFin: string
  }[]
}): Observable<any> {
  return this.http.post(`${this.apiUrl}/asignar-por-dia`, payload);
}

getHorarioDeHoy(): Observable<Horario> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<Horario>(`${this.apiUrl}/actual`, { headers });
}

/*Tolerancia*/

// 🕒 Tolerancias configurables localmente
private toleranciaMinEntrada: number = 30;
private toleranciaMinSalida: number = 0;

getToleranciaEntrada(): number {
  return this.toleranciaMinEntrada;
}

getToleranciaSalida(): number {
  return this.toleranciaMinSalida;
}

setToleranciaEntrada(minutos: number): void {
  this.toleranciaMinEntrada = minutos;
}

setToleranciaSalida(minutos: number): void {
  this.toleranciaMinSalida = minutos;
}


obtenerTolerancia(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(`${this.apiUrl}/tolerancia`, { headers });
}




guardarTolerancia(toleranciaEntrada: number, toleranciaSalida: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const datos = {
    toleranciaEntrada,
    toleranciaSalida
  };

  // 🔄 CAMBIA esto:
  // return this.http.post(`${this.apiUrl}/guardar-tolerancia`, datos, { headers });

  // ✅ POR esto:
  return this.http.post(`${this.apiUrl}/tolerancia`, datos, { headers });
}


obtenerToleranciaEntrada(usuarioId: number, fecha: string): Observable<number> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<number>(`${this.apiUrl}/tolerancia-entrada?usuarioId=${usuarioId}&fecha=${fecha}`, { headers });
}


getHorariosDelDia(): Observable<Horario[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<Horario[]>(`${this.apiUrl}/actual-multiple`, { headers });
}


obtenerHorasNormalesPorDia(): Observable<{ horasNormalesPorDia: number }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<{ horasNormalesPorDia: number }>(`${this.apiUrl}/horas-normales`, { headers });
}

guardarHorasNormalesPorDia(horasNormalesPorDia: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const datos = { horasNormalesPorDia };

  return this.http.post(`${this.apiUrl}/horas-normales`, datos, { headers });
}







}
