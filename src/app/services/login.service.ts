import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
//private baseUrl = 'http://localhost:8080';     //mio

  public loginStatusSubjec = new Subject<boolean>();                  // loginStatusSubjec

  constructor(private http:HttpClient) { }
 
  // Generamos el token
  public generateToken(loginData:any){
    return this.http.post(`${baserUrl}/generate-token`,loginData);
  }

//iniciamos sesión y establecemos el token en el localStorage
public loginUser(token:any){
  localStorage.setItem('token',token);
  return true;                                                  //no lo puso pero esta en code yputuve
}

public isLoggedIn(){
  let tokenStr = localStorage.getItem('token');
  if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
    return false;
  }else{
    return true;
  }
}

//cerramos sesion y eliminamos el token del localStorage
public logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
}

//obtenemos el token
public getToken(){
  return localStorage.getItem('token');
}

/* copilot
// Método para obtener el token desde localStorage
getToken(): string | null {
  return localStorage.getItem('token');
}
*/

public setUser(user:any){
  localStorage.setItem('user', JSON.stringify(user));         //convierte un valor de javaScrip a un JSON
}

public getUser(){
  let userStr = localStorage.getItem('user');
  if(userStr != null){
    return JSON.parse(userStr);
  }else{
    this.logout();
    return null;
  }
}

public getUserRole(){
  let user = this.getUser();
  return user.authorities[0].authority;
}

//este codigo el loco lo tiene en su code pero no lo mensiona en la explicación. lo mensiona y lo hace en el minuto 5:52
public getCurrentUser(){
  return this.http.get(`${baserUrl}/actual-usuario`);
}


 
}//fin export
