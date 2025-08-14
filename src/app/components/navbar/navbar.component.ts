import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../services/login.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExamenService } from '../../services/examen.service';
import { CategoriaService } from '../../services/categoria.service';
import { Examen } from '../../models/examen.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import baserUrl from '../../services/helper';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  categorias: any;
  totalExamenesEstadoDelServicio_Con_OS_Siprec: number = 0;
  conteoExamenesPorCategoria: { [key: string]: number } = {};
  examenes: Examen[] = [];
  cantidadExamenesPendientes: number = 0; // Nueva variable para la notificación

  constructor(
    public login: LoginService,
    private http: HttpClient,
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private examenService: ExamenService,
    private router: Router
  ) {}

  ngOnInit(): void {
   /* // Verificar si el usuario está autenticado
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    
    if (this.isLoggedIn && this.user) {
      this.obtenerCantidadExamenesPendientes(this.user.ctlc);
    }

    // Cargar datos adicionales
    this.cargarCategorias();
    this.obtenerCantidadExamenesPorCategoriaCon_OS_Siprec();
    this.obtenerCantidadExamenesCon_OS_Siprec();
    */

    // Verificar si el usuario está autenticado
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    
    if (this.isLoggedIn && this.user) {
      this.obtenerCantidadExamenesPendientes(this.user.ctlc);

      // Actualizar la notificación automáticamente cada 30 segundos
      setInterval(() => this.obtenerCantidadExamenesPendientes(this.user.ctlc), 30000);
    }

    // Cargar datos adicionales
    this.cargarCategorias();
    this.obtenerCantidadExamenesPorCategoriaCon_OS_Siprec();
    this.obtenerCantidadExamenesCon_OS_Siprec();
  }

  // Obtener cantidad de exámenes pendientes por usuario
  obtenerCantidadExamenesPendientes(ctlc: string): void {
    this.examenService.obtenerConteoExamenesCTLC(ctlc).subscribe({
      next: (data) => {
        this.cantidadExamenesPendientes = data;
      },
    /*  error: (error) => {
        console.error("Error al obtener la cantidad de solicitudes pendientes:", error);
      }*/
    });
  }

  // Cargar categorías desde el backend
  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: (error) => {
     //   this.snack.open('Error  al cargar las solicitudes', '', { duration: 3000 });
        console.log(error);
      }
    });
  }

  // Obtener cantidad de exámenes por categoría con estado 'Con_OS_Siprec'
  obtenerCantidadExamenesPorCategoriaCon_OS_Siprec(): void {
    this.examenService.contarExamenesPorCategoriaCon_OS_Siprec().subscribe({
      next: (data) => {
        this.conteoExamenesPorCategoria = data;
      },
      error: (error) => {
        console.error("Error al obtener cantidad de solicitudes por centros:", error);
      }
    });
  }

  // Obtener cantidad total de exámenes con estado 'Con_OS_Siprec'
  obtenerCantidadExamenesCon_OS_Siprec(): void {
    this.examenService.contarExamenesCon_OS_Siprec().subscribe({
      next: (data) => {
        this.totalExamenesEstadoDelServicio_Con_OS_Siprec = data;
      },
      error: (error) => {
        console.error("Error al obtener la cantidad de solicitudes:", error);
      }
    });
  }

  // Mostrar detalles de los exámenes pendientes al hacer clic en la notificación
  mostrarDetalles(): void {
    alert(`Tienes ${this.cantidadExamenesPendientes} solicitudes pendientes.`);
  }

 /* // Cerrar sesión y recargar la página
  public logout() {
    this.login.logout();
    window.location.reload();
    
  }
  
*/
  public logout() {
    this.login.logout();
    this.router.navigate([`${baserUrl}/home`]); // Redirige a la página "home"
  }


}
