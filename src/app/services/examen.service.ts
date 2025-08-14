import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';
import { Observable } from 'rxjs';    //txd
import { Examen } from '../models/examen.model';




@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  //private apiUrl = 'http://localhost:8080/buscar';   //txd esto es del metodo buscarExamenes

  constructor(private http:HttpClient) { }

  public listarCuestionarios(){
    return this.http.get(`${baserUrl}/examen/`);
  }

  public agregarExamen(examen:any){
    return this.http.post(`${baserUrl}/examen/`,examen);
  }

  public eliminarExamen(examenId:any){
    return this.http.delete(`${baserUrl}/examen/${examenId}`);
  }

  public obtenerExamen(examenId:any){
    return this.http.get(`${baserUrl}/examen/${examenId}`);
  }

  public actualizarExamen(examen:any){
    return this.http.put(`${baserUrl}/examen/`,examen);
  }

  public listarExamenesDeUnaCategoria(categoriaId:any){
    return this.http.get(`${baserUrl}/examen/categoria/${categoriaId}`);
  }

 // public obtenerExamenesActivos(){         //original
 //   return this.http.get(`${baserUrl}/examen/activo`);
 //}

  public obtenerExamenesActivosDeUnaCategoria(categoriaId:any){
    return this.http.get(`${baserUrl}/examen/categoria/activo/${categoriaId}`);
  }

  // Método corregido para obtener los exámenes activos                           //txd
  public obtenerExamenesActivos(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${baserUrl}/examen/activo`);
  }

  searchExamen(keyword: string): Observable<Examen[]> {                          //txd
    return this.http.get<Examen[]>(`${baserUrl}/buscar?keyword=${keyword}`);
  }
    
// Método para obtener todos los exámenes desde el backend
 public obtenerExamenes(): Observable<Examen[]> {
  return this.http.get<Examen[]>(`${baserUrl}/examen/`);
}

// Metodo para contar kas DI
public contarExamenesDI(): Observable<number> {
  return this.http.get<number>(`${baserUrl}/examen/contarDI`);
}

// Metodo para contar  totalExamenesEstadoDelServicio_Con_OS_Siprec
public contarExamenesCon_OS_Siprec(): Observable<number> {
  return this.http.get<number>(`${baserUrl}/examen/contarCon_OS_Siprec`);
}

//para la insignia no lo estoy usando
public obtenerEstadoDelServicio(examenId: any): Observable<string> {
  return this.http.get<string>(`${baserUrl}/examen/estado/${examenId}`);
}

 // Nuevo método: Obtener cantidad de exámenes por categoría con estado 'Con_OS_Siprec'
 public contarExamenesPorCategoriaCon_OS_Siprec(): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(`${baserUrl}/examen/contarCon_OS_SiprecPorCategoria`);
}

//caso notificación
public obtenerConteoExamenesCTLC(ctlc: string): Observable<number> {
  return this.http.get<number>(`${baserUrl}/examen/contarExamenesPorUsuarioCTLC/${ctlc}`);
}




}//export


