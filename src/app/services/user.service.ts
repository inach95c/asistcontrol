import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }


  public añadirUsuario(user:any){
    return this.httpClient.post(`${baserUrl}/usuarios/`,user);
  }

  

  public obtenerUsuarios(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baserUrl}/usuarios/`);
  }

  public eliminarUsuario(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${baserUrl}/usuarios/${id}`);
  }

  // Método para buscar usuarios por nombre de usuario
  public buscarUsuarios(username: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baserUrl}/usuarios/buscar/${username}`);
  }
  
  // Método para actualizar usuario
  public actualizarUsuario(usuario: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/usuarios/${usuario.id}`, usuario);
  }

}
 