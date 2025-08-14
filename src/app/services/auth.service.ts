import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

 

obtenerRol(): string {
  const usuario = JSON.parse(localStorage.getItem('user') || '{}');
  return usuario?.authorities?.[0]?.authority || 'usuario';
}


obtenerUsuario(): any {
  const usuarioStr = localStorage.getItem('usuario');
  return usuarioStr ? JSON.parse(usuarioStr) : null;
}




}

