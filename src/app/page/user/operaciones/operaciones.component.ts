import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaService } from '../../../services/pregunta.service';
import Swal from 'sweetalert2';
import { ExamenService } from '../../../services/examen.service';
import { CategoriaService } from '../../../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
 // selector: 'app-operaciones',
  selector:'app-actualizar-examen',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.css'],
})
export class OperacionesComponent implements OnInit {
  examenId: any;
  preguntas: any;
  puntosConseguidos = 0;
  respuestasCorrectas = 0;
  intentos = 0;
 

  esEnviadoInversiones = false;
  timer: any;

  preguntaId: any = 0;

  examen:any;
  categorias:any;
  //snack: any;

  constructor(
    private route: ActivatedRoute,
    private preguntaService: PreguntaService,
    private snack:MatSnackBar,
    private router: Router,
    //-------------------------------------------
    private examenService:ExamenService,
    private categoriaService:CategoriaService
    //--------------------------------------------    
  ) {}

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['examenId'];
    this.cargarPreguntas();
    this.preguntaId = this.route.snapshot.params['preguntaId'];
    this.preguntaService.obtenerPregunta(this.preguntaId).subscribe(
      (data: any) => {
        this.preguntas = data;
        console.log(this.preguntas);
      },
      (error) => {
        console.log(error);
      }
    );
    ///////////////////////////////////////////////////

    this.examenId = this.route.snapshot.params['examenId'];
    this.examenService.obtenerExamen(this.examenId).subscribe(
      (data) => {
        this.examen = data;
        console.log(this.examen);
      },
      (error) => {
        console.log(error);
      }
    )

    this.categoriaService.listarCategorias().subscribe(
      (data:any) => {
        this.categorias = data;
      },
      (error) => {
        alert('Error al cargar las categorías');
      }
    )

    //////////////////////////////////////////////////


  } // fin ngOnInint

  public actualizarDatos(){

    if(this.examen.evaluacion.trim() == '' || this.examen.evaluacion == null ){
      this.snack.open('Por favor rellenar los campos requeridos','',{
        duration:3000
      });
      return ;
    }

    
      this.examenService.actualizarExamen(this.examen).subscribe(
        (data) => {
          Swal.fire('Solicitud actualizada','La solicitud ha sido actualizada con éxito','success').then(
            (e) => {
              this.router.navigate(['/user-dashboard/0']);    //para usuario operaciones debo verificar
            }                                               // la ruta ojo  
          );
        },
        (error) => {
          Swal.fire('Error en el sistema','No se ha podido actualizar la solicitud','error');
          console.log(error);
        }
      )
    }

  cargarPreguntas() {
    this.preguntaService.listarPreguntasDelExamenParaLaPrueba(this.examenId).subscribe(
      (data: any) => {
        console.log(data);
        this.preguntas = data;
        this.timer = this.preguntas.length * 2 * 60;
        this.preguntas.forEach((p: any) => {
          p['respuestaDada'] = '';
        });
        console.log(this.preguntas);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar las solicitudes', 'error');
      }
    );
  }

  enviarCuestionario() {
    Swal.fire({
      title: '¿Quieres enviar el examen?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      icon: 'info',
    }).then((e) => {
      if (e.isConfirmed) {
        this.evaluarExamen();
      }
    });
  }

  evaluarExamen() {
    this.preguntaService.evaluarExamen(this.preguntas).subscribe(
      (data: any) => {
        console.log(data);
        this.puntosConseguidos = data.puntosMaximos;
        this.respuestasCorrectas = data.respuestasCorrectas;
        this.intentos = data.intentos;
       
        this.esEnviadoInversiones = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ////////////////////////////////////////////// txd ///////////////////////////////////
  public actualizarEstadoDeCalificacion(): void {
    const datosParaActualizar = {
      estadoDeCalificacionDeLosCentros: this.preguntas[0].estadoDeCalificacionDeLosCentros,
    };

    // Obtener el token JWT almacenado en localStorage  jwtToken
    const token = localStorage.getItem('token');

    // Validar si el token está disponible
    if (!token) {
      Swal.fire('Error', 'No tienes permisos para realizar esta acción. Por favor, inicia sesión.', 'error');
      return;
    }

    // Llamar al método en el servicio y pasar los datos junto con el token
    this.preguntaService.actualizarEstado(datosParaActualizar, token).subscribe(
      (data: any) => {
        Swal.fire('¡Éxito!', 'El estado de calificación se actualizó correctamente.', 'success');
        console.log('Respuesta del servidor:', data);
      },
      (error: any) => {
        Swal.fire('Error', 'Hubo un problema al actualizar el estado.', 'error');
        console.error('Error al actualizar:', error);
      }
    );
  }
    ////////////////////////////////////////////// txd ///////////////////////////////////
}
