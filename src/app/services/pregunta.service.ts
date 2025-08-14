import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  constructor(private http:HttpClient) { }    

  public listarPreguntasDelExamen(examenId:any){
    return this.http.get(`${baserUrl}/pregunta/examen/todos/${examenId}`);
  }

  public guardarPregunta(pregunta:any){
    return this.http.post(`${baserUrl}/pregunta/`,pregunta);           
  }

  public eliminarPregunta(preguntaId:any){
    return this.http.delete(`${baserUrl}/pregunta/${preguntaId}`);          //
  }

  public actualizarPregunta(pregunta:any){
    return this.http.put(`${baserUrl}/pregunta/`,pregunta);
  }
  public actualizarPregunta1(preguntas:any){
    return this.http.put(`${baserUrl}/pregunta/`,preguntas);                //txd
  }

  public obtenerPregunta(preguntaId:any){
    return this.http.get(`${baserUrl}/pregunta/${preguntaId}`);
  }

  public listarPreguntasDelExamenParaLaPrueba(examenId:any){
    return this.http.get(`${baserUrl}/pregunta/examen/todos/${examenId}`);
  }

  public evaluarExamen(preguntas:any){
    return this.http.post(`${baserUrl}/pregunta/evaluar-examen`,preguntas);
  }
  ////////////////////////////////////////////// txd ///////////////////////////////////
 // Nuevo método para actualizar el estado de calificación                //txd
 public actualizarEstado(datos: any, token: string) {
  // Configurar las cabeceras incluyendo el token
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Realizar la solicitud PUT con las cabeceras
  return this.http.put(`${baserUrl}/pregunta/actualizar-estado`, datos, { headers });
}
  ////////////////////////////////////////////// txd ///////////////////////////////////


}
