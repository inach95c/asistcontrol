/*import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categorias',
  templateUrl: './view-categorias.component.html',
  styleUrls: ['./view-categorias.component.css']
})
export class ViewCategoriasComponent implements OnInit {


  categorias:any =[
    

  ]

  constructor(private categoriaService:CategoriaService) { }

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe(
      (dato:any) =>{
        this.categorias = dato;
        console.log(this.categorias);
      },
      (error) =>{
        console.log(error);
        Swal.fire('Error !!','Error al cargar los centros','error');
      }
    )
  }

  //txd
   eliminarCategoria(categoriaId:any){
      Swal.fire({
        title:'Eliminar centro de TC',
        text:'¿Estás seguro de eliminar la centro?',
        icon:'warning',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if(result.isConfirmed){
          this.categoriaService.eliminarCategoria(categoriaId).subscribe(
            (data) => {
              this.categorias = this.categorias.filter((categoria:any) => categoria.categoriaIdId != categoriaId);
              Swal.fire('Centro eliminado','El centro ha sido eliminado de la base de datos','success');
              
            },
            (error) => {
              Swal.fire('Error','Error al eliminar el centro','error');
            }    
          )
        }
      })
    }

}
*/

import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categorias',
  templateUrl: './view-categorias.component.html',
  styleUrls: ['./view-categorias.component.css']
})
export class ViewCategoriasComponent implements OnInit {
  categorias: any[] = [];
  filteredCategorias: any[] = [];
  paginatedCategorias: any[] = [];
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe(
      (dato: any) => {
        this.categorias = dato;
        this.filteredCategorias = dato;
        this.updatePaginatedData();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error !!', 'Error al cargar los centros', 'error');
      }
    );
  }

  applyFilter(filterValue: string) {
    this.filteredCategorias = this.categorias.filter(c =>
      c.titulo.toLowerCase().includes(filterValue.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.pageIndex = 0; // Reiniciar la paginación al aplicar un filtro
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategorias = this.filteredCategorias.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedData();
  }

  eliminarCategoria(categoriaId: any) {
    Swal.fire({
      title: 'Eliminar centro de TC',
      text: '¿Estás seguro de eliminar el centro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(categoriaId).subscribe(
          (data) => {
            this.categorias = this.categorias.filter((categoria: any) => categoria.categoriaId !== categoriaId);
            this.filteredCategorias = this.filteredCategorias.filter((categoria: any) => categoria.categoriaId !== categoriaId);
            this.updatePaginatedData(); // Actualizar la paginación después de la eliminación
            Swal.fire('Centro eliminado', 'El centro ha sido eliminado de la base de datos', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el centro', 'error');
          }
        );
      }
    });
  }
}
