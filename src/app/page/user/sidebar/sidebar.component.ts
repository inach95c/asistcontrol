

/*

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../services/categoria.service';
import { ExamenService } from '../../../services/examen.service';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() cerrarMenu = new EventEmitter<void>(); // 👈 Emitimos evento al hacer clic

  categorias: any;
  examenes: Examen[] = [];
  totalExamenesEstadoDelServicio_Con_OS_Siprec: number = 0;
  conteoExamenesPorCategoria: { [key: string]: number } = {};

  constructor(
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private examenService: ExamenService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.obtenerCantidadExamenesPorCategoriaCon_OS_Siprec();
    this.obtenerCantidadExamenesCon_OS_Siprec();
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: () => {
        this.snack.open('Error al cargar las categorías', '', { duration: 3000 });
      }
    });
  }

  obtenerCantidadExamenesPorCategoriaCon_OS_Siprec(): void {
    this.examenService.contarExamenesPorCategoriaCon_OS_Siprec().subscribe({
      next: (data) => {
        this.conteoExamenesPorCategoria = data;
      },
      error: (error) => {
        console.error("Error al obtener cantidad por categoría:", error);
      }
    });
  }

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

  cerrarSesion(): void {
  // Puedes ajustar esta lógica según tu sistema de autenticación
  localStorage.clear(); // por ejemplo
  window.location.href = '/login'; // o usar Router para navegar
}

}
*/

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../services/categoria.service';
import { ExamenService } from '../../../services/examen.service';
import { Examen } from '../../../models/examen.model';
import { Router } from '@angular/router'; // 👈 Importa Router

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() cerrarMenu = new EventEmitter<void>();

  categorias: any;
  examenes: Examen[] = [];
  totalExamenesEstadoDelServicio_Con_OS_Siprec: number = 0;
  conteoExamenesPorCategoria: { [key: string]: number } = {};

  constructor(
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private examenService: ExamenService,
    private router: Router // 👈 Inyecta Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.obtenerCantidadExamenesPorCategoriaCon_OS_Siprec();
    this.obtenerCantidadExamenesCon_OS_Siprec();
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: () => {
        this.snack.open('Error al cargar las categorías', '', { duration: 3000 });
      }
    });
  }

  obtenerCantidadExamenesPorCategoriaCon_OS_Siprec(): void {
    this.examenService.contarExamenesPorCategoriaCon_OS_Siprec().subscribe({
      next: (data) => {
        this.conteoExamenesPorCategoria = data;
      },
      error: (error) => {
        console.error("Error al obtener cantidad por categoría:", error);
      }
    });
  }

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

  cerrarSesion(): void {
    localStorage.clear(); // Limpia datos de sesión
    this.snack.open('Sesión cerrada correctamente', '', { duration: 2000 }); // 👈 Mensaje opcional
    this.cerrarMenu.emit(); // 👈 Cierra el menú si aplica
    this.router.navigate(['/login']); // 👈 Redirige a login
  }
}
