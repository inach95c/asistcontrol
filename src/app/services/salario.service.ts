/*
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


import baserUrl from './helper';
import { HorasTrabajadas } from '../models/horas-trabajadas';
import { Usuario } from '../models/usuario';


@Injectable({ providedIn: 'root' })
export class SalarioService {
  constructor(private http: HttpClient) {}

  private asistenciasDiarias: HorasTrabajadas[] = [];

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${baserUrl}/usuarios/`);
  }



  getHorasTrabajadas(mes: string): Observable<HorasTrabajadas[]> {
  return this.http.get<HorasTrabajadas[]>(`${baserUrl}/horarios/horas-trabajadas?mes=${mes}`);
}

// 🔁 Métodos para compartir datos en memoria
  setAsistenciasDiarias(data: HorasTrabajadas[]): void {
    this.asistenciasDiarias = data;
  }

  getAsistenciasDiarias(): HorasTrabajadas[] {
    return this.asistenciasDiarias;
  }


}*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import baserUrl from './helper';
import { HorasTrabajadas } from '../models/horas-trabajadas';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class SalarioService {
  constructor(private http: HttpClient) {}

  // 🔁 Datos compartidos en memoria
  private asistenciasDiarias: HorasTrabajadas[] = [];
  private usuariosCache: Usuario[] = [];

  // 📦 API: Obtener usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${baserUrl}/usuarios/`);
  }

  // 📦 API: Obtener horas trabajadas por mes
  getHorasTrabajadas(mes: string): Observable<HorasTrabajadas[]> {
    return this.http.get<HorasTrabajadas[]>(`${baserUrl}/horarios/horas-trabajadas?mes=${mes}`);
  }

  // 🔁 Compartir asistencias diarias entre componentes
  setAsistenciasDiarias(data: HorasTrabajadas[]): void {
    this.asistenciasDiarias = data;
  }

  getAsistenciasDiarias(): HorasTrabajadas[] {
    return this.asistenciasDiarias;
  }

  // 🔁 Compartir usuarios en memoria
  setUsuariosCache(usuarios: Usuario[]): void {
    this.usuariosCache = usuarios;
  }

  getUsuariosSync(): Usuario[] {
    return this.usuariosCache;
  }

// 🔐 Usuario actual en sesión

private usuarioActual: Usuario | undefined;

/*setUsuarioActual(usuario: Usuario) {
  this.usuarioActual = usuario;
}*/

getUsuarioActual(): Usuario | undefined {
  return this.usuarioActual;
}

setUsuarioActual(usuario: Usuario): void {
  this.usuarioActual = usuario;
}


}

