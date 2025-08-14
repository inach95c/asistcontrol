import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-categoria',
  templateUrl: './actualizar-categoria.component.html',
  styleUrls: ['./actualizar-categoria.component.css']
})
export class ActualizarCategoriaComponent implements OnInit {

  constructor(
      private route:ActivatedRoute,                 //cualquier cosa quitar lo que esta en contructor
      private categoriaService:CategoriaService,
      private router:Router
    ) { }

  categoriaId = 0;
  examen:any;                                       // todo este codigo es txd
  categoria:any;

  ngOnInit(): void {

    this.categoriaId = this.route.snapshot.params['categoriaId'];
    this.categoriaService.obtenerCategorias(this.categoriaId).subscribe(
      (data) => {
        this.categoria = data;
        console.log(this.categoria);
      },
      (error) => {
        console.log(error);
      }
    )

    this.categoriaService.listarCategorias().subscribe(
      (data:any) => {
        this.categoria = data;
      },
      (error) => {
        alert('Error al cargar el CTLC');
      }
    )
  }

  public actualizarDatos(){
      this.categoriaService.actualizarCategoria(this.categoria).subscribe(
        (data) => {
          Swal.fire('Centro actualizado','El centro ha sido actualizada con éxito','success').then(
            (e) => {
              this.router.navigate(['/admin/categorias']);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema','No se ha podido actualizar el CTLC','error');
          console.log(error);
        }
      )
    }

}
