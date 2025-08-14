import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http:HttpClient) { }


  public listarCategorias(){
    return this.http.get(`${baserUrl}/categoria/`);
  }
//esta parte no lo ha agregado aun minuto 2:34:13
  public agregarCategoria(categoria:any){
    return this.http.post(`${baserUrl}/categoria/`,categoria);
  }

  //txd
  public eliminarCategoria(categoriaId:any){
    return this.http.delete(`${baserUrl}/categoria/${categoriaId}`);
  }

  public obtenerCategorias(categoriaId:any){
    return this.http.get(`${baserUrl}/categoria/${categoriaId}`);              //txd
  }

  public actualizarCategoria(categoria:any){
    return this.http.put(`${baserUrl}/categoria/`,categoria);                     //txd

}
}
