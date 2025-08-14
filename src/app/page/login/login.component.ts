import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './../../services/login.service';
import { Router } from '@angular/router';
import { SalarioService } from 'src/app/services/salario.service';
//import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   loginData = {
     "username" : '',
     "password" : ''
   }

  constructor(private snack:MatSnackBar, private loginService:LoginService,private router:Router,
    private salarioService: SalarioService
  ) { }

  ngOnInit(): void {
  }

   formSubmit(){
    console.log('Click en el botón de login');  //para ver en consola
  
//------------------------------------------------------------------------------------------  
  // Este codigo no me funciona. Pasa por el username pero no por el password  
   if(this.loginData.username.trim() == '' || this.loginData.username.trim() == null){
      this.snack.open('El nombre de usuario es requerido !!','Aceptar',{
        duration:3000
      })    
      return;
    }

    if(this.loginData.password.trim() == '' || this.loginData.password.trim() == null){
      this.snack.open('La contraseña es requerida !!','Aceptar',{
        duration:3000
      }) 
      return;
    }
//------------------------------------------------------------------------------------------

     this.loginService.generateToken(this.loginData).subscribe(
      (data:any) => {
        console.log(data);     

        this.loginService.loginUser(data.token)
        this.loginService.getCurrentUser().subscribe((user:any) => {
          this.loginService.setUser(user);
          this.salarioService.setUsuarioActual(user); // ✅ Esto lo propaga  ///
           console.log(user);

           if(this.loginService.getUserRole() == 'ADMIN'){
                // dashboard admin
               // window.location.href = '/admin';
               this.router.navigate(['admin']);  
               this.loginService.loginStatusSubjec.next(true);
           }
           else if(this.loginService.getUserRole() == 'NORMAL'){
             //user-dashboard
            // window.location.href = '/user-dashboard';
            // this.router.navigate(['user-dashboard/0']);
            this.router.navigate(['user-dashboard', 'user', 'login-asistencia']);

             this.loginService.loginStatusSubjec.next(true);
           }        
           else{
            this.loginService.logout();
           }
        })
        
      },(error) => {
        console.log(error);
        this.snack.open('Detalles inválidos , vuelva a intentar !!','Aceptar',{
          duration:3000
        })  
      }
     )  

   } // formSubmit

}
