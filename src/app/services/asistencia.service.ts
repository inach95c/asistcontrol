/* ok para un solo registro 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = `${baserUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  marcarEntrada() {
    return this.http.put(`${this.apiUrl}/asistencia/entrada`, {});
  }

  marcarSalida() {
    return this.http.put(`${this.apiUrl}/asistencia/salida`, {});
  }
}
*/



import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from './helper'; // Ajusta la ruta según dónde tengas helper.ts

import { RegistroRespuestaDTO } from '../models/registro-respuesta.dto';

export interface Asistencia {
  id: number;
  fechaHora: string;
  tipo: string;
  usuario: any;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private asistenciaUrl = `${baseUrl}/asistencia`;
  private qrUrl = `${baseUrl}/qr`; // 🆕 Base para código QR

  constructor(private http: HttpClient) {}
/*
  registrar(tipo: string): Observable<any> {
    return this.http.post(`${this.asistenciaUrl}?tipo=${tipo}`, {});
  }
*/
  registrar(tipo: string): Observable<any> {
  return this.http.post(`${this.asistenciaUrl}?tipo=${tipo}`, {}, { responseType: 'text' });
}



  obtenerHistorial(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.asistenciaUrl}/historial`);
  }

  actualizarAsistencia(id: number, data: { fechaHora: string; tipo: string }): Observable<any> {
  return this.http.put(`${this.asistenciaUrl}/${id}`, data);
}

// 🆕 Método para eliminar asistencia por ID
  eliminarAsistencia(id: number) {
    return this.http.delete(`${baseUrl}/asistencia/${id}`);
  }

 generarQR(username: string, tipo: string): Observable<Blob> {
  return this.http.get(`${this.qrUrl}/generar/${username}/${tipo}`, {
    responseType: 'blob'
  });
}

generarQrDinamico(tipoEvento: string): Observable<Blob> {
  return this.http.get(`${this.qrUrl}/generar-token/${tipoEvento}`, {
    responseType: 'blob'
  });
}

/*validarQrDesdeToken(token: string): Observable<string> {
  const headers = new HttpHeaders({ 'Content-Type': 'text/plain' }); // o 'application/json' según backend
  return this.http.post(`${this.asistenciaUrl}/validar-qr`, token, {
    headers,
    responseType: 'text'
  });
}

*/

/*validarQrDesdeToken(token: string): Observable<string> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.asistenciaUrl}/validar-qr`, { token }, {
    headers,
    responseType: 'text'
  });
}
*/

validarQrDesdeToken(token: string): Observable<RegistroRespuestaDTO> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<RegistroRespuestaDTO>(
    `${this.asistenciaUrl}/validar-qr`,
    { token },
    { headers }
  );
}

registrarDesdeJwt(token: string): Observable<string> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get(`${this.asistenciaUrl}/registrar-por-jwt`, {
    params: { token },
    headers,
    responseType: 'text' // porque el backend devuelve texto plano
  });
}

  
}
