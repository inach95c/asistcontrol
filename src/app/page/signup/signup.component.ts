import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public user = {
    username : '',
    password : '',
    nombre : '',
    apellido : '',
    dni: '',
    email : '',
    telefono : '',
    ctlc: '',
    direccion: '',
    puesto: '',
    fechaDeContrato: '',
    tarifaPorHora: '',
    tarifaHoraExtra: '',

  }

  constructor(private userService:UserService,private snack:MatSnackBar) { }

  ngOnInit(): void {
  }

  /*formSubmit(){
    console.log(this.user);
    if(this.user.username == '' || this.user.username == null){
      this.snack.open('El nombre de usuario es requerido !!','Aceptar',{
        duration : 3000,
        verticalPosition : 'top',
        horizontalPosition : 'right'
      });
      return;
    }

    this.userService.añadirUsuario(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.fire('Usuario guardado','Usuario registrado con éxito en el sistema','success'); 
      },(error) => {
        console.log(error);
        this.snack.open('Ha ocurrido un error en el sistema !!','Aceptar',{
          duration : 3000 
        });
      }
    )  

  }*/

    formSubmit() {
  console.log(this.user);

  if (this.user.username === '' || this.user.username == null) {
    this.snack.open('El nombre de usuario es requerido !!', 'Aceptar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
    return;
  }

  // 🔧 Formatear fechaDeContrato si está presente
  const payload = {
    ...this.user,
    fechaDeContrato: this.user.fechaDeContrato
      ? new Date(this.user.fechaDeContrato).toISOString().split('T')[0]
      : ''
  };

  this.userService.añadirUsuario(payload).subscribe(
    (data) => {
      console.log(data);
      Swal.fire('Usuario guardado', 'Usuario registrado con éxito en el sistema', 'success');
    },
    (error) => {
      console.log(error);
      this.snack.open('Ha ocurrido un error en el sistema !!', 'Aceptar', {
        duration: 3000
      });
    }
  );
}


}
