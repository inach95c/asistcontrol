/*import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
//import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  user:any = null;
  
    constructor(private loginService:LoginService) { }
  
    ngOnInit(): void {
      this.user = this.loginService.getUser();
      /*this.loginService.getCurrentUser().subscribe(
        (user:any) => {
          this.user = user;
        },
        (error) => {
         alert("error");
        }
    aqui va el cierre del *   )
    }
  
  }
  
*/

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  user: any = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Petición al backend para obtener el usuario actual completo
    this.loginService.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        console.log('Usuario cargado:', this.user); // Para verificar campos como horaEntrada y horaSalida
      },
      (error) => {
        console.error('Error al cargar usuario actual', error);
        alert('No se pudo cargar el perfil del usuario');
      }
    );
  }
}
